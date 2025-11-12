export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req) {
  try {
    const supabase = createSupabaseAdmin();
    const { searchParams } = new URL(req.url);
    const status = (searchParams.get("status") || "all").toLowerCase();
    const q = (searchParams.get("q") || "").trim();
    const limit = Math.min(
      parseInt(searchParams.get("limit") || "50", 10),
      200
    );

    let query = supabase
      .from("shop_order")
      .select(
        "id, status, total_cents, currency, placed_at, created_at, user_id, stripe_payment_intent_id, customer_email"
      )
      .order("created_at", { ascending: false })
      .limit(limit);

    if (status !== "all") query = query.eq("status", status);
    if (q) {
      if (/^\d+$/.test(q)) {
        query = query.eq("id", Number(q));
      } else {
        query = query.ilike("customer_email", `%${q}%`);
      }
    }

    const { data, error } = await query;
    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
