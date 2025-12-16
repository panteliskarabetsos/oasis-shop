"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Search,
  Leaf,
  ShieldCheck,
  Recycle,
  Truck,
  Droplets,
  Flower2,
  CupSoda,
  Heart,
  Star,
  Package,
  Sparkles,
} from "lucide-react";

// shadcn/ui
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";

/* ------------------------------- Data ------------------------------- */
const categories = [
  {
    slug: "olive-oil",
    title: "Olive Oil",
    blurb: "Cold-pressed, small-batch, PDO/PGI.",
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
    blurb: "Sun-cured olives, capers & more.",
    icon: Leaf,
    image: "/olives.jpg",
  },
];

const quickFilters = [
  { label: "Olive Oil", tag: "olive-oil" },
  { label: "Honey", tag: "honey" },
  { label: "Wine", tag: "wine" },
  { label: "Herbal Teas", tag: "herbal-teas" },
  { label: "Olives", tag: "olives" },
  { label: "Sweets", tag: "sweets" },
];

const benefits = [
  {
    icon: ShieldCheck,
    title: "Traceable origin",
    text: "PDO/PGI & producer-led sourcing.",
  },
  {
    icon: Recycle,
    title: "Plastic-free packing",
    text: "Recyclable materials, low-impact.",
  },
  {
    icon: Truck,
    title: "Fast EU delivery",
    text: "Reliable shipping with careful handling.",
  },
  {
    icon: Sparkles,
    title: "Small-batch quality",
    text: "Fresh harvests, honest ingredients.",
  },
];

