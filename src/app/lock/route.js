import { NextResponse } from "next/server";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set("site_lock", "", { path: "/", maxAge: 0 });
  res.cookies.set("site_lock_front", "", { path: "/", maxAge: 0 });
  return res;
}
