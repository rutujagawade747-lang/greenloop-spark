import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, CheckCircle2, Droplets, Lightbulb } from "lucide-react";
import segregate from "@/assets/segregate.jpg";
import crafts from "@/assets/crafts.jpg";
import products from "@/assets/products.jpg";
import { SectionTitle } from "@/components/Layout";
import { RiderSection } from "@/components/RiderForm";
import { WASTE, useStore } from "@/lib/store";

export const Route = createFileRoute("/recycle")({
  head: () => ({
    meta: [
      { title: "Recycle & Learn — EcoLoop" },
      { name: "description", content: "Donate segregated waste and learn simple ways to clean, sort and reuse household materials." },
      { property: "og:title", content: "Recycle & Learn — EcoLoop" },
      { property: "og:description", content: "Donate waste and learn segregation, recycling and DIY reuse." },
    ],
  }),
  component: Recycle,
});

const Flow = ({ steps }: { steps: string[] }) => (
  <div className="flex flex-wrap items-center gap-2">
    {steps.map((s, i) => (
      <span key={s} className="flex items-center gap-2">
        <span className="chip">{s}</span>
        {i < steps.length - 1 && <ArrowRight className="h-3.5 w-3.5 text-leaf" />}
      </span>
    ))}
  </div>
);

const categories = [
  { t: "Dry recyclables", c: "Clean plastic, paper, cardboard, metal cans, glass", tone: "bg-secondary" },
  { t: "Wet / organic", c: "Food scraps, peels, tea leaves — compost at home", tone: "bg-sand" },
  { t: "Reusable organics", c: "Dried flowers, coconut shells — EcoLoop collects these", tone: "bg-accent" },
  { t: "Do not mix", c: "Batteries, medicines, sharp glass, e-waste — hand over separately", tone: "bg-muted" },
];

