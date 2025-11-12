export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function PATCH(req, { params }) {
  try {
    const supabase = createSupabaseAdmin();
    const id = Number(params.id);
    if (!Number.isFinite(id) || id <= 0)
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });
    const body = await req.json().catch(() => ({}));

    const allowed = {};
    if ("title" in body) allowed.title = String(body.title || "").trim();
    if ("slug" in body) allowed.slug = String(body.slug || "").trim();
    if ("description" in body) allowed.description = body.description ?? null;
    if ("price_cents" in body)
      allowed.price_cents = Math.max(
        0,
        Math.round(Number(body.price_cents || 0))
      );
    if ("currency" in body)
      allowed.currency = String(body.currency || "EUR")
        .slice(0, 3)
        .toUpperCase();
    if ("active" in body) allowed.active = !!body.active;
    if ("sku_code" in body)
      allowed.sku_code = body.sku_code
        ? String(body.sku_code).toUpperCase()
        : null;
    if ("stock_qty" in body)
      allowed.stock_qty = Math.max(0, parseInt(body.stock_qty || 0, 10));
    if ("options" in body)
      allowed.options = Array.isArray(body.options) ? body.options : [];

    // basic validations
    if (allowed.slug && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(allowed.slug))
      return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
    if (allowed.currency && !/^[A-Z]{3}$/.test(allowed.currency))
      return NextResponse.json({ error: "Invalid currency" }, { status: 400 });
    if (allowed.sku_code && !/^[A-Z0-9-_.]+$/.test(allowed.sku_code))
      return NextResponse.json({ error: "Invalid SKU code" }, { status: 400 });

    // conflicts
    if (allowed.slug || allowed.sku_code) {
      const orParts = [];
      if (allowed.slug) orParts.push(`slug.eq.${allowed.slug}`);
      if (allowed.sku_code) orParts.push(`sku_code.eq.${allowed.sku_code}`);
      const conf = await supabase
        .from("shop_product")
        .select("id, slug, sku_code")
        .or(orParts.join(","))
        .neq("id", id)
        .limit(1);
      if (conf.error) throw conf.error;
      if (conf.data?.length) {
        const c = conf.data[0];
        if (allowed.slug && c.slug === allowed.slug)
          return NextResponse.json(
            { error: "Slug already in use" },
            { status: 409 }
          );
        if (allowed.sku_code && c.sku_code === allowed.sku_code)
          return NextResponse.json(
            { error: "SKU already in use" },
            { status: 409 }
          );
      }
    }

    const upd = await supabase
      .from("shop_product")
      .update(allowed)
      .eq("id", id)
      .select("id")
      .single();
    if (upd.error) throw upd.error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Failed to update" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const supabase = createSupabaseAdmin();
    const id = Number(params.id);
    if (!Number.isFinite(id) || id <= 0)
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const del = await supabase.from("shop_product").delete().eq("id", id);
    if (del.error) throw del.error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Failed to delete" },
      { status: 500 }
    );
  }
}
