import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Coins, Package, Recycle, Users, MapPin, Brush, Factory, Sparkles, Truck, Bell, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";
import { useStore, WASTE, AREAS } from "@/lib/store";
import { productImg } from "@/lib/images";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — EcoLoop" },
      { name: "description", content: "Your EcoLoop contributions, EcoCoins, drives and role tools." },
      { property: "og:title", content: "Dashboard — EcoLoop" },
      { property: "og:description", content: "Your EcoLoop dashboard." },
    ],
  }),
  component: Dashboard,
});

const Stat = ({ icon: I, label, value }: { icon: typeof Coins; label: string; value: string | number }) => (
  <div className="card-soft p-5">
    <I className="h-5 w-5 text-primary" />
    <p className="mt-3 text-2xl font-bold text-forest">{value}</p>
    <p className="text-sm text-muted-foreground">{label}</p>
  </div>
);
const Panel = ({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) => (
  <section className="card-soft p-6">
    <div className="mb-4 flex items-center justify-between gap-2"><h2 className="text-xl font-semibold text-forest">{title}</h2>{action}</div>
    {children}
  </section>
);

function Dashboard() {
  const { user } = useStore();
  if (!user) return (
    <div className="mx-auto max-w-md px-4 py-24 text-center">
      <h1 className="text-3xl font-semibold text-forest">Please log in</h1>
      <p className="mt-2 text-muted-foreground">Your dashboard appears after you log in.</p>
      <Link to="/auth" className="btn btn-primary mt-6">Login / Register</Link>
    </div>
  );
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <p className="chip capitalize">{user.role} dashboard</p>
      <h1 className="mt-3 text-4xl font-semibold text-forest">Welcome to EcoLoop 🌱</h1>
      <p className="text-muted-foreground">Hi {user.name} · {user.area}, {user.city}</p>
      <div className="mt-8 space-y-6">
        {user.role === "admin" ? <Admin /> : user.role === "manufacturer" ? <Manufacturer /> : <><UserDash />{useStore().rider.status === "Active" && <Rider />}</>}
      </div>
    </div>
  );
}

