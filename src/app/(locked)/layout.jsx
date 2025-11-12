"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function LockedLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const search = searchParams?.toString();
    const hasFlag = document.cookie
      .split(";")
      .some((c) => c.trim().startsWith("site_lock_front=1"));

    if (!hasFlag) {
      const next = pathname + (search ? `?${search}` : "");
      router.replace(`/unlock?next=${encodeURIComponent(next)}`);
      return;
    }
    setOk(true);
  }, [pathname, searchParams, router]);

  if (!ok) return null; // optional: return a skeleton/spinner
  return children;
}
