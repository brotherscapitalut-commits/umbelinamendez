import { SERVICES as DEFAULT_SERVICES, type Service } from "./site";
import { supabase } from "./supabase";

const LS_SERVICES = "umbelina.services.v1";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function syncServicesFromCloud() {
  if (!supabase || typeof window === "undefined") return;
  try {
    const { data, error } = await supabase.from("app_settings").select("*").eq("key", LS_SERVICES);
    if (error || !data || data.length === 0) return;
    
    const cloudVal = typeof data[0].value === 'string' ? data[0].value : JSON.stringify(data[0].value);
    const local = window.localStorage.getItem(LS_SERVICES);
    
    if (local !== cloudVal) {
      window.localStorage.setItem(LS_SERVICES, cloudVal);
      window.dispatchEvent(new Event("services:updated"));
    }
  } catch (err) {
    console.error("Erro ao sincronizar services com a nuvem", err);
  }
}

async function pushServicesToCloud(value: any) {
  if (!supabase) return;
  try {
    await supabase.from("app_settings").upsert({ key: LS_SERVICES, value });
  } catch (err) {
    console.error("Erro ao salvar services na nuvem", err);
  }
}

export function loadServices(): Service[] {
  if (typeof window === "undefined") return DEFAULT_SERVICES;
  return safeParse<Service[]>(window.localStorage.getItem(LS_SERVICES), DEFAULT_SERVICES);
}

export function saveServices(list: Service[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_SERVICES, JSON.stringify(list));
  window.dispatchEvent(new Event("services:updated"));
  pushServicesToCloud(list);
}

export function resetServices() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(LS_SERVICES);
  window.dispatchEvent(new Event("services:updated"));
}

import { useState, useEffect } from "react";

export function useServices() {
  const [services, setServices] = useState<Service[]>(loadServices);
  useEffect(() => {
    function handleUpdate() {
      setServices(loadServices());
    }
    window.addEventListener("services:updated", handleUpdate);
    return () => window.removeEventListener("services:updated", handleUpdate);
  }, []);
  return services;
}
