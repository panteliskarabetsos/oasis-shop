// ==========================
// 3) src/app/api/unlock/route.js  (server)
// Verifies password and issues a signed cookie recognizable by middleware.
// ==========================
import { NextResponse } from "next/server";
import { createHmac } from "crypto";

export async function POST(req) {
  const { password, returnTo } = await req.json();
  const expected = process.env.SHOP_PASSWORD || "";
  if (!expected) {
    return NextResponse.json(
      { error: "Server not configured (SHOP_PASSWORD missing)" },
      { status: 500 }
    );
  }
  if (String(password || "") !== expected) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const secret = process.env.SHOP_PROTECT_SECRET || "";
  if (!secret) {
    return NextResponse.json(
      { error: "Server not configured (SHOP_PROTECT_SECRET missing)" },
      { status: 500 }
    );
  }

  const ua = req.headers.get("user-agent") || "";
  const ts = Date.now();
  const payload = `${ts}`; // keep simple; could also add a random nonce
  const data = `${payload}|${ua}`;
  const sig = createHmac("sha256", secret).update(data).digest("hex");
  const cookieVal = `${payload}.${sig}`;

  const maxAgeDays = Number(process.env.SHOP_PROTECT_MAXAGE_DAYS || 30);
  const res = NextResponse.json({ ok: true, redirectTo: returnTo || "/" });
  res.headers.set("Cache-Control", "no-store");
  res.cookies.set("shop_auth", cookieVal, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: maxAgeDays * 24 * 60 * 60,
  });
  return res;
}
