import { supabase } from "./supabase";

const LS_MEDIA = "umbelina.media.v1";

export type MediaConfig = {
  heroImg: string;
  aboutImg: string;
  posopImg: string;
  gestanteImg: string;
  posPartoImg: string;
};

import heroImgUrl from "@/assets/hero.jpg";
import aboutImgUrl from "@/assets/about.jpg";
import posopImgUrl from "@/assets/service-posop.jpg";
import gestanteImgUrl from "@/assets/service-gestante.jpg";
import posPartoImgUrl from "@/assets/service-pos-parto.jpg";

export const DEFAULT_MEDIA: MediaConfig = {
  heroImg: heroImgUrl,
  aboutImg: aboutImgUrl,
  posopImg: posopImgUrl,
  gestanteImg: gestanteImgUrl,
  posPartoImg: posPartoImgUrl,
};

// Due to Vite bundling, dynamically importing from /src/assets via variable in img src is tricky.
// The best approach for default images is to import them at the component level as fallback,
// but if the URL is an absolute http link, we use that.

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function syncMediaFromCloud() {
  if (!supabase || typeof window === "undefined") return;
  try {
    const { data, error } = await supabase.from("app_settings").select("*").eq("key", LS_MEDIA);
    if (error || !data || data.length === 0) return;
    
    const cloudVal = typeof data[0].value === 'string' ? data[0].value : JSON.stringify(data[0].value);
    const local = window.localStorage.getItem(LS_MEDIA);
    
    if (local !== cloudVal) {
      window.localStorage.setItem(LS_MEDIA, cloudVal);
      window.dispatchEvent(new Event("media:updated"));
    }
  } catch (err) {
    console.error("Erro ao sincronizar media com a nuvem", err);
  }
}

async function pushMediaToCloud(value: any) {
  if (!supabase) return;
  try {
    await supabase.from("app_settings").upsert({ key: LS_MEDIA, value });
  } catch (err) {
    console.error("Erro ao salvar media na nuvem", err);
  }
}

export function loadMedia(): MediaConfig {
  if (typeof window === "undefined") return DEFAULT_MEDIA;
  return safeParse<MediaConfig>(window.localStorage.getItem(LS_MEDIA), DEFAULT_MEDIA);
}

export function saveMedia(cfg: MediaConfig) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_MEDIA, JSON.stringify(cfg));
  window.dispatchEvent(new Event("media:updated"));
  pushMediaToCloud(cfg);
}

export function resetMedia() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LS_MEDIA);
  window.dispatchEvent(new Event("media:updated"));
}

import { useState, useEffect } from "react";

export function useMedia() {
  const [media, setMedia] = useState<MediaConfig>(loadMedia);
  useEffect(() => {
    function handleUpdate() {
      setMedia(loadMedia());
    }
    window.addEventListener("media:updated", handleUpdate);
    return () => window.removeEventListener("media:updated", handleUpdate);
  }, []);
  return media;
}
