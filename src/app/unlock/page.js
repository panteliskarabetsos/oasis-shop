"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";

export default function UnlockPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const returnTo = sp.get("returnTo") || "/";

  const [pw, setPw] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [err, setErr] = React.useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw, returnTo }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Invalid password");
      router.push(data?.redirectTo || returnTo || "/");
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#f6f3ee] grid place-items-center px-6">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-[#e8e2d8] bg-white p-6 shadow-sm"
      >
        <h1 className="mb-4 text-xl font-serif text-[#4a3f35]">
          Enter shop password
        </h1>
        <div className="space-y-2">
          <label className="text-sm text-[#4a3f35]">Password</label>
          <Input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        {err ? (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {err}
          </div>
        ) : null}
        <Button
          type="submit"
          className="mt-4 w-full bg-[#8b6f47] text-white hover:bg-[#a78b62]"
          disabled={loading}
        >
          {loading ? "Checking…" : "Unlock"}
        </Button>
      </form>
    </div>
  );
}
