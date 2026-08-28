import { SITE } from "./site";

export type SeoConfig = {
  // SEO
  title: string;
  tagline: string;
  description: string;
  
  // Hero Section H1 / H2 / H3
  heroH1: string;
  heroH2: string;
  heroH3: string;
  heroCtaText: string;

  // GEO
  city: string;
  region: string;
  country: string;
  address: string;
  addressStreet: string;
  mapsQuery: string;
  
  // Social/OpenGraph
  instagramHandle: string;
};

export const DEFAULT_SEO: SeoConfig = {
  title: SITE.title,
  tagline: SITE.tagline,
  description: SITE.description,
  
  heroH1: "Bióloga Esteta &",
  heroH2: "Método Reviva™",
  heroH3: "Ciência, Constância e Cuidado na Asa Norte – Brasília",
  heroCtaText: "Agendar Avaliação",

  city: SITE.city,
  region: SITE.region,
  country: SITE.country,
  address: SITE.address,
  addressStreet: SITE.addressStreet,
  mapsQuery: SITE.mapsQuery,

  instagramHandle: SITE.instagramHandle,
};

const STORAGE_KEY = "umbelina_seo_config_v1";

export function loadSeo(): SeoConfig {
  if (typeof window === "undefined") return DEFAULT_SEO;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_SEO;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SEO, ...parsed }; // Merge to preserve new fields if any
  } catch {
    return DEFAULT_SEO;
  }
}

export function saveSeo(config: SeoConfig) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function resetSeo() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
