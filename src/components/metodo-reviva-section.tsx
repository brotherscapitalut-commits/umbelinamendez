import { Link } from "@tanstack/react-router";
import { waLink } from "@/lib/site";
import { trackClick } from "@/lib/tracking";

export function MetodoRevivaSection() {
  const wa = waLink(
    "Olá, Dra. Umbelina! Gostaria de receber uma proposta personalizada para o *Método Reviva™ Corporal*.",
    "cta_contato",
    "metodo-reviva"
  );

  const objetivos = [
    "Reduzir retenção e inchaço",
    "Melhorar contorno corporal",
    "Tratar flacidez tissular e muscular",
    "Potencializar definição corporal",
    "Melhorar textura e viço da pele",
    "Manter resultados estéticos duradouros",
    "Criar constância nos cuidados",
    "Ter acompanhamento biológico personalizado",
  ];

  const tecnologias = [
    { name: "Drenagem corporal", icon: "✦" },
    { name: "Radiofrequência", icon: "✧" },
    { name: "Ultrassom focalizado", icon: "✦" },
    { name: "Crioterapia", icon: "❄️" },
    { name: "Massagem modeladora", icon: "✧" },
    { name: "Eletroterapia", icon: "⚡" },
    { name: "Estímulo de colágeno", icon: "✨" },
  ];

  const diferenciais = [
    "Acompanhamento contínuo",
    "Protocolos personalizados",
    "Evolução corporal estratégica",
    "Associação de tecnologias",
    "Avaliação recorrente",
    "Experiência acolhedora e premium",
    "Foco em resultado progressivo",
  ];

  return (
    <section id="metodo-reviva" className="relative py-24 md:py-32 bg-white border-b border-[#E8D8D0]">
      <div className="mx-auto max-w-6xl px-6">
        {/* Cabeçalho Conceitual */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-[0.4em] text-[#8C4E43] font-semibold">
            <span>ARTE DE CUIDAR</span>
            <span>◆ ◆ ◆</span>
          </div>

          <h2 className="mt-5 font-serif text-4xl sm:text-6xl text-[#2D2322] font-semibold tracking-wide">
            REVIVA <span className="font-normal italic text-[#8C4E43] text-3xl sm:text-5xl">método ™</span>
          </h2>

          <p className="mt-4 text-xs sm:text-sm uppercase tracking-[0.25em] text-[#6E5A56] font-medium">
            Acompanhamento Corporal Contínuo
          </p>

          <p className="mt-2 text-xs md:text-sm text-[#6E5A56] max-w-xl mx-auto leading-relaxed">
            Para mulheres que desejam transformação com estratégia, constância e evolução.
          </p>

          <div className="mt-8 p-6 rounded-3xl bg-[#FDFBF9] border border-[#E8D8D0] inline-block shadow-sm">
            <p className="font-serif italic text-lg sm:text-2xl text-[#2D2322] leading-snug">
              "Seu corpo merece constância. Não apenas sessões isoladas."
            </p>
          </div>
        </div>

        {/* O Conceito */}
        <div className="mt-16 grid md:grid-cols-12 gap-10 items-center p-8 md:p-12 rounded-[2.5rem] bg-[#F7EFE9]/60 border border-[#E8D8D0]">
          <div className="md:col-span-6">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#8C4E43] font-bold">O Conceito</span>
            <h3 className="mt-2 font-serif text-2xl sm:text-4xl text-[#2D2322] font-semibold leading-tight">
              O que é o Método Reviva™?
            </h3>
            <p className="mt-4 text-xs md:text-sm text-[#6E5A56] leading-relaxed">
              O Método Reviva™ foi criado pela Dra. Umbelina Mendez para mulheres que desejam mais do que sessões isoladas. É um acompanhamento corporal estratégico, pensado para tratar o corpo de forma contínua, personalizada e progressiva.
            </p>
            <p className="mt-3 text-xs md:text-sm text-[#6E5A56] leading-relaxed">
              Cada sessão é planejada conforme a evolução corporal da paciente, associando técnicas manuais e tecnologias para potencializar resultados de forma inteligente e segura.
            </p>

            <div className="mt-6 p-4 rounded-2xl bg-white border border-[#E8D8D0] shadow-sm">
              <p className="font-serif italic text-sm md:text-base text-[#8C4E43] font-medium">
                Aqui, não trabalhamos procedimentos aleatórios. Trabalhamos evolução corporal acompanhada.
              </p>
            </div>
          </div>

          <div className="md:col-span-6">
            <div className="bg-white rounded-3xl p-7 border border-[#E8D8D0] shadow-sm">
              <h4 className="font-serif text-xl font-bold text-[#2D2322] mb-4">
                O Reviva™ é ideal para mulheres que desejam:
              </h4>
              <div className="grid sm:grid-cols-2 gap-3">
                {objetivos.map((obj) => (
                  <div
                    key={obj}
                    className="p-3 rounded-xl bg-[#FDFBF9] border border-[#E8D8D0]/70 flex items-start gap-2.5 text-xs text-[#2D2322] font-medium"
                  >
                    <span className="text-[#8C4E43] mt-0.5 font-bold">＋</span>
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Como Funciona & Diferencial */}
        <div className="mt-14 grid md:grid-cols-12 gap-8">
          {/* Como Funciona */}
          <div className="md:col-span-6 rounded-3xl bg-[#FDFBF9] border border-[#E8D8D0] p-8 flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#8C4E43] font-bold">COMO FUNCIONA</span>
              <h3 className="mt-2 font-serif text-2xl font-semibold text-[#2D2322]">Uma jornada corporal estratégica</h3>
              <p className="mt-3 text-xs md:text-sm text-[#6E5A56] leading-relaxed">
                As sessões associam drenagem manual com tecnologias específicas conforme a necessidade de cada fase:
              </p>

              <div className="mt-5 grid grid-cols-2 gap-2.5">
                {tecnologias.map((t) => (
                  <div key={t.name} className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-[#E8D8D0]/60 text-xs text-[#2D2322] font-medium">
                    <span className="text-[#8C4E43]">{t.icon}</span>
                    <span>{t.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="mt-6 pt-4 border-t border-[#E8D8D0]/60 text-xs italic text-[#6E5A56]">
              Cada etapa é ajustada conforme a resposta do corpo e os objetivos de cada paciente.
            </p>
          </div>

          {/* O Diferencial */}
          <div className="md:col-span-6 rounded-3xl bg-[#FDFBF9] border border-[#E8D8D0] p-8 flex flex-col justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#8C4E43] font-bold">O DIFERENCIAL</span>
              <h3 className="mt-2 font-serif text-2xl font-semibold text-[#2D2322]">Diferenciais do Método Reviva™</h3>

              <ul className="mt-5 space-y-2 text-xs md:text-sm text-[#2D2322]">
                {diferenciais.map((d) => (
                  <li key={d} className="flex items-center gap-2.5">
                    <span className="text-[#8C4E43] font-bold">✦</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-white border border-[#E8D8D0] shadow-sm">
              <p className="font-serif italic text-xs md:text-sm text-[#2D2322] leading-snug">
                Resultado real não vem de sessões isoladas. Vem de constância, estratégia e acompanhamento.
              </p>
            </div>
          </div>
        </div>

        {/* 3 Pilares */}
        <div className="mt-14 grid sm:grid-cols-3 gap-6 text-center">
          <div className="p-6 rounded-3xl bg-[#F7EFE9]/70 border border-[#E8D8D0]">
            <div className="font-serif text-2xl font-bold text-[#2D2322]">Cuidado</div>
            <div className="text-xs uppercase tracking-wider text-[#8C4E43] font-semibold mt-1">Personalizado</div>
            <p className="text-xs text-[#6E5A56] mt-2">Protocolos adaptados individualmente para suas metas.</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#F7EFE9]/70 border border-[#E8D8D0]">
            <div className="font-serif text-2xl font-bold text-[#2D2322]">Evolução</div>
            <div className="text-xs uppercase tracking-wider text-[#8C4E43] font-semibold mt-1">Progressiva</div>
            <p className="text-xs text-[#6E5A56] mt-2">Resultados sustentáveis com acompanhamento quinzenal.</p>
          </div>

          <div className="p-6 rounded-3xl bg-[#F7EFE9]/70 border border-[#E8D8D0]">
            <div className="font-serif text-2xl font-bold text-[#2D2322]">Resultado</div>
            <div className="text-xs uppercase tracking-wider text-[#8C4E43] font-semibold mt-1">Duradouro</div>
            <p className="text-xs text-[#6E5A56] mt-2">Constância biológica que preserva a saúde tecidual.</p>
          </div>
        </div>

        {/* 3 Formatos de Acompanhamento (Planos) */}
        <div className="mt-16">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#8C4E43] font-bold">FORMATOS DE ACOMPANHAMENTO</span>
            <h3 className="mt-2 font-serif text-3xl sm:text-4xl font-semibold text-[#2D2322]">
              Planos de Acompanhamento
            </h3>
          </div>

          <div className="mt-10 grid md:grid-cols-3 gap-6">
            {/* Essencial */}
            <div className="rounded-3xl border border-[#E8D8D0] bg-[#FDFBF9] p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition">
              <div>
                <span className="rounded-full bg-[#F4EAE4] text-[#8C4E43] text-[10px] uppercase tracking-widest font-bold px-3 py-1 inline-block">
                  ESSENCIAL
                </span>
                <h4 className="mt-4 font-serif text-2xl font-bold text-[#2D2322]">Reviva™ Essencial</h4>
                <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-[#8C4E43]">
                  <span>◆</span>
                  <span>1 sessão semanal</span>
                </div>
                <p className="mt-4 text-xs text-[#6E5A56] leading-relaxed">
                  Ideal para manutenção e constância corporal, retenção líquida leve e cuidado continuado.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8D8D0]/60">
                <a
                  href={wa}
                  target="_blank"
                  rel="noreferrer"
                  onClick={trackClick("reviva_plano_essencial")}
                  className="w-full inline-flex items-center justify-center rounded-full bg-white border border-[#E8D8D0] py-2.5 text-xs font-semibold text-[#2D2322] hover:bg-[#8C4E43] hover:text-white transition shadow-sm"
                >
                  Consultar Plano Essencial →
                </a>
              </div>
            </div>

            {/* Intensivo */}
            <div className="rounded-3xl border-2 border-[#8C4E43] bg-white p-7 flex flex-col justify-between shadow-lg relative">
              <div className="absolute -top-3 right-6 rounded-full bg-[#8C4E43] text-white text-[10px] uppercase tracking-wider font-bold px-3 py-0.5">
                Mais Procurado
              </div>
              <div>
                <span className="rounded-full bg-[#F4EAE4] text-[#8C4E43] text-[10px] uppercase tracking-widest font-bold px-3 py-1 inline-block">
                  INTENSIVO
                </span>
                <h4 className="mt-4 font-serif text-2xl font-bold text-[#2D2322]">Reviva™ Intensivo</h4>
                <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-[#8C4E43]">
                  <span>◆</span>
                  <span>2 sessões semanais</span>
                </div>
                <p className="mt-4 text-xs text-[#6E5A56] leading-relaxed">
                  Acompanhamento contínuo para resultados mais acelerados e estratégicos no contorno e flacidez.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8D8D0]/60">
                <a
                  href={wa}
                  target="_blank"
                  rel="noreferrer"
                  onClick={trackClick("reviva_plano_intensivo")}
                  className="w-full inline-flex items-center justify-center rounded-full bg-[#8C4E43] text-white py-2.5 text-xs font-semibold hover:bg-[#8C4E43] transition shadow-md"
                >
                  Consultar Plano Intensivo →
                </a>
              </div>
            </div>

            {/* Premium */}
            <div className="rounded-3xl border border-[#E8D8D0] bg-[#FDFBF9] p-7 flex flex-col justify-between shadow-sm hover:shadow-md transition">
              <div>
                <span className="rounded-full bg-[#F4EAE4] text-[#8C4E43] text-[10px] uppercase tracking-widest font-bold px-3 py-1 inline-block">
                  PREMIUM
                </span>
                <h4 className="mt-4 font-serif text-2xl font-bold text-[#2D2322]">Reviva™ Premium</h4>
                <div className="mt-2 flex items-center gap-2 text-xs font-semibold text-[#8C4E43]">
                  <span>◆</span>
                  <span>Acompanhamento Intensivo + Benefícios</span>
                </div>
                <p className="mt-4 text-xs text-[#6E5A56] leading-relaxed">
                  Experiência ampliada com protocolos multitecnológicos personalizados e diferenciais exclusivos.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#E8D8D0]/60">
                <a
                  href={wa}
                  target="_blank"
                  rel="noreferrer"
                  onClick={trackClick("reviva_plano_premium")}
                  className="w-full inline-flex items-center justify-center rounded-full bg-white border border-[#E8D8D0] py-2.5 text-xs font-semibold text-[#2D2322] hover:bg-[#8C4E43] hover:text-white transition shadow-sm"
                >
                  Consultar Plano Premium →
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé da Seção */}
        <div className="mt-14 text-center pt-8 border-t border-[#E8D8D0]">
          <p className="font-serif italic text-base text-[#8C4E43]">
            "Seu corpo muda quando o cuidado se torna contínuo."
          </p>
          <div className="mt-2 text-xs text-[#6E5A56]">
            Transformação com constância · Resultados com estratégia
          </div>
        </div>
      </div>
    </section>
  );
}
