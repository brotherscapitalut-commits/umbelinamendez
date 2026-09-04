import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { activePromos, useActivePromos } from "@/lib/promos";
import { SERVICES, waLink } from "@/lib/site";
import { trackClick, trackEvent } from "@/lib/tracking";
import { useInView } from "@/hooks/use-in-view";
import { useCart } from "@/lib/cart-store";

function useCountdown(target: string) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  const diff = Math.max(0, new Date(target).getTime() - now);
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
    ended: diff === 0,
  };
}

export function Promotions() {
  const promos = useActivePromos();
  const { ref, inView } = useInView<HTMLDivElement>();
  const cart = useCart();
  if (promos.length === 0) return null;

  return (
    <section id="promocoes" className="relative overflow-hidden py-24 md:py-32 bg-[#F7EFE9]/40 border-b border-[#E8D8D0]/60">
      {/* Elementos sutis de fundo */}
      <div
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full opacity-30 blur-3xl animate-[float_16s_ease-in-out_infinite]"
        style={{ background: "#B76E79" }}
      />
      <div
        className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full opacity-25 blur-3xl animate-[float_18s_ease-in-out_infinite_reverse]"
        style={{ background: "#8C4E43" }}
      />

      <div
        ref={ref}
        className={`relative mx-auto max-w-6xl px-6 transition-all duration-700 ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#E8D8D0] bg-white/80 backdrop-blur px-3.5 py-1 text-xs uppercase tracking-[0.25em] text-[#8C4E43] font-medium shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8C4E43] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#8C4E43]" />
              </span>
              Campanhas & Oportunidades
            </span>
            <h2 className="mt-4 font-serif text-3xl md:text-5xl leading-tight text-[#2D2322]">
              Condições <em className="text-[#8C4E43] italic">exclusivas</em> para sua evolução.
            </h2>
            <p className="mt-3 text-base text-[#6E5A56] leading-relaxed">
              Programas estruturados e eventos tecnológicos como o <strong>Beauty Tech Day</strong> com vagas limitadas para garantir atendimento individual de excelência.
            </p>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {promos.map((p, idx) => (
            <PromoCard
              key={p.id}
              promo={p}
              delay={idx * 80}
              onBuy={() => {
                trackEvent("select_promotion", { promo: p.id, value: p.price, currency: "BRL" });
                cart.addItem({
                  id: p.id,
                  title: `${p.badge}: ${p.title}`,
                  price: p.price,
                  category: "Promoção",
                });
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoCard({
  promo,
  delay,
  onBuy,
}: {
  promo: ReturnType<typeof activePromos>[number];
  delay: number;
  onBuy: () => void;
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const { d, h, m, s, ended } = useCountdown(promo.endsAt);
  const service = SERVICES.find((x) => x.slug === promo.serviceSlug);
  const wa = waLink(
    `Olá, Dra. Umbelina! Vi a campanha *${promo.badge}* no site e gostaria de garantir minha vaga${
      service ? ` para *${service.title}*` : ""
    }.`,
    "promo_card_whatsapp",
    promo.serviceSlug
  );
  if (ended) return null;

  return (
    <article
      ref={ref}
      style={{
        transitionDelay: `${delay}ms`,
        boxShadow: "0 10px 30px rgba(168, 101, 88, 0.08)",
      }}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-[#E8D8D0] bg-white p-6 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(168,101,88,0.14)] ${
        inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Topo do Card */}
      <div>
        <div className="flex items-start justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E8D8D0] bg-[#FDFBF9] px-2.5 py-1 text-[11px] uppercase tracking-wider font-medium text-[#8C4E43]">
            <span>{promo.emoji ?? "✦"}</span> {promo.badge}
          </span>
          <span className="rounded-full bg-[#F4EAE4] text-[#8C4E43] font-sans text-xs font-semibold px-2.5 py-1">
            {promo.discount}
          </span>
        </div>

        <h3 className="mt-4 font-serif text-2xl leading-tight text-[#2D2322] font-semibold">
          {promo.title}
        </h3>
        <p className="mt-2.5 text-xs text-[#6E5A56] leading-relaxed line-clamp-3">
          {promo.subtitle}
        </p>
      </div>

      {/* Preço e Contador */}
      <div className="mt-6 pt-5 border-t border-[#F2E7E1]">
        <div className="flex items-baseline gap-2">
          {promo.originalPrice && (
            <span className="text-xs text-[#6E5A56]/60 line-through">
              R$ {promo.originalPrice.toFixed(2).replace(".", ",")}
            </span>
          )}
          <span className="font-serif text-3xl text-[#2D2322] font-bold">
            R$ {promo.price.toFixed(2).replace(".", ",")}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-[#6E5A56]/70">no Pix</span>
        </div>

        {/* Contador regressivo estilizado */}
        <div className="mt-4 grid grid-cols-4 gap-1.5 text-center font-mono tabular-nums">
          {[
            { v: d, l: "dias" },
            { v: h, l: "h" },
            { v: m, l: "min" },
            { v: s, l: "seg" },
          ].map((c) => (
            <div key={c.l} className="rounded-lg bg-[#F9F4F0] border border-[#E8D8D0]/60 px-1 py-1.5">
              <div className="text-sm font-semibold text-[#2D2322]">{String(c.v).padStart(2, "0")}</div>
              <div className="text-[8px] uppercase tracking-wider text-[#6E5A56]">{c.l}</div>
            </div>
          ))}
        </div>

        {/* Botões de Ação */}
        <div className="mt-5 space-y-2">
          <button
            type="button"
            onClick={onBuy}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#8C4E43] text-white py-2.5 text-xs font-semibold tracking-wide hover:bg-[#8C4E43] transition-all shadow-[0_4px_14px_rgba(168,101,88,0.25)]"
          >
            Adicionar ao Pacote
            <span aria-hidden>+</span>
          </button>
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            onClick={trackClick("promo_card_whatsapp", {
              promo: promo.id,
              service: promo.serviceSlug,
            })}
            className="w-full inline-flex items-center justify-center rounded-full border border-[#E8D8D0] bg-white py-2 text-xs font-medium text-[#2D2322] hover:bg-[#F9F4F0] transition"
          >
            Tirar Dúvidas no WhatsApp
          </a>
          {service && (
            <div className="text-center pt-1">
              <Link
                to="/servicos/$slug"
                params={{ slug: service.slug }}
                className="text-[11px] text-[#8C4E43] hover:underline underline-offset-2"
              >
                Ver detalhes do protocolo →
              </Link>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
