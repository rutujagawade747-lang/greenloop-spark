import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Role = "user" | "rider" | "manufacturer" | "admin";
export type User = { name: string; email: string; phone: string; city: string; area: string; role: Role; areas: string[]; bio?: string | undefined };
export type Contribution = { id: string; type: string; qty: number; point: string; date: string; notes?: string | undefined; status: "Recorded" | "Collected" };
export type Drive = { id: string; title: string; location: string; area: string; date: string; time: string; organizer: string; organizerEmail?: string | undefined; participants: number; needed: number; description: string; joined?: boolean | undefined; status: "Active" | "Pending" };
export type Coin = { id: string; label: string; amount: number; date: string };
export type Point = { id: string; name: string; area: string; types: string[]; status: "Open" | "Full" | "Maintenance"; km: number };
export type Material = { id: string; name: string; kg: number };
export type Product = { id: string; name: string; desc: string; material: string; price: number; qty: number; img: string; coin: boolean; status: "Approved" | "Pending" | "Rejected"; seller: string };
export type MatRequest = { id: string; material: string; kg: number; by: string; status: "Requested" | "Approved" | "Transferred" };
export type Rec = { id: string; area: string; users: number; contributors: number; level: "High" | "Medium" | "Low"; requests: number; nearby: string; status: "Pending" | "Approved" | "Rejected" };
export type RiderTask = { id: string; from: string; to: string; load: string; status: "Assigned" | "Picked up" | "Delivered" };
export type Note = { id: string; to: string; text: string };

export const AREAS = ["Virar", "Nalasopara", "Vasai", "Borivali", "Andheri", "Thane", "Dadar"];
export const WASTE = ["Plastic", "Paper", "Cardboard", "Coconut shells", "Dried flowers", "Books", "Other accepted materials"];

const today = () => new Date().toISOString().slice(0, 10);
const uid = () => Math.random().toString(36).slice(2, 9);

type State = {
  user: User | null; users: number; contributions: Contribution[]; drives: Drive[]; coins: Coin[]; points: Point[];
  materials: Material[]; products: Product[]; requests: MatRequest[]; recs: Rec[]; riderTasks: RiderTask[]; notes: Note[];
  rider: { status: "None" | "Pending" | "Active"; availability?: string | undefined; area?: string | undefined };
  cart: string[];
};

const seed: State = {
  user: null, users: 128,
  contributions: [
    { id: "c1", type: "Plastic", qty: 3, point: "Virar West Hub", date: "2026-09-28", status: "Collected" },
    { id: "c2", type: "Paper", qty: 3, point: "Virar West Hub", date: "2026-10-04", status: "Collected" },
    { id: "c3", type: "Plastic", qty: 2, point: "Nalasopara Station Bin", date: "2026-10-10", status: "Recorded" },
  ],
  drives: [
    { id: "d1", title: "Arnala Beach Cleanup", location: "Arnala Beach, Virar", area: "Virar", date: "2026-10-25", time: "07:00", organizer: "Priya Nair", participants: 34, needed: 50, description: "Morning beach cleanup focusing on plastic and fishing nets washed ashore.", status: "Active" },
    { id: "d2", title: "Lake Garden Revival", location: "Tulinj Lake, Nalasopara", area: "Nalasopara", date: "2026-10-27", time: "08:00", organizer: "Green Hands Club", participants: 18, needed: 30, description: "Clearing litter around the lake path and planting saplings.", status: "Active" },
    { id: "d3", title: "Fort Trail Sweep", location: "Vasai Fort", area: "Vasai", date: "2026-11-02", time: "07:30", organizer: "Rohan D'Souza", participants: 22, needed: 40, description: "Cleaning the heritage trail and segregating collected waste on site.", status: "Active" },
    { id: "d4", title: "Market Lane Cleanup", location: "Dadar Flower Market", area: "Dadar", date: "2026-11-08", time: "06:30", organizer: "Meera Joshi", participants: 12, needed: 25, description: "Collecting dried flower waste for reuse into incense.", status: "Active" },
  ],
  coins: [
    { id: "k1", label: "Regular contributions (September)", amount: 40, date: "2026-09-30" },
    { id: "k2", label: "Joined: Beach Cleanup, Juhu", amount: 25, date: "2026-09-14" },
    { id: "k3", label: "Used on Coconut Shell Bowl", amount: -20, date: "2026-10-02" },
  ],
  points: [
    { id: "p1", name: "Virar West Hub", area: "Virar", types: ["Plastic", "Paper", "Cardboard"], status: "Open", km: 1.2 },
    { id: "p2", name: "Nalasopara Station Bin", area: "Nalasopara", types: ["Plastic", "Paper", "Books"], status: "Open", km: 4.5 },
    { id: "p3", name: "Vasai Temple Flower Bin", area: "Vasai", types: ["Dried flowers", "Coconut shells"], status: "Full", km: 9.8 },
    { id: "p4", name: "Dadar Market Point", area: "Dadar", types: ["Dried flowers", "Coconut shells", "Cardboard"], status: "Open", km: 52 },
    { id: "p5", name: "Thane Lake Point", area: "Thane", types: ["Plastic", "Paper"], status: "Maintenance", km: 38 },
  ],
  materials: [
    { id: "m1", name: "Dried Flower Waste", kg: 10 }, { id: "m2", name: "Coconut Shell", kg: 25 },
    { id: "m3", name: "Plastic", kg: 50 }, { id: "m4", name: "Paper", kg: 30 }, { id: "m5", name: "Cardboard", kg: 18 },
  ],
  products: [
    { id: "pr1", name: "Coconut Shell Bowl Set", desc: "Hand-polished bowls from discarded coconut shells.", material: "Coconut shell", price: 349, qty: 20, img: "bowl", coin: true, status: "Approved", seller: "ShellCraft Studio" },
    { id: "pr2", name: "Temple Flower Incense", desc: "Agarbatti made from dried temple flowers.", material: "Dried flowers", price: 149, qty: 60, img: "incense", coin: true, status: "Approved", seller: "Phool Works" },
    { id: "pr3", name: "Recycled Paper Journal", desc: "A5 notebook with handmade recycled pages.", material: "Recycled paper", price: 199, qty: 40, img: "journal", coin: true, status: "Approved", seller: "PaperLeaf" },
    { id: "pr4", name: "Upcycled Plastic Planter", desc: "Sturdy planter moulded from cleaned plastic.", material: "Plastic", price: 299, qty: 15, img: "planter", coin: false, status: "Approved", seller: "ReForm Labs" },
    { id: "pr5", name: "Paper Festive Garland", desc: "Colourful decoration from craft paper offcuts.", material: "Craft paper", price: 129, qty: 35, img: "garland", coin: true, status: "Approved", seller: "PaperLeaf" },
    { id: "pr6", name: "Shell Candle Holder", desc: "Coconut-shell tealight holder for warm evenings.", material: "Coconut shell", price: 249, qty: 0, img: "candle", coin: false, status: "Pending", seller: "ShellCraft Studio" },
  ],
  requests: [{ id: "r1", material: "Coconut Shell", kg: 10, by: "ShellCraft Studio", status: "Requested" }],
  recs: [
    { id: "a1", area: "Virar East", users: 8, contributors: 7, level: "High", requests: 6, nearby: "None", status: "Pending" },
    { id: "a2", area: "Vasai Village", users: 5, contributors: 4, level: "Medium", requests: 3, nearby: "Vasai Temple Flower Bin (2.1 km, often full)", status: "Pending" },
    { id: "a3", area: "Borivali West", users: 3, contributors: 1, level: "Low", requests: 1, nearby: "None", status: "Pending" },
  ],
  riderTasks: [
    { id: "t1", from: "Virar West Hub", to: "EcoLoop Sorting Centre, Vasai", load: "Plastic & paper · ~40 kg", status: "Assigned" },
    { id: "t2", from: "Nalasopara Station Bin", to: "EcoLoop Sorting Centre, Vasai", load: "Mixed dry waste · ~25 kg", status: "Assigned" },
  ],
  notes: [], rider: { status: "None" }, cart: [],
};

