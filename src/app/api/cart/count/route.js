import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getCookie(cookieHeader, name) {
  if (!cookieHeader) return null;

  const prefix = `${name}=`;
  const parts = cookieHeader.split(";").map((p) => p.trim());
  const hit = parts.find((p) => p.startsWith(prefix));
  if (!hit) return null;

  const raw = hit.slice(prefix.length);
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function parseCartCookie(raw) {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    const items = Array.isArray(parsed) ? parsed : parsed?.items ?? [];
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
}

export async function GET(req) {
  const cookieHeader = req.headers.get("cookie");
  const rawCart = getCookie(cookieHeader, "cart");

  const items = parseCartCookie(rawCart);
  const count = items.reduce((sum, it) => sum + Number(it?.qty ?? 1), 0);

  return NextResponse.json({ count });
}
