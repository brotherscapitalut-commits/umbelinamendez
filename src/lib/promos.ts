export type Promo = {
  id: string;
  title: string;
  subtitle: string;
  badge: string; // ex: "Beauty Tech Day"
  discount: string; // ex: "-25%" ou "Vagas Limitadas"
  price: number; // preço promocional em BRL (à vista via Pix)
  originalPrice?: number; // preço "de" para exibir riscado
  ctaLabel: string;
  serviceSlug?: string;
  endsAt: string; // ISO date
  active: boolean;
  gradient: string; // CSS background
  emoji?: string;
};

export const PROMOS: Promo[] = [
  {
    id: "beauty-tech-day-crio",
    badge: "Beauty Tech Day",
    title: "Criolipólise de Placas (2 Placas)",
    subtitle: "Sem sucção, confortável e plana. Redução homogênea de gordura localizada.",
    discount: "Vagas Limitadas",
    price: 230,
    originalPrice: 300,
    ctaLabel: "Garantir vaga",
    serviceSlug: "beauty-tech-day",
    endsAt: nextSunday(),
    active: true,
    gradient: "linear-gradient(135deg, #8C4A3E 0%, #A86558 50%, #B76E79 100%)",
    emoji: "❄️",
  },
  {
    id: "beauty-tech-day-lavier",
    badge: "Beauty Tech Day",
    title: "Tecnologia Lavier Facial",
    subtitle: "Estímulo avançado de neocolagênese e melhora imediata da qualidade da pele.",
    discount: "Edição Especial",
    price: 199,
    originalPrice: 280,
    ctaLabel: "Garantir vaga",
    serviceSlug: "beauty-tech-day",
    endsAt: nextSunday(),
    active: true,
    gradient: "linear-gradient(135deg, #A86558 0%, #C58577 100%)",
    emoji: "✨",
  },
  {
    id: "metodo-reviva-essencial",
    badge: "Método Reviva™",
    title: "Reviva™ Essencial (1 sessão/sem)",
    subtitle: "Acompanhamento corporal contínuo combinando drenagem manual e tecnologias integradas.",
    discount: "Constância Corporal",
    price: 680,
    originalPrice: 850,
    ctaLabel: "Reservar plano",
    serviceSlug: "metodo-reviva",
    endsAt: inDays(18),
    active: true,
    gradient: "linear-gradient(135deg, #9B564A 0%, #A86558 100%)",
    emoji: "🌿",
  },
  {
    id: "conexao-materna-posparto",
    badge: "Conexão Materna",
    title: "Conexão Materna (4 Sessões)",
    subtitle: "Laserterapia na cicatriz/laceração + Protocolo ILIB sistêmico e Drenagem humanizada no DF.",
    discount: "Kit Taping Incluso",
    price: 890,
    originalPrice: 1100,
    ctaLabel: "Iniciar cuidado",
    serviceSlug: "conexao-materna",
    endsAt: inDays(21),
    active: true,
    gradient: "linear-gradient(135deg, #B76E79 0%, #A86558 100%)",
    emoji: "🌸",
  },
];

import { useEffect, useState } from "react";
import { activePromosRuntime, loadPromos } from "./promo-store";

export const activePromos = () => activePromosRuntime();

export function useActivePromos() {
  const [list, setList] = useState<Promo[]>(() => {
    if (typeof window === "undefined") return PROMOS.filter((p) => p.active);
    return activePromosRuntime();
  });
  useEffect(() => {
    const refresh = () => setList(activePromosRuntime());
    refresh();
    window.addEventListener("promos:updated", refresh);
    window.addEventListener("storage", refresh);
    const id = setInterval(refresh, 30000);
    return () => {
      window.removeEventListener("promos:updated", refresh);
      window.removeEventListener("storage", refresh);
      clearInterval(id);
    };
  }, []);
  return list;
}

export function getAllPromos(): Promo[] {
  if (typeof window === "undefined") return PROMOS;
  return loadPromos();
}

function inDays(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString();
}
function nextSunday() {
  const d = new Date();
  const day = d.getDay();
  const diff = (7 - day) % 7 || 7;
  d.setDate(d.getDate() + diff);
  d.setHours(23, 59, 59, 0);
  return d.toISOString();
}
