import { Link, useNavigate } from "@tanstack/react-router";
import { Leaf, Menu, X, LayoutDashboard, LogOut } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";

const links = [
  { to: "/", label: "Home" },
  { to: "/recycle", label: "Recycle & Learn" },
  { to: "/cleanups", label: "Cleanup Drives" },
  { to: "/marketplace", label: "Marketplace" },
] as const;

export function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-primary text-primary-foreground"><Leaf className="h-5 w-5" /></span>
      <span className="font-display text-xl font-semibold text-forest">EcoLoop</span>
    </Link>
  );
}

export function Nav() {
  const { user, logout } = useStore();
  const [open, setOpen] = useState(false);
  const nav = useNavigate();
  const out = () => { logout(); nav({ to: "/" }); };
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Logo />
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} activeOptions={{ exact: l.to === "/" }}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
              activeProps={{ className: "bg-secondary text-secondary-foreground" }}>{l.label}</Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {user ? (<>
            <Link to="/dashboard" className="btn btn-primary"><LayoutDashboard className="h-4 w-4" />Dashboard</Link>
            <button onClick={out} className="btn btn-outline" aria-label="Log out"><LogOut className="h-4 w-4" /></button>
          </>) : <Link to="/auth" className="btn btn-primary">Login / Register</Link>}
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
      </div>
      {open && (
        <div className="space-y-1 border-t px-4 py-3 md:hidden">
          {links.map((l) => <Link key={l.to} to={l.to} onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 hover:bg-secondary">{l.label}</Link>)}
          {user ? (<>
            <Link to="/dashboard" onClick={() => setOpen(false)} className="block rounded-lg px-3 py-2 font-semibold text-primary">Dashboard</Link>
            <button onClick={() => { out(); setOpen(false); }} className="block px-3 py-2 text-muted-foreground">Log out</button>
          </>) : <Link to="/auth" onClick={() => setOpen(false)} className="btn btn-primary mt-2 w-full">Login / Register</Link>}
        </div>
      )}
    </header>
  );
}

export function Footer() {
  return (
    <footer className="mt-24 bg-forest text-forest-foreground">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">EcoLoop</p>
          <p className="mt-2 text-sm opacity-80">People, waste and ideas — looped back into a cleaner future.</p>
        </div>
        <div className="text-sm opacity-80">
          <p className="font-semibold opacity-100">Explore</p>
          {links.map((l) => <Link key={l.to} to={l.to} className="mt-2 block hover:underline">{l.label}</Link>)}
        </div>
        <div className="text-sm opacity-80">
          <p className="font-semibold opacity-100">Our promise</p>
          <p className="mt-2">We never track your live location. EcoLoop only uses the area you choose to share.</p>
          <p className="mt-4 text-xs">B.Tech prototype · sample data</p>
        </div>
      </div>
    </footer>
  );
}

export function SectionTitle({ eyebrow, title, text }: { eyebrow?: string; title: string; text?: string }) {
  return (
    <div className="mx-auto mb-10 max-w-2xl text-center">
      {eyebrow && <p className="text-xs font-bold uppercase tracking-[0.2em] text-earth">{eyebrow}</p>}
      <h2 className="mt-2 text-3xl font-semibold text-forest md:text-4xl">{title}</h2>
      {text && <p className="mt-3 text-muted-foreground">{text}</p>}
    </div>
  );
}
