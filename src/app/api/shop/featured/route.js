// /app/api/shop/featured/route.js
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req) {
  try {
    const supabase = createSupabaseAdmin();
    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "8", 10), 24);

    // Try curated list from AppSetting (array of slugs)
    const setting = await supabase
      .from("AppSetting")
      .select("value")
      .eq("key", "shop.featured_slugs")
      .maybeSingle();

    let products = [];
    if (Array.isArray(setting.data?.value) && setting.data.value.length) {
      const slugs = setting.data.value.slice(0, limit);
      const r = await supabase
        .from("shop_product")
        .select("id, title, slug, description, price_cents, currency")
        .in("slug", slugs)
        .eq("active", true);
      if (r.error) throw r.error;
      const bySlug = Object.fromEntries((r.data || []).map((p) => [p.slug, p]));
      products = slugs.map((s) => bySlug[s]).filter(Boolean);
    }

    // Fallback: latest active products
    if (!products.length) {
      const r2 = await supabase
        .from("shop_product")
        .select(
          "id, title, slug, description, price_cents, currency, created_at"
        )
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(limit);
      if (r2.error) throw r2.error;
      products = r2.data || [];
    }

    // Primary image per product from shop_image (NOT shop_product_image)
    const ids = products.map((p) => p.id);
    let primaryByProduct = {};
    if (ids.length) {
      const imgRes = await supabase
        .from("shop_image")
        .select("product_id, url, sort")
        .in("product_id", ids)
        .order("sort", { ascending: true });

      // If the table truly doesn't exist, PostgREST will complain.
      // We catch and still return products without images.
      if (
        imgRes.error?.code === "42P01" ||
        /relation .* does not exist/i.test(imgRes.error?.message || "")
      ) {
        // swallow; no images
      } else if (imgRes.error) {
        throw imgRes.error;
      } else {
        for (const row of imgRes.data || []) {
          if (!primaryByProduct[row.product_id]) {
            primaryByProduct[row.product_id] = row.url; // first (lowest sort)
          }
        }
      }
    }

    const payload = products.map((p) => ({
      slug: p.slug,
      title: p.title,
      description: p.description,
      price_cents: p.price_cents,
      currency: p.currency || "EUR",
      image_url: primaryByProduct[p.id] || null,
    }));

    return NextResponse.json(payload);
  } catch (e) {
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 });
  }
}
