export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET() {
  try {
    const supabase = createSupabaseAdmin();

    const [pAll, pActive, oPending, rev] = await Promise.all([
      supabase
        .from("shop_product")
        .select("id", { count: "exact", head: true }),
      supabase
        .from("shop_product")
        .select("id", { count: "exact", head: true })
        .eq("active", true),
      supabase
        .from("shop_order")
        .select("id", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("shop_order")
        .select("total_cents, placed_at")
        .in("status", ["paid", "fulfilled"])
        .gte(
          "placed_at",
          new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        ),
    ]);

    if (pAll.error) throw pAll.error;
    if (pActive.error) throw pActive.error;
    if (oPending.error) throw oPending.error;
    if (rev.error) throw rev.error;

    const revenue30dCents = (rev.data || []).reduce(
      (s, r) => s + (r.total_cents || 0),
      0
    );

    return NextResponse.json({
      productCount: pAll.count || 0,
      activeProductCount: pActive.count || 0,
      ordersPendingCount: oPending.count || 0,
      revenue30dCents,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 });
  }
}