function Recycle() {
  const { user, points, addContribution } = useStore();
  const [done, setDone] = useState(false);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    addContribution({ type: String(f.get("type")), qty: Number(f.get("qty")), point: String(f.get("point")), date: String(f.get("date")), notes: String(f.get("notes") || "") });
    setDone(true);
    e.currentTarget.reset();
  };

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-16">
        <SectionTitle eyebrow="Recycle & Learn" title="Give your waste a second life" text="Record what you're dropping off, then learn how to sort and reuse better." />
        <div className="grid gap-8 md:grid-cols-2">
          <img src={segregate} alt="Sorting waste into bins" width={1200} height={912} className="h-full max-h-[480px] w-full rounded-3xl object-cover" />
          <div className="card-soft p-6 md:p-8">
            <h2 className="text-2xl font-semibold text-forest">A. Donate Waste</h2>
            {!user ? (
              <div className="mt-6 rounded-2xl bg-secondary p-6">
                <p>Log in so we can save this contribution to your history and EcoCoins.</p>
                <Link to="/auth" className="btn btn-primary mt-4">Login / Register</Link>
              </div>
            ) : done ? (
              <div className="mt-6 rounded-2xl bg-secondary p-6 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-primary" />
                <p className="mt-3 text-lg font-semibold">Your contribution has been recorded.</p>
                <p className="text-sm text-muted-foreground">Drop it at the collection point on the chosen date.</p>
                <div className="mt-4 flex justify-center gap-2">
                  <button onClick={() => setDone(false)} className="btn btn-outline">Add another</button>
                  <Link to="/dashboard" className="btn btn-primary">View history</Link>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="mt-6 grid gap-3 sm:grid-cols-2">
                <label className="text-sm font-semibold">Waste type<select name="type" className="field mt-1">{WASTE.map((w) => <option key={w}>{w}</option>)}</select></label>
                <label className="text-sm font-semibold">Approx. quantity (kg)<input name="qty" type="number" min="0.5" step="0.5" defaultValue={1} required className="field mt-1" /></label>
                <label className="text-sm font-semibold sm:col-span-2">Collection point<select name="point" className="field mt-1">{points.filter((p) => p.status !== "Maintenance").map((p) => <option key={p.id}>{p.name}</option>)}</select></label>
                <label className="text-sm font-semibold sm:col-span-2">Drop-off date<input name="date" type="date" required defaultValue={new Date().toISOString().slice(0, 10)} className="field mt-1" /></label>
                <textarea name="notes" placeholder="Notes (optional)" rows={2} className="field sm:col-span-2" />
                <button className="btn btn-primary sm:col-span-2">Submit contribution</button>
              </form>
            )}
          </div>
        </div>

        <h3 className="mt-14 text-xl font-semibold text-forest">Collection points</h3>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((p) => (
            <div key={p.id} className="card-soft p-5">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{p.name}</p>
                <span className={`chip ${p.status === "Open" ? "" : "bg-accent text-accent-foreground"}`}>{p.status}</span>
              </div>
              <p className="text-sm text-muted-foreground">{p.area} · ~{p.km} km from {user?.area ?? "Virar"}</p>
              <div className="mt-3 flex flex-wrap gap-1">{p.types.map((t) => <span key={t} className="chip bg-muted text-muted-foreground">{t}</span>)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-24 bg-sand py-20">
        <div className="mx-auto max-w-6xl px-4">
          <SectionTitle eyebrow="B. Learn & Reuse" title="Small habits, big loop" />
          <div className="grid gap-6 md:grid-cols-3">
            <div className="card-soft overflow-hidden md:col-span-3 md:grid md:grid-cols-2">
              <img src={segregate} alt="Clean plastic containers" loading="lazy" className="h-64 w-full object-cover md:h-full" />
              <div className="p-6 md:p-8">
                <h3 className="text-2xl font-semibold text-forest">Plastic Recycling</h3>
                <p className="mt-2 text-muted-foreground">Plastic with food or oil on it can't be recycled. A quick rinse makes all the difference.</p>
                <div className="mt-5"><Flow steps={["Used sweet container", "Remove food", "Clean oil", "Dry", "Segregate", "Recycle"]} /></div>
              </div>
            </div>
            <div className="card-soft overflow-hidden">
              <img src={crafts} alt="Paper kite and planes" loading="lazy" className="h-52 w-full object-cover" />
              <div className="p-6"><h3 className="text-xl font-semibold text-forest">Paper Crafts</h3>
                <div className="mt-3 space-y-2"><Flow steps={["Craft Paper", "Kite"]} /><Flow steps={["Craft Paper", "Paper Plane"]} /></div></div>
            </div>
            <div className="card-soft overflow-hidden">
              <img src={products} alt="Dried flower incense" loading="lazy" className="h-52 w-full object-cover" />
              <div className="p-6"><h3 className="text-xl font-semibold text-forest">Dried Flowers</h3>
                <div className="mt-3"><Flow steps={["Dried Flowers", "Reuse", "Incense / Agarbatti"]} /></div></div>
            </div>
            <div className="card-soft p-6">
              <Droplets className="h-6 w-6 text-primary" />
              <h3 className="mt-2 text-xl font-semibold text-forest">Cleaning recyclables</h3>
              <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                <li>• Rinse with leftover dish water</li><li>• Flatten cartons & boxes</li><li>• Remove labels if easy</li><li>• Always dry before storing</li>
              </ul>
            </div>
          </div>

          <h3 className="mt-14 text-2xl font-semibold text-forest">How to segregate at home</h3>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((c) => <div key={c.t} className={`rounded-3xl p-5 ${c.tone}`}><p className="font-semibold">{c.t}</p><p className="mt-1 text-sm text-muted-foreground">{c.c}</p></div>)}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2">
            <div className="card-soft p-6"><p className="font-semibold text-forest">DIY reuse ideas</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground"><li>Coconut shell → planter or bird feeder</li><li>Glass jar → kitchen storage</li><li>Old books → donate to EcoLoop for reuse</li><li>Cardboard → kids' organiser</li></ul></div>
            <div className="card-soft p-6"><Lightbulb className="h-5 w-5 text-earth" /><p className="mt-1 font-semibold text-forest">Simple tips</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground"><li>Carry a cloth bag & bottle</li><li>Keep two bins in your kitchen</li><li>Say no to single-use cutlery</li><li>Compost peels in a pot</li></ul></div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-20"><RiderSection /></section>
    </>
  );
}
