export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req, { params }) {
  try {
    const slug = decodeURIComponent(params.slug || "");
    if (!slug)
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });

    const supabase = createSupabaseAdmin();

    const prod = await supabase
      .from("shop_product")
      .select(
        "id, title, slug, description, price_cents, currency, options, stock_qty, active"
      )
      .eq("slug", slug)
      .single();

    if (prod.error) throw prod.error;
    if (!prod.data || !prod.data.active)
      return NextResponse.json({ error: "Not found" }, { status: 404 });

    const imgs = await supabase
      .from("shop_product_image")
      .select("id, url, alt, sort, is_primary")
      .eq("product_id", prod.data.id)
      .order("is_primary", { ascending: false })
      .order("sort", { ascending: true });

    if (imgs.error) throw imgs.error;
    return NextResponse.json({ ...prod.data, images: imgs.data || [] });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 });
  }
}
