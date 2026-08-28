import { useEffect, useState } from "react";
import { SITE } from "./site";

export type LeadStatus = "pendente_pix" | "pago" | "expirado";

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email?: string;
  bestContactTime?: string;
  serviceName: string;
  serviceSlug?: string;
  price: number;
  status: LeadStatus;
  preferredDate?: string;
  preferredShift?: "Manhã" | "Tarde" | "Integral";
  notes?: string;
  createdAt: string; // ISO
  updatedAt?: string; // ISO
};

const LS_LEADS = "umbelina.leads.v1";

const DEFAULT_SAMPLE_LEADS: Lead[] = [
  {
    id: "lead-sample-1",
    name: "Mariana Costa",
    phone: "(61) 98234-1122",
    bestContactTime: "Tarde (14h às 18h)",
    serviceName: "Criolipólise de Placas (2 Placas)",
    serviceSlug: "beauty-tech-day",
    price: 230,
    status: "pendente_pix",
    preferredDate: "2026-08-18",
    preferredShift: "Tarde",
    createdAt: new Date(Date.now() - 1000 * 60 * 35).toISOString(),
  },
  {
    id: "lead-sample-2",
    name: "Fernanda Silveira",
    phone: "(61) 99188-7744",
    bestContactTime: "Manhã (08h às 12h)",
    serviceName: "Lavier Facial",
    serviceSlug: "beauty-tech-day",
    price: 199,
    status: "pago",
    preferredDate: "2026-08-18",
    preferredShift: "Manhã",
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
];

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadLeads(): Lead[] {
  if (typeof window === "undefined") return DEFAULT_SAMPLE_LEADS;
  return safeParse<Lead[]>(window.localStorage.getItem(LS_LEADS), DEFAULT_SAMPLE_LEADS);
}

export function saveLead(leadData: Omit<Lead, "id" | "createdAt"> & { id?: string }): Lead {
  if (typeof window === "undefined") {
    return {
      ...leadData,
      id: leadData.id || `lead-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
  }

  const leads = loadLeads();
  const now = new Date().toISOString();

  let finalLead: Lead;
  if (leadData.id) {
    const idx = leads.findIndex((l) => l.id === leadData.id);
    if (idx >= 0) {
      finalLead = {
        ...leads[idx],
        ...leadData,
        updatedAt: now,
      };
      leads[idx] = finalLead;
    } else {
      finalLead = {
        ...leadData,
        id: leadData.id,
        createdAt: now,
        updatedAt: now,
      };
      leads.unshift(finalLead);
    }
  } else {
    finalLead = {
      ...leadData,
      id: `lead-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      createdAt: now,
      updatedAt: now,
    };
    leads.unshift(finalLead);
  }

  window.localStorage.setItem(LS_LEADS, JSON.stringify(leads));
  window.dispatchEvent(new Event("leads:updated"));
  return finalLead;
}

export function updateLeadStatus(
  id: string,
  status: LeadStatus,
  extra?: Partial<Omit<Lead, "id" | "status">>
) {
  if (typeof window === "undefined") return;
  const leads = loadLeads();
  const idx = leads.findIndex((l) => l.id === id);
  if (idx >= 0) {
    leads[idx] = {
      ...leads[idx],
      ...extra,
      status,
      updatedAt: new Date().toISOString(),
    };
    window.localStorage.setItem(LS_LEADS, JSON.stringify(leads));
    window.dispatchEvent(new Event("leads:updated"));
  }
}

export function deleteLead(id: string) {
  if (typeof window === "undefined") return;
  const leads = loadLeads().filter((l) => l.id !== id);
  window.localStorage.setItem(LS_LEADS, JSON.stringify(leads));
  window.dispatchEvent(new Event("leads:updated"));
}

export function clearAllLeads() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_LEADS, JSON.stringify([]));
  window.dispatchEvent(new Event("leads:updated"));
}

export function resetSampleLeads() {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_LEADS, JSON.stringify(DEFAULT_SAMPLE_LEADS));
  window.dispatchEvent(new Event("leads:updated"));
}

export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>(() => {
    if (typeof window === "undefined") return DEFAULT_SAMPLE_LEADS;
    return loadLeads();
  });

  useEffect(() => {
    const refresh = () => setLeads(loadLeads());
    refresh();
    window.addEventListener("leads:updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("leads:updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return leads;
}

export function formatPriceBRL(val: number) {
  return `R$ ${val.toFixed(2).replace(".", ",")}`;
}

export function formatPhoneDigits(phone: string) {
  return phone.replace(/\D/g, "");
}

export function generateRecoveryMessage(lead: Lead) {
  return (
    `Olá ${lead.name}! Vi que você começou a sua reserva para o ${lead.serviceName} ` +
    `(${formatPriceBRL(lead.price)}), mas o Pix não foi concluído.\n\n` +
    `Quer ajuda para confirmar seu horário na clínica antes que as vagas encerrem? ♡`
  );
}

export function generateRecoveryWhatsAppLink(lead: Lead) {
  const cleanPhone = formatPhoneDigits(lead.phone);
  // Se o telefone começar sem 55, adiciona 55 se tiver 10 ou 11 dígitos
  const fullPhone =
    cleanPhone.length >= 10 && !cleanPhone.startsWith("55") ? `55${cleanPhone}` : cleanPhone;

  const msg = encodeURIComponent(generateRecoveryMessage(lead));
  return `https://wa.me/${fullPhone}?text=${msg}`;
}
