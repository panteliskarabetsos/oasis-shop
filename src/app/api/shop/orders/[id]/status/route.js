export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

const ALLOWED = new Set(["pending", "paid", "fulfilled", "cancelled"]);

export async function POST(req, { params }) {
  try {
    const supabase = createSupabaseAdmin();
    const id = Number(params.id);
    if (!Number.isFinite(id) || id <= 0)
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const body = await req.json().catch(() => ({}));
    const status = String(body.status || "").toLowerCase();
    if (!ALLOWED.has(status))
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });

    const upd = await supabase
      .from("shop_order")
      .update({ status })
      .eq("id", id);
    if (upd.error) throw upd.error;

    return NextResponse.json({ status });
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Failed to set status" },
      { status: 500 }
    );
  }
}
