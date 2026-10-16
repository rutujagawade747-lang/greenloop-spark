import { createFileRoute, Link } from "@tanstack/react-router";
import { Recycle, Brush, Sprout, ShoppingBag, ArrowRight, Users, MapPin, Truck, Building2, Package, Factory, Coins } from "lucide-react";
import hero from "@/assets/hero.jpg";
import segregate from "@/assets/segregate.jpg";
import products from "@/assets/products.jpg";
import { SectionTitle } from "@/components/Layout";
import { RiderSection } from "@/components/RiderForm";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoLoop — Be a Part of a Cleaner Future" },
      { name: "description", content: "Donate segregated waste, join cleanup drives, learn to reuse and shop recycled products with EcoLoop." },
      { property: "og:title", content: "EcoLoop — Be a Part of a Cleaner Future" },
      { property: "og:description", content: "EcoLoop connects people, waste and ideas to create a cleaner environment." },
    ],
  }),
  component: Home,
});

const activities = [
  { icon: Recycle, title: "Donate Waste", text: "Contribute segregated household waste.", to: "/recycle" },
  { icon: Brush, title: "Cleanup Drives", text: "Join or organize cleanliness drives.", to: "/cleanups" },
  { icon: Sprout, title: "Learn & Reuse", text: "Learn how to segregate, recycle and reuse waste.", to: "/recycle" },
  { icon: ShoppingBag, title: "Eco Marketplace", text: "Buy and sell recycled and upcycled products.", to: "/marketplace" },
] as const;

const loop = [
  { icon: Users, t: "People" }, { icon: Recycle, t: "Waste Contribution" }, { icon: MapPin, t: "Collection Point" },
  { icon: Truck, t: "Rider" }, { icon: Building2, t: "Sorting Centre" }, { icon: Package, t: "Sorted Raw Material" },
  { icon: Factory, t: "Manufacturer" }, { icon: Recycle, t: "Recycled Product" }, { icon: ShoppingBag, t: "Marketplace" },
];

function Home() {
  return (
    <>
      <section className="relative">
        <img src={hero} alt="Women and volunteers cleaning a park together" width={1600} height={1008} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-forest/90 via-forest/60 to-transparent" />
        <div className="relative mx-auto max-w-6xl px-4 py-28 md:py-40">
          <p className="chip bg-sand text-accent-foreground">🌱 Community-powered recycling</p>
          <h1 className="mt-5 max-w-xl text-4xl font-semibold leading-tight text-forest-foreground md:text-6xl">Be a Part of a Cleaner Future</h1>
          <p className="mt-5 max-w-lg text-lg text-forest-foreground/85">EcoLoop connects people, waste and ideas to create a cleaner and more sustainable environment.</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/recycle" className="btn btn-sand">Donate Waste</Link>
            <Link to="/cleanups" className="btn btn-primary">Join a Cleanup</Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <SectionTitle eyebrow="How it works" title="One simple loop" />
        <div className="flex flex-wrap items-center justify-center gap-3">
          {["People", "Collection", "Sorting", "Manufacturer", "New Products"].map((s, i, a) => (
            <div key={s} className="flex items-center gap-3">
              <span className="card-soft px-5 py-3 font-semibold text-forest">{s}</span>
              {i < a.length - 1 && <ArrowRight className="h-5 w-5 text-leaf" />}
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {activities.map((a) => (
            <Link key={a.title} to={a.to} className="card-soft group p-6 transition hover:-translate-y-1">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary"><a.icon /></span>
              <h3 className="mt-4 text-xl font-semibold text-forest">{a.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{a.text}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">Explore <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-24 md:grid-cols-2">
        <img src={segregate} alt="Segregating plastic, paper and cardboard at home" loading="lazy" width={1200} height={912} className="rounded-3xl object-cover shadow-xl" />
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-earth">It starts at home</p>
          <h2 className="mt-2 text-3xl font-semibold text-forest md:text-4xl">Your kitchen is the first collection point</h2>
          <p className="mt-4 text-muted-foreground">Rinse, dry and separate. Drop it at a nearby EcoLoop point. Every kilo you sort becomes raw material for local makers — and earns you EcoCoins.</p>
          <Link to="/recycle" className="btn btn-primary mt-6">Learn to segregate</Link>
        </div>
      </section>

      <section className="bg-sand py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle eyebrow="The complete EcoLoop" title="From your bin, back to your hands" text="Alongside the loop, you can join or organize cleanup drives and earn EcoCoins for taking part." />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {loop.map((s, i) => (
              <div key={s.t} className="card-soft flex flex-col items-center p-4 text-center">
                <span className="text-xs font-bold text-earth">{String(i + 1).padStart(2, "0")}</span>
                <s.icon className="my-2 h-6 w-6 text-primary" />
                <span className="text-sm font-semibold">{s.t}</span>
              </div>
            ))}
            <div className="flex flex-col items-center justify-center rounded-3xl bg-primary p-4 text-center text-primary-foreground">
              <Coins className="h-6 w-6" /><span className="mt-2 text-sm font-semibold">Back to People · EcoCoins</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-24"><RiderSection /></section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="relative overflow-hidden rounded-3xl">
          <img src={products} alt="Upcycled coconut bowls, incense and paper journals" loading="lazy" width={1200} height={912} className="h-80 w-full object-cover" />
          <div className="absolute inset-0 flex flex-col items-start justify-center bg-gradient-to-r from-forest/85 to-transparent p-8 md:p-14">
            <h2 className="max-w-md text-3xl font-semibold text-forest-foreground">Made from what you gave back</h2>
            <Link to="/marketplace" className="btn btn-sand mt-6">Visit the Marketplace</Link>
          </div>
        </div>
      </section>
    </>
  );
}
