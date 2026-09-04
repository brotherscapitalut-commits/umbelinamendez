import { useState } from "react";
import { waLink } from "@/lib/site";
import { trackClick, trackEvent } from "@/lib/tracking";
import { MonogramUM } from "@/components/logo";
import { useActivePromos } from "@/lib/promos";
import { useCart } from "@/lib/cart-store";

export function BeautyTechDaySection() {
  const cart = useCart();
  const promos = useActivePromos();
  const btdPromo = promos.find((p) => p.serviceSlug === "beauty-tech-day");

  let dateText = "Vagas Limitadas";
  if (btdPromo && btdPromo.endsAt) {
    const d = new Date(btdPromo.endsAt);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    dateText = `${day}/${month} • Vagas Limitadas`;
  }

  const defaultWa = waLink(
    "Olá, Dra. Umbelina! Gostaria de reservar meu horário para o *Beauty Tech Day* na clínica.",
    "promo_card_whatsapp",
    "beauty-tech-day"
  );

  function handleBuy(item: { id: string, title: string, price: number, badge: string }) {
    trackEvent("select_promotion", {
      promo: item.title,
      value: item.price,
      currency: "BRL",
    });
    cart.addItem({
      id: item.id,
      title: `${item.badge}: ${item.title}`,
      price: item.price,
      category: "Evento BTD",
    });
  }

  return (
    <section id="beauty-tech-day" className="relative py-24 md:py-32 bg-[#F9F4F0] overflow-hidden border-b border-[#E8D8D0]">
      {/* Decorações sutis de fundo */}
      <div
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full opacity-30 blur-3xl"
        style={{ background: "#B76E79" }}
      />
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full opacity-25 blur-3xl"
        style={{ background: "#8C4E43" }}
      />

      <div className="mx-auto max-w-6xl px-6 relative">
        {/* Card Principal Flyer Style */}
        <div
          className="rounded-[3rem] border border-[#E8D8D0] bg-white p-8 md:p-14 shadow-[0_20px_60px_rgba(168,101,88,0.1)] relative overflow-hidden"
        >
          {/* Badge Edição Especial Topo */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#F2E7E1]">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full border border-[#E8D8D0] bg-[#FDFBF9] flex flex-col items-center justify-center text-center p-1 shadow-sm shrink-0">
                <span className="text-[8px] uppercase tracking-widest text-[#8C4E43] font-bold">EDIÇÃO</span>
                <span className="font-serif text-[11px] font-semibold text-[#2D2322] leading-none mt-0.5">ESPECIAL</span>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-[0.3em] text-[#8C4E43] font-semibold">
                  Evento Tecnológico Exclusivo
                </div>
                <h2 className="font-serif text-3xl sm:text-5xl text-[#2D2322] font-semibold tracking-wide mt-1">
                  BEAUTY <span className="font-normal italic text-[#8C4E43]">TECH DAY</span>
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-2xl border border-[#E8D8D0] bg-[#FDFBF9] px-4 py-2.5 shadow-sm">
                <span className="text-base">📅</span>
                <div className="text-left">
                  <div className="text-[9px] uppercase tracking-widest text-[#6E5A56] font-semibold">Data Especial</div>
                  <div className="font-serif text-base font-bold text-[#8C4E43]">{dateText}</div>
                </div>
              </div>
              <MonogramUM className="hidden md:block h-12 w-12 opacity-90" />
            </div>
          </div>

          <p className="mt-6 text-xs md:text-sm text-[#6E5A56] text-center uppercase tracking-[0.25em] font-medium">
            Um dia exclusivo dedicado às tecnologias consagradas da clínica
          </p>

          {/* Grid das 3 Tecnologias */}
          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {/* 1. Criolipólise */}
            <div className="rounded-3xl border border-[#E8D8D0] bg-[#FDFBF9] p-6 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="h-10 w-10 rounded-2xl bg-white border border-[#E8D8D0] grid place-items-center text-xl text-[#8C4E43] shadow-sm mb-4">
                  ❄️
                </div>
                <h3 className="font-serif text-xl font-bold text-[#2D2322]">CRIOLIPÓLISE DE PLACAS</h3>
                <p className="mt-2 text-xs text-[#6E5A56] leading-relaxed">
                  Para quem deseja reduzir gordura localizada com placas planas confortáveis e sem sucção.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8D8D0]/60 space-y-2">
                <div className="text-[10px] uppercase tracking-wider text-[#8C4E43] font-bold">
                  Clique no plano para garantir:
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleBuy({
                      id: "btd-crio-1",
                      title: "Beauty Tech Day • Criolipólise (1 Placa)",
                      badge: "Beauty Tech Day",
                      price: 150,
                      discount: "1 Placa",
                      serviceSlug: "beauty-tech-day",
                      emoji: "❄️",
                    })
                  }
                  className="w-full flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-white border border-[#E8D8D0] hover:border-[#8C4E43] hover:bg-[#F4EAE4]/50 transition group text-left"
                >
                  <span className="font-medium text-[#2D2322] group-hover:text-[#8C4E43]">1 Placa</span>
                  <span className="font-serif font-bold text-[#8C4E43]">Adicionar <span aria-hidden>+</span></span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleBuy({
                      id: "btd-crio-2",
                      title: "Beauty Tech Day • Criolipólise (2 Placas)",
                      badge: "Beauty Tech Day",
                      price: 230,
                      discount: "2 Placas",
                      serviceSlug: "beauty-tech-day",
                      emoji: "❄️",
                    })
                  }
                  className="w-full flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-white border-2 border-[#8C4E43] bg-[#F4EAE4]/30 hover:bg-[#F4EAE4] transition group text-left shadow-sm"
                >
                  <span className="font-bold text-[#2D2322]">2 Placas (Mais pedido)</span>
                  <span className="font-serif font-bold text-[#8C4E43]">Adicionar <span aria-hidden>+</span></span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleBuy({
                      id: "btd-crio-4",
                      title: "Beauty Tech Day • Criolipólise (4 Placas)",
                      badge: "Beauty Tech Day",
                      price: 349,
                      discount: "4 Placas",
                      serviceSlug: "beauty-tech-day",
                      emoji: "❄️",
                    })
                  }
                  className="w-full flex items-center justify-between text-xs py-2 px-3 rounded-xl bg-white border border-[#E8D8D0] hover:border-[#8C4E43] hover:bg-[#F4EAE4]/50 transition group text-left"
                >
                  <span className="font-medium text-[#2D2322] group-hover:text-[#8C4E43]">4 Placas</span>
                  <span className="font-serif font-bold text-[#8C4E43]">Adicionar <span aria-hidden>+</span></span>
                </button>
              </div>
            </div>

            {/* 2. Lavier */}
            <div className="rounded-3xl border border-[#E8D8D0] bg-[#FDFBF9] p-6 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="h-10 w-10 rounded-2xl bg-white border border-[#E8D8D0] grid place-items-center text-xl text-[#8C4E43] shadow-sm mb-4">
                  ✧
                </div>
                <h3 className="font-serif text-xl font-bold text-[#2D2322]">LAVIER</h3>
                <p className="mt-2 text-xs text-[#6E5A56] leading-relaxed">
                  Tecnologia para estimular colágeno, promover firmeza e melhorar a textura e qualidade da pele.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8D8D0]/60">
                <div className="text-[10px] uppercase tracking-wider text-[#8C4E43] font-bold">
                  Sessão a partir de
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleBuy({
                      id: "btd-lavier",
                      title: "Beauty Tech Day • Tecnologia Lavier Facial",
                      badge: "Beauty Tech Day",
                      price: 199,
                      discount: "Sessão Especial",
                      serviceSlug: "beauty-tech-day",
                      emoji: "✨",
                    })
                  }
                  className="w-full mt-2 text-center py-3.5 px-4 rounded-2xl bg-white border border-[#E8D8D0] hover:border-[#8C4E43] hover:bg-[#F4EAE4]/60 transition shadow-sm group"
                >
                  <div className="font-serif text-3xl font-bold text-[#2D2322] group-hover:text-[#8C4E43] transition">
                    R$ 199,00
                  </div>
                  <div className="text-[11px] text-[#8C4E43] font-semibold tracking-wider mt-0.5">
                    Adicionar ao Pacote <span aria-hidden>+</span>
                  </div>
                </button>
              </div>
            </div>

            {/* 3. Depilação a Laser */}
            <div className="rounded-3xl border border-[#E8D8D0] bg-[#FDFBF9] p-6 flex flex-col justify-between hover:shadow-md transition">
              <div>
                <div className="h-10 w-10 rounded-2xl bg-white border border-[#E8D8D0] grid place-items-center text-xl text-[#8C4E43] shadow-sm mb-4">
                  💎
                </div>
                <h3 className="font-serif text-xl font-bold text-[#2D2322]">DEPILAÇÃO A LASER</h3>
                <p className="mt-2 text-xs text-[#6E5A56] leading-relaxed">
                  Mais praticidade, conforto e liberdade definitiva para o seu dia a dia.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8D8D0]/60">
                <div className="text-[10px] uppercase tracking-wider text-[#8C4E43] font-bold">
                  Sessão a partir de
                </div>
                <button
                  type="button"
                  onClick={() =>
                    handleBuy({
                      id: "btd-laser",
                      title: "Beauty Tech Day • Depilação a Laser",
                      badge: "Beauty Tech Day",
                      price: 39.99,
                      discount: "A partir de",
                      serviceSlug: "beauty-tech-day",
                      emoji: "💎",
                    })
                  }
                  className="w-full mt-2 text-center py-3.5 px-4 rounded-2xl bg-white border border-[#E8D8D0] hover:border-[#8C4E43] hover:bg-[#F4EAE4]/60 transition shadow-sm group"
                >
                  <div className="font-serif text-3xl font-bold text-[#2D2322] group-hover:text-[#8C4E43] transition">
                    R$ 39,99
                  </div>
                  <div className="text-[11px] text-[#8C4E43] font-semibold tracking-wider mt-0.5">
                    Adicionar ao Pacote <span aria-hidden>+</span>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* 4 Diferenciais do Evento */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 border-t border-[#F2E7E1]">
            <div className="text-center md:text-left">
              <div className="text-lg mb-1">👤</div>
              <div className="text-xs font-bold text-[#2D2322] uppercase tracking-wider">Atendimento Individualizado</div>
              <p className="text-[11px] text-[#6E5A56] mt-1">Cada paciente é única e recebe atenção dedicada completa.</p>
            </div>
            <div className="text-center md:text-left">
              <div className="text-lg mb-1">📋</div>
              <div className="text-xs font-bold text-[#2D2322] uppercase tracking-wider">Avaliação Personalizada</div>
              <p className="text-[11px] text-[#6E5A56] mt-1">Entendemos suas necessidades para o melhor resultado.</p>
            </div>
            <div className="text-center md:text-left">
              <div className="text-lg mb-1">🎯</div>
              <div className="text-xs font-bold text-[#2D2322] uppercase tracking-wider">Planejamento Estratégico</div>
              <p className="text-[11px] text-[#6E5A56] mt-1">Estratégia feita de acordo com sua rotina e objetivos.</p>
            </div>
            <div className="text-center md:text-left">
              <div className="text-lg mb-1">⏰</div>
              <div className="text-xs font-bold text-[#2D2322] uppercase tracking-wider">Horários Agendados</div>
              <p className="text-[11px] text-[#6E5A56] mt-1">Atendimento exclusivo com horários limitados e organizados.</p>
            </div>
          </div>

          {/* Chamada para Ação e Local */}
          <div className="mt-10 pt-6 border-t border-[#F2E7E1] flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="text-xs font-serif italic text-[#8C4E43] text-base">
                "Porque cuidar de você também merece entrar na sua agenda. ♡"
              </div>
              <div className="text-[11px] text-[#6E5A56] mt-1">
                📍 Clínica Asa Norte | SEPN 513, Edifício Bittar I, Sala 110
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() =>
                  handleBuy({
                    id: "btd-combo-destaque",
                    title: "Beauty Tech Day • Criolipólise 2 Placas",
                    badge: "Beauty Tech Day",
                    price: 230,
                    discount: "2 Placas",
                    serviceSlug: "beauty-tech-day",
                    emoji: "✨",
                  })
                }
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#8C4E43] text-white px-8 py-3.5 text-xs font-semibold tracking-wide hover:bg-[#8C4E43] shadow-[0_4px_16px_rgba(168,101,88,0.25)] transition shrink-0"
              >
                Adicionar ao Pacote <span aria-hidden>+</span>
              </button>

              <a
                href={defaultWa}
                target="_blank"
                rel="noreferrer"
                onClick={trackClick("beauty_tech_day_cta")}
                className="inline-flex items-center justify-center rounded-full border border-[#E8D8D0] bg-white px-6 py-3.5 text-xs font-semibold text-[#2D2322] hover:bg-[#FDFBF9] transition"
              >
                Dúvidas no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      </section>
  );
}