/* ------------------------------- Page ------------------------------- */
export default function OasisShopHome() {
  const router = useRouter();
  const reduceMotion = useReducedMotion();

  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");
  const [products, setProducts] = React.useState([]);

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("/api/shop/featured?limit=8", {
          cache: "no-store",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load products");
        if (!cancelled) setProducts(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!cancelled) setError(e?.message || String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const addToCart = (p) => {
    // hook this to your cart store
    console.log("Add to cart:", p.slug);
  };

  const onSearch = (e) => {
    e.preventDefault();
    const q = new FormData(e.currentTarget).get("q");
    const qq = String(q || "").trim();
    if (qq) router.push(`/shop?q=${encodeURIComponent(qq)}`);
  };

  const onQuickFilter = (tag) =>
    router.push(`/shop?tag=${encodeURIComponent(tag)}`);

  const fade = {
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0 : 0.6, ease: "easeOut" },
    },
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#26231F]">
      <BackgroundMesh />
      <NoiseOverlay />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-6 focus:top-4 focus:z-[60] rounded-xl bg-white px-3 py-2 text-sm shadow"
      >
        Skip to content
      </a>

      <main id="main" className="mx-auto max-w-7xl px-6">
        {/* HERO */}
        <section className="pt-10 sm:pt-14">
          <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Left */}
            <motion.div
              variants={fade}
              initial="hidden"
              animate="show"
              className="lg:col-span-6"
            >
              <div className="inline-flex flex-wrap items-center gap-2">
                <Badge className="bg-[#627257] text-white hover:bg-[#627257]">
                  Oasis Pantry
                </Badge>
                <Badge className="bg-white text-[#26231F] hover:bg-white border border-[#E7E0D7]">
                  Family-run
                </Badge>
                <Badge className="bg-white text-[#26231F] hover:bg-white border border-[#E7E0D7]">
                  PDO/PGI
                </Badge>
              </div>

              <h1 className="mt-5 font-serif text-4xl font-medium tracking-tight text-[#26231F] sm:text-5xl lg:text-6xl lg:leading-[1.05]">
                Modern essentials,
                <span className="block text-[#627257]">rooted in Crete.</span>
              </h1>

              <p className="mt-4 max-w-xl text-base text-[#6A625A] sm:text-lg">
                Extra virgin olive oil, thyme honey, herbal teas, wines, olives
                and sweets—sourced from small producers we know, shipped with
                care.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  asChild
                  size="lg"
                  className="h-12 rounded-2xl bg-[#627257] px-6 text-white hover:bg-[#728366]"
                >
                  <Link href="#featured" className="flex items-center gap-2">
                    Shop featured <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>

                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 rounded-2xl border-[#E7E0D7] bg-white px-6 text-[#26231F] hover:bg-[#FBFAF7]"
                >
                  <Link href="/shop" className="flex items-center gap-2">
                    Explore catalog{" "}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
              </div>

              {/* Search */}
              <form
                onSubmit={onSearch}
                className="mt-6 flex w-full max-w-xl items-center gap-2 rounded-2xl border border-[#E7E0D7] bg-white p-2 shadow-sm"
                aria-label="Search products"
              >
                <div className="flex flex-1 items-center gap-2 rounded-xl bg-[#FBFAF7] px-3">
                  <Search className="h-4 w-4 text-[#6A625A]" aria-hidden />
                  <Input
                    name="q"
                    placeholder="Search olive oil, honey, teas…"
                    className="h-11 flex-1 border-0 bg-transparent text-[#26231F] placeholder:text-[#6A625A] focus-visible:ring-0"
                    aria-label="Search query"
                  />
                </div>
                <Button
                  type="submit"
                  className="h-11 rounded-xl bg-[#B07A4B] px-5 text-white hover:bg-[#C18A5A]"
                >
                  Search
                </Button>
              </form>

              {/* Quick filters */}
              <div className="mt-4 flex flex-wrap gap-2">
                {quickFilters.map((f) => (
                  <Button
                    key={f.tag}
                    variant="outline"
                    className="h-9 rounded-full border-[#E7E0D7] bg-white text-[#26231F] hover:bg-[#FBFAF7]"
                    onClick={() => onQuickFilter(f.tag)}
                  >
                    {f.label}
                  </Button>
                ))}
              </div>

              {/* Micro trust */}
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                <MiniStat
                  icon={ShieldCheck}
                  label="Traceable origin"
                  value="PDO/PGI"
                />
                <MiniStat
                  icon={Recycle}
                  label="Packaging"
                  value="Plastic-free"
                />
              </div>
            </motion.div>

            {/* Right */}
            <motion.div
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="lg:col-span-6"
            >
              <div className="relative overflow-hidden rounded-[28px] border border-[#E7E0D7] bg-white shadow-[0_18px_60px_rgba(32,28,24,0.10)]">
                <div className="relative aspect-[16/11]">
                  <Image
                    src="/pure-cosmetic.jpg"
                    alt="Olive oil, honey and bread on a rustic Cretan table"
                    fill
                    priority
                    sizes="(min-width: 1024px) 50vw, 100vw"
                    className="object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent"
                    aria-hidden
                  />
                </div>

                {/* Floating card */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="rounded-2xl border border-white/25 bg-white/85 p-4 backdrop-blur">
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-sm font-semibold text-[#26231F]">
                          Pantry Box
                        </div>
                        <div className="mt-0.5 text-xs text-[#6A625A]">
                          Gift-worthy staples, curated monthly.
                        </div>
                      </div>
                      <div
                        className="inline-flex items-center gap-1 text-[#B07A4B]"
                        aria-hidden
                      >
                        <Star className="h-4 w-4 fill-current" />
                        <span className="text-xs font-semibold text-[#26231F]">
                          4.9
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 grid gap-2 sm:grid-cols-3">
                      <Chip icon={Package} text="Careful packing" />
                      <Chip icon={Truck} text="Fast EU delivery" />
                      <Chip icon={Leaf} text="Small producers" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bento benefits */}
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {benefits.map((b) => (
                  <BentoBenefit key={b.title} {...b} />
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="py-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-serif font-medium tracking-tight">
                Shop by category
              </h2>
              <p className="mt-1 text-sm text-[#6A625A]">
                Minimal, curated essentials—straight from Crete.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-sm text-[#627257] hover:text-[#728366]"
            >
              View all
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-12 gap-4">
            <CategoryBentoCard
              c={categories[0]}
              className="col-span-12 sm:col-span-7"
            />
            <CategoryBentoCard
              c={categories[1]}
              className="col-span-12 sm:col-span-5"
            />
            <CategoryBentoCard
              c={categories[2]}
              className="col-span-12 sm:col-span-4"
            />
            <CategoryBentoCard
              c={categories[3]}
              className="col-span-12 sm:col-span-4"
            />
            <CategoryBentoCard
              c={categories[4]}
              className="col-span-12 sm:col-span-4"
            />
            <CategoryBentoCard c={categories[5]} className="col-span-12" />
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section id="featured" className="pb-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-serif font-medium tracking-tight">
                Featured products
              </h2>
              <p className="mt-1 text-sm text-[#6A625A]">
                Handpicked favorites with excellent value.
              </p>
            </div>
            <Link
              href="/shop"
              className="text-sm text-[#627257] hover:text-[#728366]"
            >
              Browse catalog
            </Link>
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {loading
              ? Array.from({ length: 8 }).map((_, i) => (
                  <ProductSkeleton key={i} />
                ))
              : products.map((p) => (
                  <ModernProductCard
                    key={p.slug}
                    p={p}
                    onAdd={() => addToCart(p)}
                  />
                ))}
          </div>
        </section>

        {/* STORY / PROCESS */}
        <section className="pb-16">
          <div className="grid gap-6 rounded-[28px] border border-[#E7E0D7] bg-white p-7 shadow-[0_14px_50px_rgba(32,28,24,0.08)] sm:p-10 lg:grid-cols-12 lg:gap-10">
            <div className="lg:col-span-5">
              <Badge className="bg-[#FBFAF7] text-[#26231F] hover:bg-[#FBFAF7] border border-[#E7E0D7]">
                Our approach
              </Badge>
              <h3 className="mt-4 font-serif text-3xl font-medium tracking-tight">
                Farm-first, modern packaging.
              </h3>
              <p className="mt-3 text-[#6A625A]">
                Our e-shop is an extension of our farm life in Crete—simple
                foods, clean ingredients, and thoughtful delivery.
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <ProcessRow
                  title="Harvest & source"
                  text="Seasonal, small producers we trust."
                />
                <ProcessRow
                  title="Prepare & bottle"
                  text="Low intervention, freshness-first."
                />
                <ProcessRow
                  title="Pack with care"
                  text="Plastic-free, gift-ready."
                />
                <ProcessRow
                  title="Ship reliably"
                  text="Fast EU delivery options."
                />
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button
                  asChild
                  className="rounded-2xl bg-[#627257] text-white hover:bg-[#728366]"
                >
                  <Link href="/experiences" className="flex items-center gap-2">
                    Visit our farm{" "}
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="rounded-2xl border-[#E7E0D7] bg-white text-[#26231F] hover:bg-[#FBFAF7]"
                >
                  <Link href="/about">Read our story</Link>
                </Button>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative overflow-hidden rounded-[24px] border border-[#E7E0D7] bg-[#FBFAF7]">
                <div className="relative aspect-[16/10]">
                  <Image
                    src="/honey.png"
                    alt="Sunlit Cretan landscape"
                    fill
                    sizes="(min-width: 1024px) 60vw, 100vw"
                    className="object-cover"
                  />
                  <div
                    className="absolute inset-0 bg-gradient-to-tr from-black/25 via-black/0 to-black/0"
                    aria-hidden
                  />
                </div>

                <div className="absolute left-4 top-4 rounded-2xl border border-white/25 bg-white/85 px-4 py-3 text-sm backdrop-blur">
                  <div className="flex items-center gap-2 font-semibold text-[#26231F]">
                    <Leaf className="h-4 w-4 text-[#627257]" aria-hidden />
                    Rooted in Crete
                  </div>
                  <div className="mt-1 text-xs text-[#6A625A]">
                    Orchards • beehives • native herbs
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-3">
                <SoftCard
                  icon={Droplets}
                  title="Fresh harvest"
                  text="Peppery, vibrant EVOO."
                />
                <SoftCard
                  icon={Flower2}
                  title="Raw honey"
                  text="Aromatic thyme notes."
                />
                <SoftCard
                  icon={CupSoda}
                  title="Herbal blends"
                  text="Soothe & restore."
                />
              </div>
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        <section className="pb-16">
          <div className="relative overflow-hidden rounded-[28px] border border-[#E7E0D7] bg-white p-7 shadow-[0_14px_50px_rgba(32,28,24,0.08)] sm:p-10">
            <div
              className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-[#DDE3D6] blur-3xl opacity-70"
              aria-hidden
            />
            <div
              className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-[#EAD8C9] blur-3xl opacity-70"
              aria-hidden
            />

            <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
              <div className="relative lg:col-span-7">
                <Badge className="bg-[#FBFAF7] text-[#26231F] hover:bg-[#FBFAF7] border border-[#E7E0D7]">
                  Newsletter
                </Badge>
                <h3 className="mt-4 font-serif text-3xl font-medium tracking-tight">
                  Recipes, drops, and 10% off.
                </h3>
                <p className="mt-2 max-w-xl text-[#6A625A]">
                  Occasional emails with farm updates, seasonal releases, and
                  simple Cretan recipes.
                </p>

                <form
                  className="mt-6 flex max-w-md items-center gap-2"
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
                    className="h-11 flex-1 rounded-xl border-[#E7E0D7] bg-white text-[#26231F] placeholder:text-[#6A625A]"
                    required
                    aria-label="Email address"
                  />
                  <Button
                    type="submit"
                    className="h-11 rounded-xl bg-[#B07A4B] px-5 text-white hover:bg-[#C18A5A]"
                  >
                    Subscribe
                  </Button>
                </form>

                <div className="mt-5 flex flex-wrap gap-2 text-xs text-[#6A625A]">
                  <Chip icon={Package} text="Occasional emails" />
                  <Chip icon={ShieldCheck} text="No spam" />
                  <Chip icon={Truck} text="Early drops" />
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="relative overflow-hidden rounded-[24px] border border-[#E7E0D7] bg-[#FBFAF7]">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src="/olives.jpg"
                      alt="Cretan pantry ingredients"
                      fill
                      sizes="(min-width: 1024px) 40vw, 100vw"
                      className="object-cover"
                    />
                    <div
                      className="absolute inset-0 bg-gradient-to-t from-black/25 via-black/0 to-black/0"
                      aria-hidden
                    />
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 rounded-2xl border border-white/25 bg-white/85 p-4 backdrop-blur">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-[#26231F]">
                        Seasonal picks
                      </div>
                      <span className="text-xs text-[#6A625A]">
                        Limited batches
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#6A625A]">
                      Be first to know when fresh harvests arrive.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER CTA */}
        <section className="pb-10">
          <div className="flex flex-col items-center justify-between gap-4 rounded-[28px] border border-[#E7E0D7] bg-white px-6 py-10 text-center shadow-[0_14px_50px_rgba(32,28,24,0.08)] sm:flex-row sm:text-left">
            <div>
              <h3 className="font-serif text-xl font-medium">
                Ready to stock your pantry?
              </h3>
              <p className="mt-1 text-[#6A625A]">
                Explore olive oil, honey, herbal teas, wine & sweets from Crete.
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                asChild
                className="rounded-2xl bg-[#627257] text-white hover:bg-[#728366]"
              >
                <Link href="/shop">Shop all</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="rounded-2xl border-[#E7E0D7] bg-white text-[#26231F] hover:bg-[#FBFAF7]"
              >
                <Link href="/about">About Oasis</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Keep your global footer elsewhere if you already have one */}
    </div>
  );
}

/* ---------------------------- Components ---------------------------- */

function BackgroundMesh() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_30%_0%,rgba(221,227,214,0.95),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(50%_40%_at_85%_30%,rgba(234,216,201,0.75),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(50%_45%_at_15%_85%,rgba(251,250,247,0.95),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_40%,rgba(20,15,10,0.06)_100%)]" />
    </div>
  );
}

function NoiseOverlay() {
  const noiseSvg =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='120' height='120' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E";
  return (
    <div
      className="pointer-events-none fixed inset-0 -z-10 opacity-[0.10] mix-blend-multiply"
      style={{ backgroundImage: `url("${noiseSvg}")` }}
      aria-hidden
    />
  );
}

function Chip({ icon: Icon, text }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-[#E7E0D7] bg-white/80 px-3 py-1 text-xs text-[#6A625A]">
      <Icon className="h-3.5 w-3.5 text-[#B07A4B]" aria-hidden />
      {text}
    </span>
  );
}

function MiniStat({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-[#E7E0D7] bg-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#FBFAF7] border border-[#E7E0D7]">
          <Icon className="h-4 w-4 text-[#627257]" aria-hidden />
        </span>
        <div className="leading-tight">
          <div className="text-xs text-[#6A625A]">{label}</div>
          <div className="text-sm font-semibold">{value}</div>
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-[#B07A4B]" aria-hidden />
    </div>
  );
}

function BentoBenefit({ icon: Icon, title, text }) {
  return (
    <div className="rounded-[22px] border border-[#E7E0D7] bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#FBFAF7] border border-[#E7E0D7]">
          <Icon className="h-4 w-4 text-[#B07A4B]" aria-hidden />
        </span>
        <div>
          <div className="text-sm font-semibold text-[#26231F]">{title}</div>
          <div className="mt-1 text-sm text-[#6A625A]">{text}</div>
        </div>
      </div>
    </div>
  );
}

function CategoryBentoCard({ c, className = "" }) {
  const Icon = c.icon;
  return (
    <Link
      href={`/shop/${encodeURIComponent(c.slug)}`}
      className={[
        "group relative overflow-hidden rounded-[26px] border border-[#E7E0D7] bg-white shadow-[0_14px_50px_rgba(32,28,24,0.08)]",
        "transition hover:-translate-y-[2px] hover:shadow-[0_18px_60px_rgba(32,28,24,0.12)]",
        className,
      ].join(" ")}
    >
      <div className="relative h-52 sm:h-56">
        <Image
          src={c.image}
          alt={c.title}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-[1.03]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/10 to-transparent"
          aria-hidden
        />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl border border-white/25 bg-white/85 backdrop-blur">
            <Icon className="h-4 w-4 text-[#627257]" aria-hidden />
          </span>
          <div className="min-w-0">
            <div className="text-base font-serif font-medium text-white">
              {c.title}
            </div>
            <div className="mt-0.5 text-sm text-white/80 line-clamp-1">
              {c.blurb}
            </div>
          </div>
        </div>

        <div className="mt-4 inline-flex items-center gap-2 text-sm text-white/90">
          Explore
          <ArrowRight
            className="h-4 w-4 transition group-hover:translate-x-0.5"
            aria-hidden
          />
        </div>
      </div>
    </Link>
  );
}

function ProcessRow({ title, text }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-[#E7E0D7] bg-[#FBFAF7] p-4">
      <span
        className="mt-0.5 inline-flex h-2 w-2 rounded-full bg-[#B07A4B]"
        aria-hidden
      />
      <div>
        <div className="text-sm font-semibold text-[#26231F]">{title}</div>
        <div className="mt-1 text-sm text-[#6A625A]">{text}</div>
      </div>
    </div>
  );
}

function SoftCard({ icon: Icon, title, text }) {
  return (
    <div className="rounded-[22px] border border-[#E7E0D7] bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#FBFAF7] border border-[#E7E0D7]">
          <Icon className="h-4 w-4 text-[#B07A4B]" aria-hidden />
        </span>
        <div>
          <div className="text-sm font-semibold text-[#26231F]">{title}</div>
          <div className="mt-1 text-sm text-[#6A625A]">{text}</div>
        </div>
      </div>
    </div>
  );
}

function ModernProductCard({ p, onAdd = () => {} }) {
  const productUrl = `/product/${encodeURIComponent(p.slug)}`;
  const stockQty =
    typeof p.stock_qty === "number"
      ? p.stock_qty
      : typeof p.stockQty === "number"
      ? p.stockQty
      : null;

  const img = getProductImage(p);
  const isOut = stockQty === 0;

  const handleAddClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!isOut) onAdd(p);
  };

  return (
    <Card className="group overflow-hidden rounded-[26px] border-[#E7E0D7] bg-white shadow-[0_14px_50px_rgba(32,28,24,0.08)] transition hover:-translate-y-[2px] hover:shadow-[0_18px_60px_rgba(32,28,24,0.12)]">
      <Link href={productUrl} className="block">
        <div className="relative overflow-hidden">
          <div className="relative aspect-[4/3] bg-[#FBFAF7]">
            <Image
              src={img.url}
              alt={img.alt || p.title}
              fill
              sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          </div>

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Stock pill (based on your shop_product.stock_qty) */}
          {stockQty !== null ? (
            <div className="absolute left-3 top-3">
              <span
                className={[
                  "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium backdrop-blur",
                  isOut
                    ? "border-white/30 bg-white/75 text-[#7A1F1F]"
                    : "border-white/30 bg-white/75 text-[#2B2B27]",
                ].join(" ")}
              >
                {isOut
                  ? "Out of stock"
                  : stockQty <= 5
                  ? "Low stock"
                  : "In stock"}
              </span>
            </div>
          ) : null}
        </div>
      </Link>

      <CardHeader className="px-5 pb-1 pt-4">
        <CardTitle className="text-base font-serif font-medium text-[#26231F]">
          <Link href={productUrl} className="transition hover:text-[#627257]">
            {p.title}
          </Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="px-5 pb-5 text-sm text-[#6A625A]">
        {p.description ? (
          <p className="line-clamp-2">{p.description}</p>
        ) : (
          <div className="h-[1.25rem]" />
        )}

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="text-base font-semibold text-[#26231F]">
            {formatCents(p.price_cents, p.currency)}
          </div>

          <Button
            onClick={handleAddClick}
            disabled={isOut}
            className={[
              "h-10 rounded-xl px-4 text-white",
              isOut
                ? "bg-[#9AA59A] hover:bg-[#9AA59A] cursor-not-allowed"
                : "bg-[#627257] hover:bg-[#728366]",
            ].join(" ")}
            aria-label={`Add ${p.title} to cart`}
          >
            Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function ProductSkeleton() {
  return (
    <Card className="overflow-hidden rounded-[26px] border-[#E7E0D7] bg-white">
      <div className="relative aspect-[4/3] animate-pulse bg-[#EFEAE2]" />
      <div className="space-y-2 p-5">
        <div className="h-4 w-2/3 animate-pulse rounded bg-[#EFEAE2]" />
        <div className="h-3 w-full animate-pulse rounded bg-[#F3EFE8]" />
        <div className="mt-4 flex items-center justify-between">
          <div className="h-4 w-16 animate-pulse rounded bg-[#EFEAE2]" />
          <div className="h-10 w-20 animate-pulse rounded bg-[#EFEAE2]" />
        </div>
      </div>
    </Card>
  );
}

/* ------------------------------- Utils ------------------------------ */
function formatCents(cents, currency = "EUR") {
  const v = Number(cents || 0) / 100;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(v);
  } catch {
    return `€${v.toFixed(2)}`;
  }
}

/**
 * Works with:
 * - old API: p.image_url
 * - direct shop_image join: p.images / p.shop_images / p.shop_image
 * - any common naming: imageUrl / primary_image_url
 */
function getProductImage(p) {
  const fallback = {
    url: "/placeholder-product.jpg",
    alt: p?.title || "Product",
  };

  const direct =
    p?.image_url || p?.imageUrl || p?.primary_image_url || p?.primaryImageUrl;

  if (direct) return { url: direct, alt: p?.title || "" };

  // shop_image join patterns
  const list =
    (Array.isArray(p?.images) && p.images) ||
    (Array.isArray(p?.shop_images) && p.shop_images) ||
    (Array.isArray(p?.shop_image) && p.shop_image) ||
    (Array.isArray(p?.shopImages) && p.shopImages) ||
    null;

  if (list && list.length) {
    // if array is [{url, alt, sort}] OR ["url1", "url2"]
    const sorted = [...list].sort((a, b) => {
      const sa = typeof a === "object" ? Number(a.sort || 0) : 0;
      const sb = typeof b === "object" ? Number(b.sort || 0) : 0;
      return sa - sb;
    });
    const first = sorted[0];
    if (typeof first === "string") return { url: first, alt: p?.title || "" };
    if (first?.url)
      return { url: first.url, alt: first?.alt || p?.title || "" };
  }

  return fallback;
}
