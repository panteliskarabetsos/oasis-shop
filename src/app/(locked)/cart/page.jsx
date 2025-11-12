"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, ArrowLeft, Tag } from "lucide-react";

const CURRENCY = "EUR";
const FREE_SHIPPING_AT = 49;
const SHIPPING_FEE = 4.9; // flat (dev)

const ui = {
  text: "text-[#5a4a3f]",
  textSoft: "text-[#7a6a5f]",
  border: "border-[#eae6e0]",
  bg: "bg-[#fdfaf5]",
  card: "bg-white",
  cta: "bg-[#8b6f47] text-white hover:bg-[#7a5f3a]",
};

const fmt = new Intl.NumberFormat("el-GR", {
  style: "currency",
  currency: CURRENCY,
});

function readCart() {
  try {
    const raw =
      localStorage.getItem("oasis-cart") ||
      localStorage.getItem("cart") ||
      "[]";
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
}
function writeCart(items) {
  localStorage.setItem("oasis-cart", JSON.stringify(items));
  // wake up any listeners
  window.dispatchEvent(new Event("cart:change"));
}

export default function CartPage() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState(null);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => setItems(readCart()), []);

  const totals = useMemo(() => {
    const subtotal = items.reduce(
      (s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 1),
      0
    );
    const discount =
      applied?.type === "percent"
        ? subtotal * (applied.value / 100)
        : applied?.type === "amount"
        ? applied.value
        : 0;
    const afterDiscount = Math.max(0, subtotal - discount);
    const shipping =
      afterDiscount >= FREE_SHIPPING_AT || items.length === 0
        ? 0
        : SHIPPING_FEE;
    const total = afterDiscount + shipping;
    const toFree = Math.max(0, FREE_SHIPPING_AT - afterDiscount);
    return { subtotal, discount, shipping, total, toFree, afterDiscount };
  }, [items, applied]);

  function updateQty(id, delta) {
    setItems((prev) => {
      const next = prev.map((it) =>
        it.id === id ? { ...it, qty: Math.max(1, (it.qty || 1) + delta) } : it
      );
      writeCart(next);
      return next;
    });
  }
  function setQty(id, val) {
    const n = Math.max(1, Number(val) || 1);
    setItems((prev) => {
      const next = prev.map((it) => (it.id === id ? { ...it, qty: n } : it));
      writeCart(next);
      return next;
    });
  }
  function removeItem(id) {
    setItems((prev) => {
      const next = prev.filter((it) => it.id !== id);
      writeCart(next);
      return next;
    });
  }
  function clearCart() {
    writeCart([]);
    setItems([]);
  }

  // simple dev promo logic — swap with backend later
  function applyCode(e) {
    e.preventDefault();
    const c = code.trim().toUpperCase();
    if (!c) return;
    if (c === "WELCOME10")
      setApplied({ code: c, type: "percent", value: 10, label: "-10%" });
    else if (c === "FREESHIP")
      setApplied({
        code: c,
        type: "amount",
        value: SHIPPING_FEE,
        label: "Free shipping",
      });
    else setApplied({ code: c, invalid: true });
  }
  function removeCode() {
    setApplied(null);
    setCode("");
  }

  async function checkout() {
    if (!items.length) return;
    setCheckingOut(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, promo: applied?.code || null }),
      });
      if (res.ok) {
        const { url } = await res.json();
        if (url) {
          window.location.href = url;
          return;
        }
      }
      // fallback: go to a local /checkout page if you have one
      router.push("/checkout");
    } catch {
      router.push("/checkout");
    } finally {
      setCheckingOut(false);
    }
  }

  return (
    <main id="main" className="mx-auto max-w-6xl px-4 sm:px-6 py-6 sm:py-10">
      <button
        onClick={() => router.push("/products")}
        className="inline-flex items-center gap-2 text-sm text-[#8b6f47] hover:underline"
      >
        <ArrowLeft size={16} /> Continue shopping
      </button>

      <h1 className={`mt-3 text-2xl sm:text-3xl font-serif ${ui.text}`}>
        Your Cart
      </h1>

      {!items.length ? (
        <div
          className={`mt-8 rounded-2xl border ${ui.border} ${ui.bg} p-8 text-center`}
        >
          <p className={`${ui.textSoft}`}>Your cart is empty.</p>
          <button
            onClick={() => router.push("/products")}
            className={`mt-4 rounded-full px-5 py-2 ${ui.cta}`}
          >
            Browse products
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <section className="lg:col-span-2 space-y-3">
            {items.map((it) => (
              <article
                key={`${it.id}-${it.variant || ""}`}
                className={`rounded-2xl border ${ui.border} ${ui.card} p-3 sm:p-4 flex gap-3 sm:gap-4`}
              >
                <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden bg-[#f3eee6] shrink-0">
                  {it.image ? (
                    <Image
                      src={it.image}
                      alt={it.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-xs text-[#9b8d7f]">
                      No image
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className={`truncate font-medium ${ui.text}`}>
                        {it.name}
                      </h3>
                      {it.variant && (
                        <p className={`text-xs ${ui.textSoft}`}>{it.variant}</p>
                      )}
                      <p className={`mt-1 text-sm ${ui.textSoft}`}>
                        {fmt.format(it.price || 0)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(it.id)}
                      className="rounded-lg p-2 text-[#b44d4d] hover:bg-[#faecea]"
                      aria-label={`Remove ${it.name}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    {/* Qty control */}
                    <div className="inline-flex items-center rounded-full border border-[#e8e2d9] bg-white">
                      <button
                        onClick={() => updateQty(it.id, -1)}
                        className="p-2 hover:bg-[#f6f1ea] rounded-l-full"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={16} />
                      </button>
                      <input
                        value={it.qty || 1}
                        onChange={(e) => setQty(it.id, e.target.value)}
                        inputMode="numeric"
                        className="w-10 text-center outline-none text-sm bg-transparent"
                      />
                      <button
                        onClick={() => updateQty(it.id, +1)}
                        className="p-2 hover:bg-[#f6f1ea] rounded-r-full"
                        aria-label="Increase quantity"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    {/* Line total */}
                    <p
                      className={`text-sm sm:text-base font-medium ${ui.text}`}
                    >
                      {fmt.format((it.price || 0) * (it.qty || 1))}
                    </p>
                  </div>
                </div>
              </article>
            ))}

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={clearCart}
                className="text-sm text-[#b44d4d] hover:underline"
              >
                Clear cart
              </button>
              <button
                onClick={() => router.push("/products")}
                className="text-sm text-[#8b6f47] hover:underline"
              >
                Continue shopping
              </button>
            </div>
          </section>

          {/* Summary */}
          <aside
            className={`lg:sticky lg:top-4 h-max rounded-2xl border ${ui.border} ${ui.card} p-4 sm:p-5`}
          >
            {/* Free shipping progress */}
            <div className="mb-4">
              {totals.toFree > 0 ? (
                <>
                  <p className={`text-sm ${ui.textSoft}`}>
                    Spend{" "}
                    <span className="font-medium text-[#8b6f47]">
                      {fmt.format(totals.toFree)}
                    </span>{" "}
                    more for free shipping.
                  </p>
                  <div className="mt-2 h-2 rounded-full bg-[#efe7d9] overflow-hidden">
                    <div
                      className="h-full bg-[#8b6f47]"
                      style={{
                        width: `${Math.min(
                          100,
                          (totals.afterDiscount / FREE_SHIPPING_AT) * 100
                        )}%`,
                      }}
                    />
                  </div>
                </>
              ) : (
                <p className={`text-sm ${ui.textSoft}`}>
                  🎉 You’ve unlocked free shipping.
                </p>
              )}
            </div>

            {/* Promo code */}
            <form onSubmit={applyCode} className="flex gap-2">
              <div className="relative flex-1">
                <Tag
                  size={16}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-[#9b8d7f]"
                />
                <input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Promo code"
                  className="w-full rounded-xl border border-[#e8e2d9] bg-white pl-8 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#d7cbb6]"
                />
              </div>
              <button
                type="submit"
                className={`rounded-xl px-4 py-2 text-sm ${ui.cta}`}
              >
                Apply
              </button>
            </form>
            {applied && (
              <p
                className={`mt-2 text-xs ${
                  applied.invalid ? "text-[#b44d4d]" : ui.textSoft
                }`}
              >
                {applied.invalid
                  ? `Code "${applied.code}" is not valid.`
                  : `Applied: ${applied.code}${
                      applied.label ? ` (${applied.label})` : ""
                    }`}
                {!applied.invalid && (
                  <button onClick={removeCode} className="ml-2 underline">
                    Remove
                  </button>
                )}
              </p>
            )}

            <div className="my-4 h-px bg-[#eee6dd]" />

            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className={ui.textSoft}>Subtotal</dt>
                <dd className={ui.text}>{fmt.format(totals.subtotal)}</dd>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between">
                  <dt className={ui.textSoft}>Discount</dt>
                  <dd className="text-[#8b6f47]">
                    −{fmt.format(totals.discount)}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className={ui.textSoft}>Shipping</dt>
                <dd className={ui.text}>
                  {totals.shipping === 0 ? "Free" : fmt.format(totals.shipping)}
                </dd>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#eee6dd]">
                <dt className="font-medium">Total</dt>
                <dd className="font-semibold">{fmt.format(totals.total)}</dd>
              </div>
            </dl>

            <button
              onClick={checkout}
              disabled={!items.length || checkingOut}
              className={`mt-4 w-full rounded-2xl px-4 py-3 text-sm font-medium ${ui.cta} disabled:opacity-50`}
            >
              {checkingOut ? "Processing…" : "Checkout"}
            </button>
            <p className={`mt-2 text-xs ${ui.textSoft}`}>
              Taxes calculated at checkout.
            </p>
          </aside>
        </div>
      )}
    </main>
  );
}
