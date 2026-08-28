// Runtime store for promotions & Pix key — persisted no localStorage.
// Permite editar via /admin/promocoes sem alterar código.
import { PROMOS as DEFAULT_PROMOS, type Promo } from "./promos";

const LS_PROMOS = "umbelina.promos.v1";
const LS_PIX = "umbelina.pix.v1";

export const DEFAULT_PIX_KEY = "+5561981567985";

export type PixConfig = {
  key: string;
  merchantName: string;
  merchantCity: string;
};

export const DEFAULT_PIX: PixConfig = {
  key: DEFAULT_PIX_KEY,
  merchantName: "Umbelina Mendez",
  merchantCity: "Brasilia",
};

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadPromos(): Promo[] {
  if (typeof window === "undefined") return DEFAULT_PROMOS;
  return safeParse<Promo[]>(window.localStorage.getItem(LS_PROMOS), DEFAULT_PROMOS);
}

export function savePromos(list: Promo[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_PROMOS, JSON.stringify(list));
  window.dispatchEvent(new Event("promos:updated"));
}

export function resetPromos() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LS_PROMOS);
  window.dispatchEvent(new Event("promos:updated"));
}

export function loadPix(): PixConfig {
  if (typeof window === "undefined") return DEFAULT_PIX;
  return safeParse<PixConfig>(window.localStorage.getItem(LS_PIX), DEFAULT_PIX);
}

export function savePix(cfg: PixConfig) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_PIX, JSON.stringify(cfg));
  window.dispatchEvent(new Event("promos:updated"));
}

export function resetPix() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LS_PIX);
  window.dispatchEvent(new Event("promos:updated"));
}

export function activePromosRuntime(): Promo[] {
  const now = Date.now();
  return loadPromos().filter((p) => p.active && new Date(p.endsAt).getTime() > now);
}
