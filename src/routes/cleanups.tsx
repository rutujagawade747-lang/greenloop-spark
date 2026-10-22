import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { CalendarDays, Clock, MapPin, Users, ShieldAlert, Plus, X, Check } from "lucide-react";
import { toast } from "sonner";
import hero from "@/assets/hero.jpg";
import { AREAS, useStore, type Drive } from "@/lib/store";

export const Route = createFileRoute("/cleanups")({
  head: () => ({
    meta: [
      { title: "Cleanup Drives — EcoLoop" },
      { name: "description", content: "Find, join or organize community cleanup drives near the areas you choose." },
      { property: "og:title", content: "Cleanup Drives — EcoLoop" },
      { property: "og:description", content: "Join or organize community cleanup drives." },
    ],
  }),
  component: Cleanups,
});

export function Safety() {
  return (
    <div className="rounded-2xl bg-sand p-4 text-sm">
      <p className="flex items-center gap-2 font-semibold text-accent-foreground"><ShieldAlert className="h-4 w-4" />What to carry</p>
      <p className="mt-1 text-muted-foreground">Gloves · Water bottle · Basic cleaning equipment · Proper footwear</p>
      <p className="mt-2 font-semibold text-earth">Follow the organizer's instructions and avoid handling unsafe waste.</p>
    </div>
  );
}

function Cleanups() {
  const { drives, user, joinDrive, organizeDrive, set } = useStore();
  const [detail, setDetail] = useState<Drive | null>(null);
  const [org, setOrg] = useState(false);
  const [filter, setFilter] = useState(true);
  const areas = user?.areas ?? [];
  const list = drives.filter((d) => d.status === "Active" && (!filter || !user || areas.length === 0 || areas.includes(d.area)));

  const toggleArea = (a: string) => set((s) => s.user ? { ...s, user: { ...s.user, areas: s.user.areas.includes(a) ? s.user.areas.filter((x) => x !== a) : [...s.user.areas, a] } } : s);
  const join = (d: Drive) => { joinDrive(d.id); toast.success(`You joined ${d.title}. ${d.organizer} has been notified.`); setDetail(null); };
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<"name"|"email"|"phone"|"city"|"area"|"bio"|"title"|"location"|"date"|"time"|"description"|"needed"|"desc"|"material"|"price"|"qty", string>;
    organizeDrive({ title: f.title, location: f.location, area: f.area, date: f.date, time: f.time, description: f.description, needed: Number(f.needed) });
    toast.success("Your cleanup drive is live!");
    setOrg(false);
  };

  return (
    <div>
      <section className="relative h-72">
        <img src={hero} alt="Volunteers at a cleanup" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-forest/70" />
        <div className="relative mx-auto flex h-full max-w-6xl flex-col justify-end px-4 pb-10">
          <h1 className="text-4xl font-semibold text-forest-foreground md:text-5xl">Cleanup Drives</h1>
          <p className="mt-2 text-forest-foreground/85">Show up, pick up, and meet your neighbours.</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="card-soft flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
          {user ? (
            <div>
              <p className="text-sm"><b>My area:</b> {user.area}</p>
              <p className="mt-2 text-sm font-semibold">I am willing to participate in:</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {AREAS.map((a) => (
                  <button key={a} onClick={() => toggleArea(a)} className={`chip cursor-pointer ${areas.includes(a) ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>{a}</button>
                ))}
              </div>
              <label className="mt-3 flex items-center gap-2 text-sm"><input type="checkbox" checked={filter} onChange={(e) => setFilter(e.target.checked)} />Show only drives in my selected areas</label>
            </div>
          ) : <p className="text-sm text-muted-foreground"><Link to="/auth" className="font-semibold text-primary">Log in</Link> to choose your areas and join drives.</p>}
          {user && <button onClick={() => setOrg(true)} className="btn btn-primary shrink-0"><Plus className="h-4 w-4" />Organize a Cleanup Drive</button>}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {list.length === 0 && <p className="text-muted-foreground">No drives in your selected areas yet — try adding more areas.</p>}
          {list.map((d) => (
            <article key={d.id} className="card-soft flex flex-col p-6">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xl font-semibold text-forest">{d.title}</h3>
                <span className="chip">{d.area}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{d.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
                <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-primary" />{d.location}</span>
                <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4 text-primary" />{d.date}</span>
                <span className="flex items-center gap-1.5"><Clock className="h-4 w-4 text-primary" />{d.time}</span>
                <span className="flex items-center gap-1.5"><Users className="h-4 w-4 text-primary" />{d.participants} / {d.needed} joined</span>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">Organized by <b>{d.organizer}</b></p>
              <div className="mt-2 h-2 rounded-full bg-muted"><div className="h-2 rounded-full bg-leaf" style={{ width: `${Math.min(100, (d.participants / d.needed) * 100)}%` }} /></div>
              <div className="mt-5 flex gap-2">
                {d.joined ? <span className="btn btn-outline"><Check className="h-4 w-4 text-primary" />Joined</span>
                  : d.organizerEmail && d.organizerEmail === user?.email ? <span className="btn btn-outline">You're organizing</span>
                  : <button disabled={!user} onClick={() => join(d)} className="btn btn-primary">Join Cleanup</button>}
                <button onClick={() => setDetail(d)} className="btn btn-outline">View Details</button>
              </div>
            </article>
          ))}
        </div>
      </div>

      {(detail || org) && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-forest/50 p-4" onClick={() => { setDetail(null); setOrg(false); }}>
          <div className="card-soft max-h-[90vh] w-full max-w-lg overflow-y-auto p-6" onClick={(e) => e.stopPropagation()}>
            <button className="float-right" onClick={() => { setDetail(null); setOrg(false); }} aria-label="Close"><X /></button>
            {detail && (<>
              <h3 className="text-2xl font-semibold text-forest">{detail.title}</h3>
              <p className="mt-2 text-muted-foreground">{detail.description}</p>
              <ul className="my-4 space-y-1 text-sm">
                <li><b>Location:</b> {detail.location}</li><li><b>When:</b> {detail.date} at {detail.time}</li>
                <li><b>Organizer:</b> {detail.organizer}</li><li><b>Participants:</b> {detail.participants} of {detail.needed} needed</li>
              </ul>
              <Safety />
              {!detail.joined && user && <button onClick={() => join(detail)} className="btn btn-primary mt-4 w-full">Join Cleanup</button>}
            </>)}
            {org && (
              <form onSubmit={submit} className="grid gap-3">
                <h3 className="text-2xl font-semibold text-forest">Organize a Cleanup Drive</h3>
                <input name="title" required placeholder="Cleanup title" className="field" />
                <input name="location" required placeholder="Location (e.g. Rajodi Beach)" className="field" />
                <select name="area" defaultValue={user?.area} className="field">{AREAS.map((a) => <option key={a}>{a}</option>)}</select>
                <div className="grid grid-cols-2 gap-3"><input name="date" type="date" required className="field" /><input name="time" type="time" required className="field" /></div>
                <textarea name="description" required rows={3} placeholder="Description" className="field" />
                <input name="needed" type="number" min={1} defaultValue={20} placeholder="Approx. people required" className="field" />
                <Safety />
                <button className="btn btn-primary">Publish drive</button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
