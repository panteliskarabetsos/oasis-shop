"use client";
import { useState } from "react";

export default function ProductCard({ product }) {
  const [adding, setAdding] = useState(false);

  const addToCart = () => {
    setAdding(true);
    const cart = JSON.parse(localStorage.getItem("cart") || "[]");
    const found = cart.find((i) => i.id === product.id);
    if (found) found.qty += 1;
    else cart.push({ id: product.id, qty: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    setAdding(false);
  };

  return (
    <a
      href={`/products/${product.slug}`}
      className="block border rounded-2xl overflow-hidden bg-white shadow-sm"
    >
      {product.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          alt={product.title}
          src={product.image}
          className="w-full aspect-square object-cover"
        />
      ) : (
        <div className="w-full aspect-square bg-neutral-100" />
      )}
      <div className="p-4 flex items-center justify-between">
        <div>
          <div className="font-medium">{product.title}</div>
          <div className="text-sm text-neutral-600">
            {(product.price_cents / 100).toFixed(2)} €
          </div>
        </div>
        <button
          onClick={addToCart}
          disabled={adding}
          className="text-sm underline"
        >
          {adding ? "Adding..." : "Add"}
        </button>
      </div>
    </a>
  );
}
