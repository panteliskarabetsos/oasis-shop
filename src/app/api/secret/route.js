// app/api/secret/route.js
import { NextResponse } from "next/server";
import { requireUnlock } from "@/lib/requireUnlock";

export async function GET() {
  if (!requireUnlock()) {
    return NextResponse.json({ error: "Locked" }, { status: 401 });
  }
  return NextResponse.json({ ok: true });
}
