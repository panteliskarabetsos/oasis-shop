function readCookieFromHeader(cookieHeader, name) {
  if (!cookieHeader) return undefined;
  for (const part of cookieHeader.split(";")) {
    const [k, ...rest] = part.trim().split("=");
    if (k === name) return decodeURIComponent(rest.join("="));
  }
  return undefined;
}

export function isUnlockedFromRequest(req) {
  const cookieHeader = req.headers.get("cookie") || "";
  const token = readCookieFromHeader(cookieHeader, "site_lock");
  return token && token === (process.env.SITE_LOCK_TOKEN || "");
}
