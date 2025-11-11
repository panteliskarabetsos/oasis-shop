"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Leaf,
  Heart,
  Sparkles,
  Recycle,
  Package,
  Truck,
  ShieldCheck,
  Star,
  Droplets,
  CupSoda,
  Flower2,
  ArrowRight,
  Search,
} from "lucide-react";

// shadcn/ui
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";

// --- Cretan foods only ---
const categories = [
  {
    slug: "olive-oil",
    title: "Olive Oil",
    blurb: "Cold‑pressed, small‑batch, PDO/PGI.",
    icon: Droplets,
    image: "/oil.jpg",
  },
  {
    slug: "honey",
    title: "Thyme Honey",
    blurb: "Raw Cretan honey from hillside apiaries.",
    icon: Flower2,
    image: "/honey2.jpg",
  },
  {
    slug: "herbal-teas",
    title: "Herbal Teas",
    blurb: "Sideritis, dittany, chamomile & mixes.",
    icon: CupSoda,
    image: "/herbal-tea.jpeg",
  },
  {
    slug: "wine",
    title: "Cretan Wines",
    blurb: "Vidiano, Liatiko & native varieties.",
    icon: Heart,
    image: "/wines.jpg",
  },
  {
    slug: "sweets",
    title: "Sweets & Rusks",
    blurb: "Pasteli, loukoumi, paximadi & marmalades.",
    icon: Star,
    image: "/sweet.png",
  },
  {
    slug: "olives",
    title: "Olives",
    blurb: "Sun‑cured olives, capers & more.",
    icon: Leaf,
    image: "/olives.jpg",
  },
];

const products = [
  {
    id: "evoo-estate-pdo",
    name: "Estate Extra Virgin Olive Oil (PDO)",
    desc: "Koroneiki, first cold press, <0.3% acidity.",
    price: 18.9,
    image:
      "https://images.unsplash.com/photo-1546549039-49a1d8532b0c?q=80&w=1600&auto=format&fit=crop",
    badge: "Bestseller",
    rating: 5,
  },
  {
    id: "honey-thyme-raw",
    name: "Raw Thyme Honey 450g",
    desc: "Unfiltered, naturally crystallizing sweetness.",
    price: 11.5,
    image:
      "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop",
    badge: "New Harvest",
    rating: 5,
  },
  {
    id: "tea-mountain-sideritis",
    name: "Cretan Mountain Tea",
    desc: "Organic sideritis from Psiloritis slopes.",
    price: 7.9,
    image:
      "https://images.unsplash.com/photo-1485550409059-9afb054cada4?q=80&w=1600&auto=format&fit=crop",
    badge: "Organic",
    rating: 5,
  },
  {
    id: "olives-sundried",
    name: "Sun‑Dried Olives 300g",
    desc: "Bold, salty‑sweet, naturally cured.",
    price: 6.5,
    image:
      "https://images.unsplash.com/photo-1604908554007-860d7ea2b63a?q=80&w=1600&auto=format&fit=crop",
    badge: "Small‑batch",
    rating: 4,
  },
  {
    id: "wine-vidiano",
    name: "Vidiano White 750ml",
    desc: "Elegant native variety with stone‑fruit notes.",
    price: 14.9,
    image:
      "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=1600&auto=format&fit=crop",
    badge: "Estate",
    rating: 5,
  },
  {
    id: "paximadi-barley",
    name: "Barley Paximadi Rusks 500g",
    desc: "Traditional twice‑baked Cretan rusks.",
    price: 4.9,
    image:
      "https://images.unsplash.com/photo-1604908554262-398a422f77ab?q=80&w=1600&auto=format&fit=crop",
    badge: "Traditional",
    rating: 5,
  },
  {
    id: "marmalade-orange",
    name: "Bitter Orange Marmalade",
    desc: "Copper‑pot cooked, low sugar, high fruit.",
    price: 6.9,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=1600&auto=format&fit=crop",
    badge: "Handmade",
    rating: 5,
  },
  {
    id: "carob-syrup",
    name: "Carob Syrup 250ml",
    desc: "Rich, malty Crete classic for desserts.",
    price: 8.5,
    image:
      "https://images.unsplash.com/photo-1566843972141-8fbf25b3f407?q=80&w=1600&auto=format&fit=crop",
    badge: "Artisan",
    rating: 4,
  },
];

