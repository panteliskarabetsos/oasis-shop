export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req, { params }) {
  try {
    const supabase = createSupabaseAdmin();
    const id = Number(params.id);
    if (!Number.isFinite(id) || id <= 0)
      return NextResponse.json({ error: "Invalid id" }, { status: 400 });

    const order = await supabase
      .from("shop_order")
      .select(
        "id, status, total_cents, currency, placed_at, created_at, user_id, stripe_payment_intent_id, customer_email"
      )
      .eq("id", id)
      .single();
    if (order.error) throw order.error;

    const items = await supabase
      .from("shop_order_item")
      .select(
        "id, product_id, title_snapshot, unit_price_cents, currency, quantity"
      )
      .eq("order_id", id)
      .order("id", { ascending: true });
    if (items.error) throw items.error;

    const payments = await supabase
      .from("payment")
      .select(
        "id, provider, amount_cents, currency, status, created_at, external_id"
      )
      .eq("order_id", id)
      .order("created_at", { ascending: false });
    // payments table is optional; if missing, ignore error
    const paymentsData = payments.error ? [] : payments.data || [];

    return NextResponse.json({
      order: order.data,
      items: items.data || [],
      payments: paymentsData,
    });
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Failed to load order" },
      { status: 500 }
    );
  }
}