type Ctx = State & {
  set: (fn: (s: State) => State) => void;
  login: (u: User) => void; logout: () => void;
  addContribution: (c: Omit<Contribution, "id" | "status">) => void;
  joinDrive: (id: string) => void;
  organizeDrive: (d: Omit<Drive, "id" | "participants" | "organizer" | "status">) => void;
  balance: number; uid: () => string; today: () => string;
};

const C = createContext<Ctx | null>(null);
const KEY = "ecoloop-v1";

export function StoreProvider({ children }: { children: ReactNode }) {
  const [s, setS] = useState<State>(seed);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    try { const raw = localStorage.getItem(KEY); if (raw) setS({ ...seed, ...JSON.parse(raw) }); } catch { /* ignore */ }
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(KEY, JSON.stringify(s)); }, [s, ready]);

  const set = (fn: (s: State) => State) => setS(fn);
  const value: Ctx = {
    ...s, set, uid, today,
    balance: s.coins.reduce((a, c) => a + c.amount, 0),
    login: (u) => setS((p) => ({ ...p, user: u, rider: u.role === "rider" ? { status: "Active", area: u.area } : p.rider })),
    logout: () => setS((p) => ({ ...p, user: null })),
    addContribution: (c) => setS((p) => ({ ...p, contributions: [{ ...c, id: uid(), status: "Recorded" }, ...p.contributions] })),
    joinDrive: (id) => setS((p) => {
      const d = p.drives.find((x) => x.id === id)!;
      return {
        ...p,
        drives: p.drives.map((x) => (x.id === id ? { ...x, joined: true, participants: x.participants + 1 } : x)),
        coins: [{ id: uid(), label: `Joined: ${d.title}`, amount: 25, date: today() }, ...p.coins],
        notes: [{ id: uid(), to: d.organizer, text: `${p.user?.name ?? "A volunteer"} joined "${d.title}"` }, ...p.notes],
      };
    }),
    organizeDrive: (d) => setS((p) => ({
      ...p,
      drives: [{ ...d, id: uid(), participants: 0, organizer: p.user?.name ?? "You", organizerEmail: p.user?.email, status: "Active" }, ...p.drives],
      coins: [{ id: uid(), label: `Organized: ${d.title}`, amount: 60, date: today() }, ...p.coins],
    })),
  };
  return <C.Provider value={value}>{children}</C.Provider>;
}

export function useStore() {
  const c = useContext(C);
  if (!c) throw new Error("StoreProvider missing");
  return c;
}