export default function OasisShopHome() {
  const router = useRouter();

  const addToCart = (p) => {
    console.log("Add to cart:", p.id);
  };

  const onSearch = (e) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q");
    if (q) router.push(`/shop?q=${encodeURIComponent(q)}`);
  };

  const onQuickFilter = (tag) =>
    router.push(`/shop?tag=${encodeURIComponent(tag)}`);

  return (
    <div className="min-h-screen bg-[#f4f1ec] text-[#4a4a4a]">
      {/* Ambient backdrop */}
      <AmbientBackground />

      {/* Announcement bar */}
      <AnnouncementBar />

      {/* HERO */}
      <section className="relative" aria-labelledby="hero-heading">
        <div className="mx-auto max-w-7xl px-6 pt-10 sm:pt-14 lg:pt-20">
          <div className="overflow-hidden rounded-4xl border border-[#e8e2d8] bg-white shadow-[0_6px_24px_rgba(60,50,39,0.06)]">
            <div className="relative grid items-center gap-10 p-8 sm:p-10 lg:grid-cols-2 lg:p-12">
              {/* Visual */}
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative order-2 lg:order-1"
              >
                <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
                  <Image
                    src="/pure-cosmetic.jpg"
                    alt="Olive oil, honey and bread on a rustic Cretan table"
                    fill
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                    priority
                  />
                  <div
                    className="absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent"
                    aria-hidden
                  />
                </div>
                {/* Floating card */}
                <div className="absolute -bottom-6 -left-6 hidden w-44 rotate-2 rounded-2xl border border-[#e8e2d8] bg-white/90 p-4 shadow-sm backdrop-blur sm:block">
                  <div className="flex items-center gap-2 text-sm text-[#5a4a3f]">
                    <Package className="h-4 w-4" aria-hidden /> Ships from Crete
                  </div>
                  <div
                    className="mt-2 flex items-center gap-1 text-[#b45309]"
                    aria-hidden
                  >
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                    <Star className="h-4 w-4 fill-current" />
                  </div>
                  <p className="mt-1 text-xs text-[#6b625a]">
                    “A true taste of the island”
                  </p>
                </div>
              </motion.div>

              {/* Copy */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="order-1 lg:order-2"
              >
                <Badge className="mb-4 bg-[#8b6f47] text-white hover:bg-[#8b6f47]">
                  Oasis Cretan Goods
                </Badge>
                <h1
                  id="hero-heading"
                  className="text-4xl font-serif font-medium tracking-tight text-[#5a4a3f] sm:text-5xl lg:text-[56px] lg:leading-[1.1]"
                >
                  Crete’s pantry.{" "}
                  <span className="text-[#8b6f47]">Delivered</span> to your
                  home.
                </h1>
                <p className="mt-5 max-w-xl text-base text-[#6b625a] sm:text-lg">
                  Local, handmade products from our island: extra virgin olive
                  oil, thyme honey, herbal teas, wines, olives, rusks and
                  sweets—sourced from small producers we know.
                </p>

                <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button
                    asChild
                    size="lg"
                    className="rounded-2xl bg-[#8b6f47] px-6 py-6 text-base text-white transition-colors hover:bg-[#a78b62] focus-visible:ring-2 focus-visible:ring-[#8b6f47]/30"
                  >
                    <Link href="#products">Shop Cretan Foods</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="rounded-2xl border-[#e0dcd4] bg-white px-6 py-6 text-base text-[#5a4a3f] backdrop-blur transition-colors hover:bg-[#faf7f1] focus-visible:ring-2 focus-visible:ring-[#8b6f47]/30"
                  >
                    <Link
                      href="/experiences"
                      className="flex items-center gap-2"
                    >
                      Visit Our Farm{" "}
                      <ArrowRight className="h-4 w-4" aria-hidden />
                    </Link>
                  </Button>
                </div>

                {/* Search */}
                <form
                  onSubmit={onSearch}
                  className="mt-6 flex w-full max-w-xl items-center gap-3 rounded-2xl border border-[#e0dcd4] bg-white/80 p-2 backdrop-blur"
                  aria-label="Search products"
                >
                  <div className="flex flex-1 items-center gap-2 rounded-xl bg-white px-3">
                    <Search className="h-4 w-4 text-neutral-500" aria-hidden />
                    <Input
                      name="q"
                      placeholder="Search olive oil, honey, teas…"
                      className="h-11 flex-1 border-0 bg-transparent text-[#5a4a3f] placeholder:text-[#8b6f47]/60 focus-visible:ring-0"
                      aria-label="Search query"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="h-11 rounded-xl bg-[#8b6f47] px-5 text-white transition-colors hover:bg-[#a78b62]"
                  >
                    Search
                  </Button>
                </form>

                {/* Quick filters */}
                <div className="mt-4 no-scrollbar relative -mx-1 flex gap-2 overflow-x-auto py-1 px-1">
                  <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-linear-to-r from-[#f4f1ec] to-transparent" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-linear-to-l from-[#f4f1ec] to-transparent" />
                  {[
                    "Olive Oil",
                    "Honey",
                    "Wine",
                    "Herbal Teas",
                    "Olives",
                    "Sweets",
                  ].map((n) => (
                    <Button
                      key={n}
                      variant="outline"
                      className="rounded-full border-[#e0dcd4] bg-white/70 text-[#5a4a3f] hover:bg-[#faf7f1]"
                      onClick={() => onQuickFilter(n.toLowerCase())}
                    >
                      {n}
                    </Button>
                  ))}
                </div>

                {/* Trust */}
                <div className="mt-8 grid grid-cols-2 gap-3 text-sm text-neutral-700 sm:grid-cols-4">
                  <TrustPill icon={ShieldCheck} label="PDO/PGI Quality" />
                  <TrustPill icon={Leaf} label="Small‑batch producers" />
                  <TrustPill icon={Recycle} label="Plastic‑free ship" />
                  <TrustPill icon={Truck} label="Fast EU delivery" />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CONNECT TO AGROTOURISM */}
      <section
        className="mx-auto max-w-7xl px-6 py-12 sm:py-16"
        aria-labelledby="connect-heading"
      >
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl border border-[#e8e2d8] bg-white p-8 shadow-[0_6px_24px_rgba(60,50,39,0.06)] lg:grid-cols-2 lg:gap-16 lg:p-12">
          <div className="relative aspect-4/3 overflow-hidden rounded-2xl">
            <Image
              src="/honey.png"
              alt="Sunlit Cretan vineyard and olive groves"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <Badge className="mb-4 bg-[#efeae2] text-[#5a4a3f] hover:bg-[#efeae2]">
              Our Home
            </Badge>
            <h2
              id="connect-heading"
              className="text-3xl font-serif font-medium tracking-tight text-[#5a4a3f] sm:text-4xl"
            >
              From our orchards & beehives
            </h2>
            <p className="mt-4 text-[#6b625a]">
              Our e‑shop is an extension of our{" "}
              <strong>agrotourism and farm life</strong> in Crete. The foods
              here are the same we grow, harvest and share with our guests.
            </p>
            <p className="mt-2 text-[#6b625a]">
              Can’t visit us? Bring the essence of the island home.
            </p>
            <Button
              asChild
              size="lg"
              className="mt-6 rounded-xl bg-[#8b6f47] text-white transition-colors hover:bg-[#a78b62]"
            >
              <Link href="/experiences">Explore retreats & stays</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section
        className="mx-auto max-w-7xl px-6 pb-12 pt-4 sm:pb-16"
        aria-labelledby="categories-heading"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2
            id="categories-heading"
            className="text-2xl font-serif font-medium tracking-tight text-[#5a4a3f]"
          >
            Shop by category
          </h2>
          <Link
            href="/shop"
            className="text-sm text-[#8b6f47] hover:text-[#a78b62]"
          >
            View all
          </Link>
        </div>
        <div className="no-scrollbar -mx-3 flex snap-x snap-mandatory gap-4 overflow-x-auto px-3 pb-1">
          {categories.map((c) => (
            <CategoryCard key={c.slug} {...c} />
          ))}
        </div>
      </section>

      {/* FEATURED BENTO */}
      {/* <section
        className="mx-auto max-w-7xl px-6"
        aria-labelledby="featured-heading"
      >
        <h2 id="featured-heading" className="sr-only">
          Featured picks
        </h2>
        <div className="grid gap-4 sm:grid-cols-5">
          <BentoTile
            className="sm:col-span-3"
            title="Cretan Pantry Box"
            blurb="EVOO + thyme honey + olives + rusks."
            image="/cretan-goods.jpeg"
            badge="Bundle"
            href="/product/box-pantry"
          />
          <BentoTile
            title="Estate EVOO (PDO)"
            blurb="Koroneiki single‑estate, first cold press."
            image="https://images.unsplash.com/photo-1510627498534-cf7e9002facc?q=80&w=1600&auto=format&fit=crop"
            href="/product/evoo-estate-pdo"
          />
          <BentoTile
            title="Raw Thyme Honey"
            blurb="Unfiltered, aromatic and golden."
            image="https://images.unsplash.com/photo-1499195333224-3ce974eecb47?q=80&w=1600&auto=format&fit=crop"
            href="/product/honey-thyme-raw"
          />
        </div>
      </section> */}

      {/* PRODUCTS */}
      <section
        id="products"
        className="mx-auto max-w-7xl px-6 py-16"
        aria-labelledby="products-heading"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2
            id="products-heading"
            className="text-2xl font-serif font-medium tracking-tight text-[#5a4a3f]"
          >
            Featured products
          </h2>
          <Link
            href="/shop"
            className="text-sm text-[#8b6f47] hover:text-[#a78b62]"
          >
            Browse catalog
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((p) => (
            <ProductCard key={p.id} p={p} onAdd={() => addToCart(p)} />
          ))}
        </div>
      </section>

      {/* ETHOS */}
      <section
        id="ethos"
        className="mx-auto max-w-7xl px-6 pb-16"
        aria-labelledby="ethos-heading"
      >
        <div className="mb-8 text-center">
          <Badge className="bg-[#efeae2] text-[#5a4a3f] hover:bg-[#efeae2]">
            Our ethos
          </Badge>
          <h2
            id="ethos-heading"
            className="mt-3 text-3xl font-serif font-medium tracking-tight text-[#5a4a3f] sm:text-4xl"
          >
            Rooted in Crete
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-[#6b625a]">
            We aren’t just a shop; we’re a family‑run project. We source
            directly from our own land and from neighboring small‑batch
            producers who share our values.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <EthosCard
            icon={ShieldCheck}
            title="PDO / PGI"
            text="Protected origin & traceability."
          />
          <EthosCard
            icon={Sparkles}
            title="Traditional Methods"
            text="Generational know‑how, low intervention."
          />
          <EthosCard
            icon={Heart}
            title="Community First"
            text="Fair prices that support families."
          />
          <EthosCard
            icon={Recycle}
            title="Low‑Impact"
            text="Plastic‑free, recyclable packaging."
          />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section
        className="mx-auto max-w-7xl px-6 pb-20"
        aria-labelledby="testimonials-heading"
      >
        <div className="mb-6 flex items-center justify-between">
          <h2
            id="testimonials-heading"
            className="text-2xl font-serif font-medium tracking-tight text-[#5a4a3f]"
          >
            Loved by our community
          </h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <TestimonialCard
            text="The olive oil is phenomenal—peppery and fresh. You can taste the difference."
            author="Elena K."
          />
          <TestimonialCard
            text="Thyme honey took me straight back to Crete. Aromatic and perfectly balanced."
            author="Nikos P."
          />
          <TestimonialCard
            text="Speedy delivery in plastic‑free packaging. Will be gifting the pantry box!"
            author="Maria L."
          />
        </div>
      </section>

      {/* NEWSLETTER */}
      <section
        className="relative mx-auto max-w-6xl px-6"
        aria-labelledby="newsletter-heading"
      >
        <div className="overflow-hidden rounded-3xl border border-[#e8e2d8] bg-white px-6 py-12 shadow-[0_6px_24px_rgba(60,50,39,0.06)] sm:px-10">
          <div className="grid gap-8 sm:grid-cols-[1.2fr,1fr]">
            <div>
              <h3
                id="newsletter-heading"
                className="text-2xl font-serif font-medium tracking-tight text-[#5a4a3f]"
              >
                Join the Oasis list
              </h3>
              <p className="mt-2 max-w-lg text-[#6b625a]">
                Recipes, farm news & 10% off your first order.
              </p>
              <form
                className="mt-5 flex max-w-md items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const email = new FormData(e.currentTarget).get("email");
                  console.log("Subscribe:", email);
                }}
              >
                <Input
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="h-11 flex-1 rounded-xl border-[#e0dcd4] text-[#5a4a3f] placeholder:text-[#8b6f47]/60"
                  required
                  aria-label="Email address"
                />
                <Button
                  type="submit"
                  className="h-11 rounded-xl bg-[#8b6f47] px-5 text-white transition-colors hover:bg-[#a78b62]"
                >
                  Subscribe
                </Button>
              </form>
            </div>
            <div className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-[#e8e2d8] bg-neutral-50">
                <Image
                  src="https://images.unsplash.com/photo-1508075469951-712543abf0b8?q=80&w=1600&auto=format&fit=crop"
                  alt="Cretan pantry ingredients: oil, honey, tea"
                  fill
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  className="object-cover"
                />
              </div>
              <div
                className="pointer-events-none absolute -right-6 -top-6 hidden h-24 w-24 rounded-full bg-[#e6dccf] blur-2xl sm:block"
                aria-hidden
              />
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex flex-col items-center justify-between gap-4 rounded-3xl border border-[#e8e2d8] bg-white px-6 py-10 text-center shadow-[0_6px_24px_rgba(60,50,39,0.06)] sm:flex-row sm:text-left">
          <div>
            <h3 className="text-xl font-serif font-medium text-[#5a4a3f]">
              Ready to stock your pantry?
            </h3>
            <p className="text-[#6b625a]">
              Explore olive oil, honey, herbal teas, wine & sweets from Crete.
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              asChild
              className="rounded-xl bg-[#8b6f47] text-white transition-colors hover:bg-[#a78b62]"
            >
              <Link href="/shop">Shop all</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-[#e0dcd4] bg-white text-[#5a4a3f] hover:bg-[#faf7f1]"
            >
              <Link href="/about">About Oasis</Link>
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-[#e0dcd4]">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-8 text-[#6b625a] sm:flex-row">
          <p className="text-sm">
            © {new Date().getFullYear()} Oasis Cretan Wellness
          </p>
          <div className="flex items-center gap-5 text-sm">
            <Link href="/shipping" className="hover:text-[#5a4a3f]">
              Shipping
            </Link>
            <Link href="/returns" className="hover:text-[#5a4a3f]">
              Returns
            </Link>
            <Link href="/experiences" className="hover:text-[#5a4a3f]">
              Experiences
            </Link>
            <Link href="/contact" className="hover:text-[#5a4a3f]">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ---------------------------- Components ---------------------------- */

function AnnouncementBar() {
  return (
    <div className="bg-[#5a4a3f] text-white">
      <div className="mx-auto max-w-7xl px-6 py-2 text-center text-sm">
        <Link href="/shipping" className="underline-offset-2 hover:underline">
          Free EU shipping over €50
        </Link>{" "}
        · Easy 30‑day returns
      </div>
    </div>
  );
}

function AmbientBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 opacity-50 [mask-image:radial-gradient(60%_40%_at_50%_0%,black,transparent)]">
      {/* Sandy beige */}
      <div className="absolute -top-24 left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[#e6dccf] blur-3xl" />
      {/* Soft terracotta */}
      <div className="absolute top-40 right-1/3 h-[340px] w-[540px] rounded-full bg-[#d7beaf] blur-3xl" />
    </div>
  );
}

function TrustPill({ icon: Icon, label }) {
  return (
    <div className="flex items-center gap-2 rounded-full border border-[#e8e2d8] bg-white px-3 py-2 shadow-sm">
      <Icon className="h-4 w-4 text-[#8b6f47]" aria-hidden />
      <span className="text-sm text-[#5a4a3f]">{label}</span>
    </div>
  );
}

function CategoryCard({ slug, title, blurb, icon: Icon, image }) {
  return (
    <Link
      href={`/shop/${encodeURIComponent(slug)}`}
      className="group relative min-w-[260px] snap-start overflow-hidden rounded-3xl border border-[#e8e2d8] bg-white shadow-[0_6px_24px_rgba(60,50,39,0.06)] transition-all hover:shadow-[0_10px_30px_rgba(60,50,39,0.10)]"
    >
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-black/0 opacity-70 transition group-hover:opacity-80"
        aria-hidden
      />
      <div className="relative h-44 w-full">
        <Image
          src={image}
          alt={title}
          fill
          sizes="320px"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
      </div>
      <div className="p-5">
        <div className="mb-1 flex items-center gap-2 text-[#5a4a3f]">
          <span className="rounded-xl bg-[#efeae2] p-2">
            <Icon className="h-4 w-4 text-[#8b6f47]" aria-hidden />
          </span>
          <h3 className="font-serif font-medium">{title}</h3>
        </div>
        <p className="text-sm text-[#6b625a]">{blurb}</p>
      </div>
    </Link>
  );
}

function BentoTile({ title, blurb, image, badge, href = "#", className = "" }) {
  return (
    <Link
      href={href}
      className={`group relative overflow-hidden rounded-3xl border border-[#e8e2d8] bg-white shadow-[0_6px_24px_rgba(60,50,39,0.06)] transition-all hover:shadow-[0_10px_30px_rgba(60,50,39,0.10)] ${className}`}
    >
      <div className="relative aspect-[3/2]">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 640px) 40vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.02]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/0 to-transparent"
          aria-hidden
        />
        {badge && (
          <div className="absolute left-4 top-4">
            <Badge className="rounded-full bg:white/90 bg-white/90 text-[#5a4a3f] shadow-sm">
              {badge}
            </Badge>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-lg font-serif font-medium text-[#5a4a3f]">
          {title}
        </h3>
        <p className="mt-1 text-sm text-[#6b625a]">{blurb}</p>
      </div>
    </Link>
  );
}

function EthosCard({ icon: Icon, title, text }) {
  return (
    <Card className="rounded-3xl border-[#e8e2d8] bg:white bg-white shadow-[0_6px_24px_rgba(60,50,39,0.06)]">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-serif font-medium text-[#5a4a3f]">
          <span className="rounded-xl bg-[#efeae2] p-2">
            <Icon className="h-4 w-4 text-[#8b6f47]" aria-hidden />
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-[#6b625a]">{text}</p>
      </CardContent>
    </Card>
  );
}

function TestimonialCard({ text, author }) {
  return (
    <Card className="rounded-3xl border-[#e8e2d8] bg:white bg-white shadow-[0_6px_24px_rgba(60,50,39,0.06)]">
      <CardContent className="p-6">
        <div
          className="mb-2 flex items-center gap-1 text-[#b45309]"
          aria-hidden
        >
          <Star className="h-4 w-4 fill-current" />
          <Star className="h-4 w-4 fill-current" />
          <Star className="h-4 w-4 fill-current" />
          <Star className="h-4 w-4 fill-current" />
          <Star className="h-4 w-4 fill-current" />
        </div>
        <span className="sr-only">5 out of 5 stars</span>
        <p className="text-[#4a4a4a] italic">“{text}”</p>
        <p className="mt-3 text-sm font-medium text-[#8b6f47]">— {author}</p>
      </CardContent>
    </Card>
  );
}

function ProductCard({ p, onAdd = () => {} }) {
  const productUrl = `/product/${p.id}`;

  const handleAddClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    onAdd(p);
  };

  return (
    <Card className="group overflow-hidden rounded-3xl border-[#e8e2d8] bg-white shadow-[0_6px_24px_rgba(60,50,39,0.06)] transition-all hover:shadow-[0_10px_30px_rgba(60,50,39,0.10)]">
      <Link href={productUrl}>
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={p.image}
            alt={p.name}
            fill
            sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          {p.badge && (
            <div className="absolute left-3 top-3">
              <Badge className="rounded-full bg-white/90 text-[#5a4a3f] shadow-sm">
                {p.badge}
              </Badge>
            </div>
          )}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
            aria-hidden
          />
        </div>
      </Link>
      <CardHeader className="px-5 pb-1 pt-4">
        <CardTitle className="text-base font-serif font-medium text-[#5a4a3f]">
          <Link href={productUrl} className="transition hover:text-[#8b6f47]">
            {p.name}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="px-5 pb-5 text-sm text-[#6b625a]">
        <p>{p.desc}</p>
        <div
          className="mt-3 flex items-center gap-1 text-[#b45309]"
          aria-hidden
        >
          {Array.from({ length: p.rating || 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
        </div>
        <span className="sr-only">Rated {p.rating || 5} out of 5</span>
        <div className="mt-4 flex items-center justify-between">
          <div className="font-medium text-[#5a4a3f]">
            €{p.price.toFixed(2)}
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleAddClick}
              className="rounded-xl bg-[#8b6f47] text-white transition-colors hover:bg-[#a78b62]"
              aria-label={`Add ${p.name} to cart`}
            >
              Add
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