function UserDash() {
  const { contributions, drives, coins, balance, points, user, notes, rider } = useStore();
  const kg = (t: string) => contributions.filter((c) => c.type === t).reduce((a, c) => a + c.qty, 0);
  const total = contributions.reduce((a, c) => a + c.qty, 0);
  const joined = drives.filter((d) => d.joined).length + 2;
  const mine = drives.filter((d) => d.organizerEmail === user?.email);
  const myNotes = notes.filter((n) => mine.some((d) => d.organizer === n.to));
  return (<>
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Stat icon={Recycle} label="Total waste contributed" value={`${total} kg`} />
      <Stat icon={Coins} label="EcoCoins balance" value={balance} />
      <Stat icon={Brush} label="Drives joined" value={joined} />
      <Stat icon={Users} label="Drives organized" value={mine.length} />
    </div>
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="My Eco Contribution">
        <ul className="space-y-2 text-sm">
          <li>Plastic contributed: <b>{kg("Plastic")} kg</b></li>
          <li>Paper contributed: <b>{kg("Paper")} kg</b></li>
          <li>Other materials: <b>{total - kg("Plastic") - kg("Paper")} kg</b></li>
          <li>Cleanup drives joined: <b>{joined}</b></li>
          <li>EcoCoins: <b>{balance} available</b></li>
          <li>Rider status: <b>{rider.status === "Active" ? "Active rider" : "Not a rider"}</b></li>
        </ul>
      </Panel>
      <Panel title="Recent contributions" action={<Link to="/recycle" className="btn btn-outline">+ Donate</Link>}>
        <ul className="divide-y text-sm">{contributions.slice(0, 5).map((c) => (
          <li key={c.id} className="flex justify-between py-2"><span>{c.type} · {c.qty} kg<br /><span className="text-muted-foreground">{c.point} · {c.date}</span></span><span className="chip h-fit">{c.status}</span></li>
        ))}</ul>
      </Panel>
      <Panel title="EcoCoins">
        <p className="text-3xl font-bold text-forest">{balance} <span className="text-base font-normal text-muted-foreground">balance</span></p>
        <p className="mt-4 text-sm font-semibold">History</p>
        <ul className="mt-1 divide-y text-sm">{coins.slice(0, 5).map((c) => (
          <li key={c.id} className="flex justify-between py-1.5"><span>{c.label}</span><b className={c.amount < 0 ? "text-destructive" : "text-primary"}>{c.amount > 0 ? "+" : ""}{c.amount}</b></li>
        ))}</ul>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 text-sm">
          <div className="rounded-2xl bg-secondary p-3"><b>Ways to earn</b><p className="text-muted-foreground">Regular contributions over the contribution period · Joining drives · Organizing drives (higher reward)</p></div>
          <div className="rounded-2xl bg-sand p-3"><b>Eligible uses</b><p className="text-muted-foreground">Discounts on EcoCoin-eligible marketplace products</p></div>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Reward rules are set by the EcoLoop admin.</p>
      </Panel>
      <Panel title="Nearby collection points">
        <ul className="space-y-2 text-sm">{[...points].sort((a, b) => a.km - b.km).slice(0, 4).map((p) => (
          <li key={p.id} className="flex items-center justify-between rounded-xl bg-muted p-3"><span><MapPin className="mr-1 inline h-4 w-4 text-primary" />{p.name}</span><span className="text-muted-foreground">~{p.km} km · {p.status}</span></li>
        ))}</ul>
      </Panel>
      {mine.length > 0 && <Panel title="Drives I'm organizing">
        <ul className="space-y-2 text-sm">{mine.map((d) => <li key={d.id} className="flex justify-between rounded-xl bg-muted p-3"><span>{d.title}</span><b>{d.participants} joined / {d.needed}</b></li>)}</ul>
        {myNotes.map((n) => <p key={n.id} className="mt-2 text-sm"><Bell className="mr-1 inline h-4 w-4 text-earth" />{n.text}</p>)}
      </Panel>}
      <Panel title="Suggested activities">
        <div className="flex flex-wrap gap-2">
          <Link to="/cleanups" className="btn btn-outline">Join a drive near {user?.area}</Link>
          <Link to="/recycle" className="btn btn-outline">Learn dried-flower reuse</Link>
          <Link to="/marketplace" className="btn btn-outline">Spend EcoCoins</Link>
          {rider.status !== "Active" && <Link to="/" className="btn btn-outline">Become a Rider</Link>}
        </div>
      </Panel>
    </div>
  </>);
}

function Rider() {
  const { riderTasks, set } = useStore();
  const next = { Assigned: "Picked up", "Picked up": "Delivered", Delivered: "Delivered" } as const;
  return (
    <Panel title="Rider Dashboard">
      <p className="mb-3 text-sm text-muted-foreground">Collection Point → Sorting Centre</p>
      <div className="grid gap-3 md:grid-cols-2">{riderTasks.map((t) => (
        <div key={t.id} className="rounded-2xl bg-muted p-4 text-sm">
          <p className="font-semibold"><Truck className="mr-1 inline h-4 w-4 text-primary" />{t.from} → {t.to}</p>
          <p className="text-muted-foreground">{t.load}</p>
          <div className="mt-3 flex items-center justify-between"><span className="chip">{t.status}</span>
            {t.status !== "Delivered" && <button className="btn btn-primary" onClick={() => set((s) => ({ ...s, riderTasks: s.riderTasks.map((x) => x.id === t.id ? { ...x, status: next[x.status] } : x) }))}>Mark {next[t.status]}</button>}</div>
        </div>
      ))}</div>
    </Panel>
  );
}

