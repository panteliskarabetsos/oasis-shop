// src/components/ClientShell.jsx
"use client";

import Header from "@/app/components/header";
import { usePathname } from "next/navigation";

export default function ClientShell({ children }) {
  const pathname = usePathname();
  const hideHeader = pathname === "/unlock"; // optional

  return (
    <>
      {!hideHeader && <Header />}
      {children}
    </>
  );
}
