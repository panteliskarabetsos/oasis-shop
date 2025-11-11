// src/app/unlock/page.js  (SERVER component – no "use client")
import UnlockClient from "./unlock-client";

// optional: prevents static prerendering
export const dynamic = "force-dynamic";

export default function Page({ searchParams }) {
  const returnTo =
    typeof searchParams?.returnTo === "string" && searchParams.returnTo
      ? searchParams.returnTo
      : "/";
  return <UnlockClient returnTo={returnTo} />;
}
