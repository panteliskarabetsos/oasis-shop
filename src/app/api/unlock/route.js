// app/api/unlock/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  const { password, next = "/" } = await req.json();
  if (password !== process.env.SITE_PASSWORD) {
    return NextResponse.json({ error: "Wrong password" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true, next });
  res.cookies.set("site_lock", process.env.SITE_LOCK_TOKEN || "", {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}
