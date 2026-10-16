import products from "@/assets/products.jpg";
import crafts from "@/assets/crafts.jpg";
import segregate from "@/assets/segregate.jpg";
import hero from "@/assets/hero.jpg";

const map: Record<string, string> = { bowl: products, incense: products, journal: products, candle: products, garland: crafts, planter: segregate, hero };
export const productImg = (k: string) => (k.startsWith("data:") ? k : map[k] ?? products);
