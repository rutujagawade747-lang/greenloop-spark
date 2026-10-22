import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { AREAS, useStore, type Role } from "@/lib/store";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Login or Register — EcoLoop" },
      { name: "description", content: "Join EcoLoop to donate waste, join cleanups and earn EcoCoins." },
      { property: "og:title", content: "Login or Register — EcoLoop" },
      { property: "og:description", content: "Create your EcoLoop account." },
    ],
  }),
  component: Auth,
});

const demo: Record<Role, { name: string; email: string }> = {
  user: { name: "Ananya Patil", email: "ananya@ecoloop.in" },
  rider: { name: "Suresh Gawde", email: "suresh@ecoloop.in" },
  manufacturer: { name: "ShellCraft Studio", email: "shellcraft@ecoloop.in" },
  admin: { name: "EcoLoop Admin", email: "admin@ecoloop.in" },
};

function Auth() {
  const [mode, setMode] = useState<"login" | "register">("register");
  const [role, setRole] = useState<Role>("user");
  const { login } = useStore();
  const nav = useNavigate();

  const go = (u: Parameters<typeof login>[0]) => { login(u); nav({ to: "/dashboard" }); };
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.currentTarget)) as Record<"name"|"email"|"phone"|"city"|"area"|"bio"|"title"|"location"|"date"|"time"|"description"|"needed"|"desc"|"material"|"price"|"qty", string>;
    const d = demo[role];
    go({
      name: f.name || d.name, email: f.email || d.email, phone: f.phone || "98200 12345",
      city: f.city || "Palghar", area: f.area || "Virar", role, areas: [f.area || "Virar"], bio: f.bio,
    });
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 py-16 md:grid-cols-[1fr_1.2fr]">
      <div>
        <h1 className="text-4xl font-semibold text-forest">Welcome to EcoLoop 🌱</h1>
        <p className="mt-3 text-muted-foreground">One account to donate waste, join drives, sell upcycled goods or manage the platform.</p>
        <div className="mt-6 flex gap-3 rounded-2xl bg-secondary p-4 text-sm">
          <ShieldCheck className="h-5 w-5 shrink-0 text-primary" />
          <p>We never track your live location. The area you select is used only to plan collection points and suggest nearby drives.</p>
        </div>
        <div className="mt-8">
          <p className="text-sm font-semibold">Quick demo login</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {(Object.keys(demo) as Role[]).map((r) => (
              <button key={r} onClick={() => go({ ...demo[r], phone: "98200 12345", city: "Palghar", area: "Virar", role: r, areas: ["Virar", "Nalasopara"] })} className="btn btn-outline capitalize">{r}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="card-soft p-6 md:p-8">
        <div className="mb-6 flex rounded-full bg-muted p-1">
          {(["register", "login"] as const).map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`flex-1 rounded-full py-2 text-sm font-semibold capitalize ${mode === m ? "bg-card shadow" : "text-muted-foreground"}`}>{m}</button>
          ))}
        </div>
        <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
          <label className="sm:col-span-2 text-sm font-semibold">I am joining as
            <select value={role} onChange={(e) => setRole(e.target.value as Role)} className="field mt-1">
              <option value="user">Citizen / Volunteer</option><option value="rider">Rider</option>
              <option value="manufacturer">Manufacturer</option><option value="admin">Admin</option>
            </select>
          </label>
          {mode === "register" && <input name="name" placeholder="Full name" required className="field sm:col-span-2" />}
          <input name="email" type="email" placeholder="Email" required className="field" />
          <input name="password" type="password" placeholder="Password" required className="field" />
          {mode === "register" && (<>
            <input name="phone" placeholder="Phone number" required className="field" />
            <input name="city" placeholder="City" required className="field" />
            <select name="area" className="field sm:col-span-2">{AREAS.map((a) => <option key={a}>{a}</option>)}</select>
            <textarea name="bio" placeholder="About you (optional)" rows={2} className="field sm:col-span-2" />
          </>)}
          <button className="btn btn-primary sm:col-span-2">{mode === "register" ? "Create account" : "Log in"}</button>
        </form>
      </div>
    </div>
  );
}
