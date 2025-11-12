export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req) {
  try {
    const supabase = createSupabaseAdmin();
    const { searchParams } = new URL(req.url);
    const q = (searchParams.get("search") || "").trim();

    let query = supabase
      .from("shop_product")
      .select("id, slug, title, price_cents, currency, active, updated_at")
      .order("updated_at", { ascending: false })
      .limit(200);

    if (q) {
      query = query.or(`title.ilike.%${q}%,slug.ilike.%${q}%`);
    }

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const supabase = createSupabaseAdmin();
    const body = await req.json().catch(() => ({}));

    const title = String(body.title || "").trim();
    const slug = String(body.slug || "").trim();
    const description =
      typeof body.description === "string" ? body.description : null;
    const price_cents = Math.round(Number(body.price_cents || 0));
    const currency = String(body.currency || "EUR")
      .slice(0, 3)
      .toUpperCase();
    const active = !!body.active;
    const sku_code =
      (body.sku_code ? String(body.sku_code).trim().toUpperCase() : null) ||
      null;
    const stock_qty = Number.isFinite(Number(body.stock_qty))
      ? Math.max(0, Number(body.stock_qty))
      : 0;
    const options = Array.isArray(body.options) ? body.options : [];

    if (!title)
      return NextResponse.json({ error: "Title required" }, { status: 400 });
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    if (!(price_cents > 0))
      return NextResponse.json(
        { error: "price_cents must be > 0" },
        { status: 400 }
      );
    if (!/^[A-Z]{3}$/.test(currency))
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
    if (sku_code && !/^[A-Z0-9-_.]+$/.test(sku_code))
      return NextResponse.json({ error: "Invalid SKU code" }, { status: 400 });

    // check conflicts
    const conf = await supabase
      .from("shop_product")
      .select("id, slug, sku_code")
      .or(`slug.eq.${slug}${sku_code ? `,sku_code.eq.${sku_code}` : ""}`)
      .limit(1);

    if (conf.error) throw conf.error;
    if (conf.data?.length) {
      const c = conf.data[0];
      if (c.slug === slug)
        return NextResponse.json(
          { error: "Slug already in use" },
          { status: 409 }
        );
      if (sku_code && c.sku_code === sku_code)
        return NextResponse.json(
          { error: "SKU already in use" },
          { status: 409 }
        );
    }

    const ins = await supabase
      .from("shop_product")
      .insert([
        {
          title,
          slug,
          description,
          price_cents,
          currency,
          active,
          sku_code,
          stock_qty,
          options,
        },
      ])
      .select("id, slug")
      .single();

    if (ins.error) throw ins.error;
    return NextResponse.json(ins.data, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Failed to create product" },
      { status: 500 }
    );
  }
}