function Manufacturer() {
  const { materials, requests, products, user, set, uid } = useStore();
  const [img, setImg] = useState("");
  const mine = products.filter((p) => p.seller === user?.name);
  const request = (name: string) => {
    const kg = Number(prompt(`How many kg of ${name}?`, "5"));
    if (!kg) return;
    set((s) => ({ ...s, requests: [{ id: uid(), material: name, kg, by: user!.name, status: "Requested" }, ...s.requests] }));
    toast.success("Request sent to EcoLoop admin");
  };
  const list = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    set((s) => ({ ...s, products: [{ id: uid(), name: f.name, desc: f.desc, material: f.material, price: Number(f.price), qty: Number(f.qty), img: img || "bowl", coin: true, status: "Pending", seller: user!.name }, ...s.products] }));
    toast.success("Product submitted for admin approval");
    e.currentTarget.reset(); setImg("");
  };
  return (<>
    <Panel title="Available raw materials">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{materials.map((m) => (
        <div key={m.id} className="flex items-center justify-between rounded-2xl bg-muted p-4">
          <span><b>{m.name}</b><br /><span className="text-sm text-muted-foreground">{m.kg} kg available</span></span>
          <button className="btn btn-primary" onClick={() => request(m.name)}>Request</button>
        </div>
      ))}</div>
      <p className="mt-5 text-sm font-semibold">My requests</p>
      <ul className="text-sm">{requests.filter((r) => r.by === user?.name).map((r) => <li key={r.id} className="flex justify-between border-b py-2">{r.material} · {r.kg} kg <span className="chip">{r.status}</span></li>)}</ul>
    </Panel>
    <div className="grid gap-6 lg:grid-cols-2">
      <Panel title="List a recycled product">
        <form onSubmit={list} className="grid gap-3">
          <input name="name" required placeholder="Product name" className="field" />
          <input type="file" accept="image/*" className="field" onChange={(e) => { const f = e.target.files?.[0]; if (f) { const r = new FileReader(); r.onload = () => setImg(String(r.result)); r.readAsDataURL(f); } }} />
          <textarea name="desc" required placeholder="Description" rows={2} className="field" />
          <input name="material" required placeholder="Material used" className="field" />
          <div className="grid grid-cols-2 gap-3"><input name="price" type="number" required placeholder="Price ₹" className="field" /><input name="qty" type="number" required placeholder="Quantity" className="field" /></div>
          <button className="btn btn-primary">Submit for approval</button>
        </form>
      </Panel>
      <Panel title="My listings">
        <ul className="space-y-2">{mine.map((p) => (
          <li key={p.id} className="flex items-center gap-3 rounded-xl bg-muted p-2"><img src={productImg(p.img)} alt="" className="h-12 w-12 rounded-lg object-cover" /><span className="flex-1 text-sm">{p.name}<br /><span className="text-muted-foreground">₹{p.price} · {p.qty} pcs</span></span><span className="chip">{p.status}</span></li>
        ))}</ul>
      </Panel>
    </div>
  </>);
}

const tabs = ["Overview", "AI Recommendations", "Contributions", "Collection Points", "Raw Materials", "Products", "Cleanup Drives", "Riders", "EcoCoins", "Users"] as const;

