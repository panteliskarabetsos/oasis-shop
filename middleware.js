// middleware.js (TEMP test)
export function middleware() {
  return new Response("MW is running", { status: 401 });
}
export const config = { matcher: ["/:path*"] };
