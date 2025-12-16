"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";



export default function LockedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const hasFlag = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("site_lock_front=1"));

    if (!hasFlag) {
      const search =
        typeof window !== "undefined" ? window.location.search : "";
      const next = pathname + (search || "");
      router.replace(`/unlock?next=${encodeURIComponent(next)}`);
      return;
    }
    setOk(true);
  }, [pathname, router]);

  if (!ok) return null;
  return children;
}