function Admin() {
  const s = useStore();
  const [tab, setTab] = useState<(typeof tabs)[number]>("Overview");
  const total = s.contributions.reduce((a, c) => a + c.qty, 0);
  const upd = s.set;
  return (<>
    <div className="flex flex-wrap gap-2">{tabs.map((t) => <button key={t} onClick={() => setTab(t)} className={`chip cursor-pointer px-3 py-1.5 ${tab === t ? "bg-primary text-primary-foreground" : ""}`}>{t}</button>)}</div>

    {tab === "Overview" && <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <Stat icon={Users} label="Total Users" value={s.users} />
      <Stat icon={Recycle} label="Waste Contributions" value={s.contributions.length} />
      <Stat icon={Package} label="Total Waste Collected" value={`${total + 1240} kg`} />
      <Stat icon={Brush} label="Active Cleanup Drives" value={s.drives.filter((d) => d.status === "Active").length} />
      <Stat icon={Factory} label="Manufacturers" value={4} />
      <Stat icon={Package} label="Raw Materials (kg)" value={s.materials.reduce((a, m) => a + m.kg, 0)} />
      <Stat icon={Sparkles} label="AI Recommendations" value={s.recs.filter((r) => r.status === "Pending").length} />
      <Stat icon={Truck} label="Active Riders" value={6} />
    </div>}

    {tab === "AI Recommendations" && <Panel title="AI-Powered Collection Point Recommendations">
      <p className="mb-4 text-sm text-muted-foreground">Based only on information users voluntarily provide: selected area, contributors, contributions, requests and existing points. The AI recommends — the admin decides.</p>
      <div className="grid gap-4 md:grid-cols-3">{s.recs.map((r) => (
        <div key={r.id} className="rounded-2xl border p-5">
          <p className="text-lg font-semibold text-forest">Area: {r.area}</p>
          <ul className="mt-2 space-y-1 text-sm">
            <li>Registered users: <b>{r.users}</b></li><li>Regular contributors: <b>{r.contributors}</b></li>
            <li>Waste contributions: <b>{r.level}</b></li><li>Point requests: <b>{r.requests}</b></li><li>Nearby point: <b>{r.nearby}</b></li>
          </ul>
          <div className="mt-3 rounded-xl bg-secondary p-3 text-sm"><p className="flex items-center gap-1 font-semibold"><Sparkles className="h-4 w-4 text-primary" />AI Recommendation</p>
            <p className="mt-1 text-muted-foreground">{r.level === "High" ? "This area may require a new EcoLoop collection point because of the high number of contributors and waste contributions." : r.level === "Medium" ? "Consider adding capacity — the nearby point is often full." : "Demand is low for now. Keep monitoring."}</p></div>
          {r.status === "Pending" ? <div className="mt-3 flex flex-wrap gap-2">
            <button className="btn btn-outline" onClick={() => toast(`Location: ${r.area} (sample map pin)`)}>View Location</button>
            <button className="btn btn-primary" onClick={() => { upd((x) => ({ ...x, recs: x.recs.map((y) => y.id === r.id ? { ...y, status: "Approved" } : y), points: [...x.points, { id: x.uid(), name: `${r.area} New Point`, area: r.area.split(" ")[0], types: ["Plastic", "Paper"], status: "Open", km: 2 }] })); toast.success("Approved — collection point added"); }}>Approve</button>
            <button className="btn btn-outline" onClick={() => upd((x) => ({ ...x, recs: x.recs.map((y) => y.id === r.id ? { ...y, status: "Rejected" } : y) }))}>Reject</button>
          </div> : <span className="chip mt-3">{r.status}</span>}
        </div>
      ))}</div>
    </Panel>}

    {tab === "Contributions" && <Panel title="Waste contributions">
      <table className="w-full text-sm"><thead className="text-left text-muted-foreground"><tr><th>Type</th><th>Qty</th><th>Point</th><th>Date</th><th>Status</th></tr></thead>
        <tbody>{s.contributions.map((c) => <tr key={c.id} className="border-t"><td className="py-2">{c.type}</td><td>{c.qty} kg</td><td>{c.point}</td><td>{c.date}</td>
          <td>{c.status === "Recorded" ? <button className="chip cursor-pointer" onClick={() => upd((x) => ({ ...x, contributions: x.contributions.map((y) => y.id === c.id ? { ...y, status: "Collected" } : y) }))}>Mark collected</button> : c.status}</td></tr>)}</tbody></table>
      <p className="mt-4 text-sm font-semibold">Waste categories</p>
      <div className="mt-2 flex flex-wrap gap-1">{WASTE.map((w) => <span key={w} className="chip">{w}</span>)}</div>
    </Panel>}

    {tab === "Collection Points" && <Panel title="Collection points" action={<button className="btn btn-primary" onClick={() => { const n = prompt("Point name?"); if (n) upd((x) => ({ ...x, points: [...x.points, { id: x.uid(), name: n, area: AREAS[0], types: ["Plastic", "Paper"], status: "Open", km: 3 }] })); }}><Plus className="h-4 w-4" />Add</button>}>
      <ul className="divide-y text-sm">{s.points.map((p) => <li key={p.id} className="flex items-center justify-between gap-2 py-2"><span><b>{p.name}</b> · {p.area}<br /><span className="text-muted-foreground">{p.types.join(", ")}</span></span>
        <span className="flex gap-2"><select value={p.status} onChange={(e) => upd((x) => ({ ...x, points: x.points.map((y) => y.id === p.id ? { ...y, status: e.target.value as typeof p.status } : y) }))} className="field w-auto py-1"><option>Open</option><option>Full</option><option>Maintenance</option></select>
          <button aria-label="Remove" onClick={() => upd((x) => ({ ...x, points: x.points.filter((y) => y.id !== p.id) }))}><Trash2 className="h-4 w-4 text-destructive" /></button></span></li>)}</ul>
    </Panel>}

    {tab === "Raw Materials" && <Panel title="Sorted raw materials & requests">
      <div className="grid gap-3 sm:grid-cols-3">{s.materials.map((m) => <div key={m.id} className="rounded-xl bg-muted p-3 text-sm"><b>{m.name}</b>
        <input type="number" value={m.kg} onChange={(e) => upd((x) => ({ ...x, materials: x.materials.map((y) => y.id === m.id ? { ...y, kg: Number(e.target.value) } : y) }))} className="field mt-1" /></div>)}</div>
      <p className="mt-5 font-semibold">Manufacturer requests</p>
      <ul className="text-sm">{s.requests.map((r) => <li key={r.id} className="flex items-center justify-between border-b py-2"><span>{r.by} — {r.material} · {r.kg} kg</span>
        {r.status === "Requested" ? <button className="btn btn-primary" onClick={() => upd((x) => ({ ...x, requests: x.requests.map((y) => y.id === r.id ? { ...y, status: "Transferred" } : y), materials: x.materials.map((m) => m.name === r.material ? { ...m, kg: Math.max(0, m.kg - r.kg) } : m) }))}>Approve transfer</button> : <span className="chip">{r.status}</span>}</li>)}</ul>
    </Panel>}

    {tab === "Products" && <Panel title="Product listings">
      <ul className="space-y-2">{s.products.map((p) => <li key={p.id} className="flex items-center gap-3 rounded-xl bg-muted p-2 text-sm"><img src={productImg(p.img)} alt="" className="h-12 w-12 rounded-lg object-cover" /><span className="flex-1">{p.name} · {p.seller}</span>
        {p.status === "Pending" ? <><button className="btn btn-primary" onClick={() => upd((x) => ({ ...x, products: x.products.map((y) => y.id === p.id ? { ...y, status: "Approved", qty: y.qty || 10 } : y) }))}>Approve</button><button className="btn btn-outline" onClick={() => upd((x) => ({ ...x, products: x.products.map((y) => y.id === p.id ? { ...y, status: "Rejected" } : y) }))}>Reject</button></> : <span className="chip">{p.status}</span>}</li>)}</ul>
    </Panel>}

    {tab === "Cleanup Drives" && <Panel title="Cleanup drives">
      <ul className="divide-y text-sm">{s.drives.map((d) => <li key={d.id} className="flex items-center justify-between py-2"><span><b>{d.title}</b> · {d.organizer}<br /><span className="text-muted-foreground">{d.date} · {d.participants} joined</span></span>
        <button className="btn btn-outline" onClick={() => upd((x) => ({ ...x, drives: x.drives.filter((y) => y.id !== d.id) }))}>Remove</button></li>)}</ul>
    </Panel>}

    {tab === "Riders" && <Panel title="Riders & transport tasks">
      <ul className="divide-y text-sm">{["Suresh Gawde · Virar · Weekends", "Kavita More · Nalasopara · Mornings", "Imran Shaikh · Vasai · Flexible"].map((r) => <li key={r} className="py-2">{r}</li>)}</ul>
      <p className="mt-4 font-semibold">Tasks</p>
      <ul className="text-sm">{s.riderTasks.map((t) => <li key={t.id} className="flex justify-between border-b py-2">{t.from} → Sorting Centre <span className="chip">{t.status}</span></li>)}</ul>
    </Panel>}

    {tab === "EcoCoins" && <Panel title="EcoCoin reward rules (admin only)">
      <div className="grid gap-3 sm:grid-cols-3 text-sm">{[["Regular monthly contribution", 40], ["Joining a cleanup drive", 25], ["Organizing a cleanup drive", 60]].map(([l, v]) => (
        <label key={l} className="rounded-xl bg-muted p-3">{l}<input type="number" defaultValue={v} className="field mt-1" /></label>))}</div>
      <button className="btn btn-primary mt-4" onClick={() => toast.success("Reward rules saved")}>Save rules</button>
    </Panel>}

    {tab === "Users" && <Panel title="Users">
      <ul className="divide-y text-sm">{[["Ananya Patil", "Virar", "Citizen"], ["Priya Nair", "Virar", "Organizer"], ["Suresh Gawde", "Virar", "Rider"], ["ShellCraft Studio", "Vasai", "Manufacturer"], ["Meera Joshi", "Dadar", "Citizen"]].map(([n, a, r]) => <li key={n} className="flex justify-between py-2"><span>{n} · {a}</span><span className="chip">{r}</span></li>)}</ul>
    </Panel>}
  </>);
}
