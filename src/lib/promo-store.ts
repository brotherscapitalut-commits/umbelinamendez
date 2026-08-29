// Runtime store for promotions & Pix key — persisted no localStorage.
// Permite editar via /admin/promocoes sem alterar código.
import { PROMOS as DEFAULT_PROMOS, type Promo } from "./promos";
import { supabase } from "./supabase";

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

// ---- Integração Nuvem (Supabase) ----
export async function syncFromCloud() {
  if (!supabase || typeof window === "undefined") return;
  try {
    const { data, error } = await supabase.from("app_settings").select("*");
    if (error || !data) return;
    
    let updated = false;
    for (const row of data) {
      if (row.key === LS_PROMOS || row.key === LS_PIX) {
        const local = window.localStorage.getItem(row.key);
        const cloudVal = typeof row.value === 'string' ? row.value : JSON.stringify(row.value);
        if (local !== cloudVal) {
          window.localStorage.setItem(row.key, cloudVal);
          updated = true;
        }
      }
    }
    if (updated) {
      window.dispatchEvent(new Event("promos:updated"));
    }
  } catch (err) {
    console.error("Erro ao sincronizar com a nuvem", err);
  }
}

async function pushToCloud(key: string, value: any) {
  if (!supabase) return;
  try {
    await supabase.from("app_settings").upsert({ key, value });
  } catch (err) {
    console.error("Erro ao salvar na nuvem", err);
  }
}
// -------------------------------------

export function loadPromos(): Promo[] {
  if (typeof window === "undefined") return DEFAULT_PROMOS;
  return safeParse<Promo[]>(window.localStorage.getItem(LS_PROMOS), DEFAULT_PROMOS);
}

export function savePromos(list: Promo[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_PROMOS, JSON.stringify(list));
  window.dispatchEvent(new Event("promos:updated"));
  pushToCloud(LS_PROMOS, list);
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
  pushToCloud(LS_PIX, cfg);
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
