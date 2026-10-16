import { useState } from "react";
import { Truck } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { AREAS, useStore } from "@/lib/store";

export function RiderSection() {
  const { user, rider, set } = useStore();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    set((s) => ({ ...s, rider: { status: "Active", area: String(f.get("area")), availability: String(f.get("availability")) } }));
    toast.success("You're registered as an EcoLoop Rider! See your Rider panel in the Dashboard.");
    setOpen(false);
  };
  return (
    <div className="card-soft grid gap-6 overflow-hidden p-6 md:grid-cols-[1fr_1.1fr] md:p-10">
      <div>
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-sand text-earth"><Truck /></span>
        <h3 className="mt-4 text-2xl font-semibold text-forest">Become an EcoLoop Rider</h3>
        <p className="mt-2 text-muted-foreground">Riders carry collected waste from neighbourhood collection points to the EcoLoop sorting centre — the bridge that keeps the loop moving. Choose your own hours and area.</p>
        <p className="mt-4 text-sm font-semibold text-primary">Collection Point → Rider → Sorting Centre</p>
        {rider.status === "Active" ? (
          <button onClick={() => nav({ to: "/dashboard" })} className="btn btn-outline mt-6">You're a rider · Open dashboard</button>
        ) : (
          <button onClick={() => (user ? setOpen(true) : nav({ to: "/auth" }))} className="btn btn-primary mt-6">Become a Rider</button>
        )}
      </div>
      {open && (
        <form onSubmit={submit} className="grid gap-3 rounded-2xl bg-muted p-5">
          <input name="name" required defaultValue={user?.name} placeholder="Name" className="field" />
          <input name="phone" required defaultValue={user?.phone} placeholder="Phone" className="field" />
          <select name="area" defaultValue={user?.area} className="field">{AREAS.map((a) => <option key={a}>{a}</option>)}</select>
          <select name="availability" className="field"><option>Weekday mornings</option><option>Weekday evenings</option><option>Weekends</option><option>Flexible</option></select>
          <input name="vehicle" placeholder="Vehicle (e.g. two-wheeler, cycle cart)" className="field" />
          <button className="btn btn-primary">Register as Rider</button>
        </form>
      )}
    </div>
  );
}
