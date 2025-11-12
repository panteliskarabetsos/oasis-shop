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

    // get product_id (for primary swap)
    const cur = await supabase
      .from("shop_product_image")
      .select("product_id")
      .eq("id", id)
      .single();
    if (cur.error) throw cur.error;
    const pid = cur.data.product_id;

    const patch = {};
    if ("url" in body) patch.url = String(body.url || "");
    if ("alt" in body) patch.alt = body.alt ?? null;
    if ("sort" in body) patch.sort = Math.max(0, parseInt(body.sort || 0, 10));
    if ("is_primary" in body) patch.is_primary = !!body.is_primary;

    if (patch.is_primary) {
      await supabase
        .from("shop_product_image")
        .update({ is_primary: false })
        .eq("product_id", pid);
    }

    const upd = await supabase
      .from("shop_product_image")
      .update(patch)
      .eq("id", id)
      .select("id")
      .single();
    if (upd.error) throw upd.error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Failed to update image" },
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

    const del = await supabase.from("shop_product_image").delete().eq("id", id);
    if (del.error) throw del.error;
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Failed to delete image" },
      { status: 500 }
    );
  }
}
