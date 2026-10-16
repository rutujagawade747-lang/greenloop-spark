import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Coins, ShoppingBag, X } from "lucide-react";
import { toast } from "sonner";
import products from "@/assets/products.jpg";
import { useStore, type Product } from "@/lib/store";
import { productImg } from "@/lib/images";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Eco Marketplace — EcoLoop" },
      { name: "description", content: "Shop recycled and upcycled products made from waste contributed by the EcoLoop community." },
      { property: "og:title", content: "Eco Marketplace — EcoLoop" },
      { property: "og:description", content: "Recycled and upcycled products, EcoCoin eligible." },
    ],
  }),
  component: Market,
});

function Market() {
  const { products: list, user, balance, set, uid, today } = useStore();
  const [mat, setMat] = useState("All");
  const [buy, setBuy] = useState<Product | null>(null);
  const [useCoins, setUseCoins] = useState(false);
  const approved = list.filter((p) => p.status === "Approved");
  const mats = ["All", ...new Set(approved.map((p) => p.material))];
  const shown = approved.filter((p) => mat === "All" || p.material === mat);

  const coinOff = buy && useCoins ? Math.min(balance, Math.floor(buy.price * 0.2)) : 0;
  const confirm = () => {
    if (!buy) return;
    set((s) => ({
      ...s,
      products: s.products.map((p) => (p.id === buy.id ? { ...p, qty: p.qty - 1 } : p)),
      coins: coinOff ? [{ id: uid(), label: `Used on ${buy.name}`, amount: -coinOff, date: today() }, ...s.coins] : s.coins,
    }));
    toast.success(`Order placed for ${buy.name}! Pay on delivery.`);
    setBuy(null); setUseCoins(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="relative overflow-hidden rounded-3xl">
        <img src={products} alt="Upcycled products" className="h-64 w-full object-cover" />
        <div className="absolute inset-0 flex flex-col justify-center bg-gradient-to-r from-forest/85 to-transparent p-8">
          <h1 className="text-4xl font-semibold text-forest-foreground">Eco Marketplace</h1>
          <p className="mt-2 max-w-md text-forest-foreground/85">Every product here was made by local manufacturers from sorted EcoLoop materials.</p>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {mats.map((m) => <button key={m} onClick={() => setMat(m)} className={`chip cursor-pointer ${mat === m ? "bg-primary text-primary-foreground" : ""}`}>{m}</button>)}
        </div>
        {user && <span className="chip bg-sand text-accent-foreground"><Coins className="h-3.5 w-3.5" />{balance} EcoCoins available</span>}
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((p) => (
          <article key={p.id} className="card-soft flex flex-col overflow-hidden">
            <img src={productImg(p.img)} alt={p.name} loading="lazy" className="h-52 w-full object-cover" />
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-center justify-between"><span className="chip bg-muted text-muted-foreground">{p.material}</span>
                {p.coin && <span className="chip bg-sand text-accent-foreground"><Coins className="h-3 w-3" />EcoCoin eligible</span>}</div>
              <h3 className="mt-3 text-lg font-semibold text-forest">{p.name}</h3>
              <p className="text-sm text-muted-foreground">{p.desc}</p>
              <p className="mt-1 text-xs text-muted-foreground">by {p.seller} · {p.qty > 0 ? `${p.qty} in stock` : "Out of stock"}</p>
              <div className="mt-auto flex items-center justify-between pt-4">
                <span className="text-xl font-bold">₹{p.price}</span>
                <button disabled={p.qty <= 0} onClick={() => (user ? setBuy(p) : toast("Please log in to buy"))} className="btn btn-primary"><ShoppingBag className="h-4 w-4" />Buy</button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!user && <p className="mt-8 text-center text-sm text-muted-foreground"><Link to="/auth" className="font-semibold text-primary">Log in</Link> to buy and use EcoCoins.</p>}

      {buy && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-forest/50 p-4" onClick={() => setBuy(null)}>
          <div className="card-soft w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <button className="float-right" onClick={() => setBuy(null)} aria-label="Close"><X /></button>
            <h3 className="text-xl font-semibold text-forest">Confirm order</h3>
            <p className="mt-2">{buy.name} — ₹{buy.price}</p>
            {buy.coin && balance > 0 && (
              <label className="mt-4 flex items-center gap-2 rounded-xl bg-sand p-3 text-sm">
                <input type="checkbox" checked={useCoins} onChange={(e) => setUseCoins(e.target.checked)} />Use EcoCoins on this eligible product
              </label>
            )}
            <p className="mt-4 text-lg font-bold">Total: ₹{buy.price - coinOff} {coinOff > 0 && <span className="text-sm font-normal text-muted-foreground">({coinOff} EcoCoins applied)</span>}</p>
            <p className="text-xs text-muted-foreground">Prototype checkout · cash on delivery</p>
            <button onClick={confirm} className="btn btn-primary mt-4 w-full">Place order</button>
          </div>
        </div>
      )}
    </div>
  );
}
