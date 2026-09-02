import { useEffect, useState } from "react";
import { useActivePromos } from "@/lib/promos";
import { SERVICES, waLink } from "@/lib/site";
import { trackClick } from "@/lib/tracking";

function useCountdown(target: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return { d, h, m, s, ended: diff === 0 };
}

export function PromoBar() {
  const promos = useActivePromos();
  const [dismissed, setDismissed] = useState(false);
  if (dismissed || promos.length === 0) return null;

  const first = promos[0];
  const service = SERVICES.find((s) => s.slug === first.serviceSlug);
  const wa = waLink(
    `Olá, Dra. Umbelina! Vi a campanha *${first.badge}* no topo do site e gostaria de garantir minha condição${
      service ? ` para *${service.title}*` : ""
    }.`,
    "promo_bar",
    first.serviceSlug
  );

  return (
    <div
      className="relative overflow-hidden text-white border-b border-[#8C4E43]/40"
      style={{
        background: "linear-gradient(90deg, #8C4E43 0%, #8C4E43 50%, #B76E79 100%)",
      }}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-2 flex items-center justify-between gap-4 text-xs sm:text-sm">
        <div className="flex-1 overflow-hidden">
          <div className="flex whitespace-nowrap animate-[marquee_30s_linear_infinite] gap-12 will-change-transform">
            {[...promos, ...promos].map((p, i) => (
              <span key={`${p.id}-${i}`} className="inline-flex items-center gap-2">
                <span aria-hidden>{p.emoji ?? "✦"}</span>
                <strong className="font-semibold tracking-wide uppercase text-[11px] bg-white/15 px-2 py-0.5 rounded">
                  {p.badge}
                </strong>
                <span className="opacity-95 text-xs">{p.subtitle}</span>
                <span className="rounded-full bg-white text-[#8C4E43] px-2 py-0.5 text-[10px] font-bold tracking-wider">
                  {p.discount}
                </span>
              </span>
            ))}
          </div>
        </div>

        <Countdown endsAt={first.endsAt} />

        <div className="flex items-center gap-2 shrink-0">
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            onClick={trackClick("promo_bar", { promo: first.id, service: first.serviceSlug })}
            className="hidden sm:inline-flex items-center rounded-full bg-white text-[#2D2322] px-3.5 py-1 text-xs font-semibold hover:bg-[#FDFBF9] shadow-sm transition"
          >
            {first.ctaLabel}
          </a>
          <button
            aria-label="Fechar aviso"
            onClick={() => setDismissed(true)}
            className="opacity-80 hover:opacity-100 transition text-base leading-none px-1"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}

function Countdown({ endsAt }: { endsAt: string }) {
  const { d, h, m, s, ended } = useCountdown(endsAt);
  if (ended) return null;
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="hidden md:flex items-center gap-1 font-mono tabular-nums text-[11px] text-white/90">
      <span className="text-[10px] uppercase tracking-wider text-white/70 mr-1">Encerra em:</span>
      <span className="rounded bg-black/20 px-1.5 py-0.5">{pad(d)}d</span>
      <span className="rounded bg-black/20 px-1.5 py-0.5">{pad(h)}h</span>
      <span className="rounded bg-black/20 px-1.5 py-0.5">{pad(m)}m</span>
      <span className="rounded bg-black/20 px-1.5 py-0.5">{pad(s)}s</span>
    </div>
  );
}
