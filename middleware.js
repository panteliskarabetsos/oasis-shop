// middleware.js (root)
import { NextResponse } from "next/server";

const EXEMPT = [
  /^\/unlock(\/.*)?$/,
  /^\/api\/unlock(\/.*)?$/,
  /^\/_next\//,
  /^\/favicon\.ico$/,
  /^\/robots\.txt$/,
  /^\/sitemap\.xml$/,
  /^\/assets\//,
  /^\/images\//,
];

export async function middleware(req) {
  const enabled = process.env.SHOP_PROTECT_ENABLED === "true";
  if (!enabled) return NextResponse.next();

  // Normalize host (strip port, lowercase)
  const hostHeader = req.headers.get("host") || "";
  const host = hostHeader.split(":")[0].toLowerCase();
  const onlyHost = (process.env.SHOP_HOSTNAME || "").toLowerCase().trim();

  // If a hostname is set, only protect that host
  if (onlyHost && host !== onlyHost) return NextResponse.next();

  const { pathname } = req.nextUrl;
  if (EXEMPT.some((re) => re.test(pathname))) return NextResponse.next();

  const cookie = req.cookies.get("shop_auth")?.value;
  if (cookie && (await verifyCookie(cookie, req))) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/unlock";
  url.search = `returnTo=${encodeURIComponent(
    req.nextUrl.pathname + req.nextUrl.search
  )}`;
  return NextResponse.redirect(url);
}

async function verifyCookie(cookie, req) {
  try {
    const secret = process.env.SHOP_PROTECT_SECRET || "";
    if (!secret) return false;

    const [payload, sig] = String(cookie).split(".");
    if (!payload || !sig) return false;

    const ua = req.headers.get("user-agent") || "";
    const data = `${payload}|${ua}`;
    const expected = await hmac(data, secret);
    if (!timingSafeEqual(sig, expected)) return false;

    const ts = Number(payload.split(":")[0]);
    if (!Number.isFinite(ts)) return false;

    const ageMs = Date.now() - ts;
    const maxAgeMs =
      Number(process.env.SHOP_PROTECT_MAXAGE_DAYS || 30) * 24 * 60 * 60 * 1000;
    return ageMs >= 0 && ageMs <= maxAgeMs;
  } catch {
    return false;
  }
}

async function hmac(data, secret) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a, b) {
  if (a.length !== b.length) return false;
  let res = 0;
  for (let i = 0; i < a.length; i++) res |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return res === 0;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
