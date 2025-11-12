export const runtime = "nodejs";
export const dynamic = "force-dynamic";
import "server-only";
import { NextResponse } from "next/server";
import { createSupabaseAdmin } from "@/lib/supabase/admin";

export async function GET(req) {
  try {
    const supabase = createSupabaseAdmin();
    const { searchParams } = new URL(req.url);
    const productId = Number(searchParams.get("product_id") || 0);
    if (!Number.isFinite(productId) || productId <= 0)
      return NextResponse.json(
        { error: "product_id required" },
        { status: 400 }
      );

    const { data, error } = await supabase
      .from("shop_product_image")
      .select("id, product_id, url, alt, sort, is_primary")
      .eq("product_id", productId)
      .order("is_primary", { ascending: false })
      .order("sort", { ascending: true });

    if (error) throw error;
    return NextResponse.json(data || []);
  } catch (e) {
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const supabase = createSupabaseAdmin();
    const { product_id, url, alt, sort, is_primary } = await req.json();

    const pid = Number(product_id);
    if (!Number.isFinite(pid) || pid <= 0)
      return NextResponse.json(
        { error: "Invalid product_id" },
        { status: 400 }
      );
    if (!url || typeof url !== "string")
      return NextResponse.json({ error: "url required" }, { status: 400 });

    // if making primary, unset others for that product
    if (is_primary) {
      await supabase
        .from("shop_product_image")
        .update({ is_primary: false })
        .eq("product_id", pid);
    }

    const ins = await supabase
      .from("shop_product_image")
      .insert([
        {
          product_id: pid,
          url,
          alt: alt || null,
          sort: Number(sort || 0),
          is_primary: !!is_primary,
        },
      ])
      .select("id, product_id, url, alt, sort, is_primary")
      .single();

    if (ins.error) throw ins.error;
    return NextResponse.json(ins.data, { status: 201 });
  } catch (e) {
    return NextResponse.json(
      { error: e.message || "Failed to add image" },
      { status: 500 }
    );
  }
}
