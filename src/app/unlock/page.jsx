import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const PASSWORD = process.env.SITE_PASSWORD || "";
const TOKEN = process.env.SITE_LOCK_TOKEN || "";

async function doUnlock(formData) {
  "use server";

  const pw = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/");
  if (pw !== PASSWORD) {
    redirect(`/unlock?e=1&next=${encodeURIComponent(next)}`);
  }

  const cookieStore = await cookies(); // ⬅️ async in Next 16

  // HttpOnly cookie (server/API guard)
  cookieStore.set("site_lock", TOKEN, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });

  // Non-HttpOnly flag (for the client layout guard)
  cookieStore.set("site_lock_front", "1", {
    httpOnly: false,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
  });

  redirect(next || "/");
}

export default async function UnlockPage({ searchParams }) {
  const sp = await searchParams; // ⬅️ await the Promise
  const error = (sp?.get?.("e") || sp?.e) === "1";
  const next = sp?.get?.("next") || sp?.next || "/";

  return (
    <main className="min-h-screen grid place-items-center p-6">
      <form
        action={doUnlock}
        className="w-full max-w-sm rounded-2xl border p-6 shadow-sm bg-white space-y-4"
      >
        <h1 className="text-xl font-semibold">Enter site password</h1>
        <input type="hidden" name="next" value={next} />
        <div className="space-y-2">
          <label className="text-sm text-neutral-600">Password</label>
          <input
            name="password"
            type="password"
            autoComplete="current-password"
            className="w-full rounded-lg border px-3 py-2"
            required
          />
          {error && (
            <p className="text-sm text-red-600">Wrong password. Try again.</p>
          )}
        </div>
        <button
          type="submit"
          className="w-full rounded-xl border px-4 py-2 font-medium hover:bg-neutral-50"
        >
          Unlock
        </button>
      </form>
    </main>
  );
}
