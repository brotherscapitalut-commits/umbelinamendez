import { createFileRoute, Link } from "@tanstack/react-router";
import { pageSchemaScripts } from "@/lib/schema";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { Logo } from "@/components/logo";
import { useMedia } from "@/lib/media-store";
import { trackClick } from "@/lib/tracking";
import { waLink } from "@/lib/site";

export const Route = createFileRoute("/atendimento-domiciliar")({
  head: () => ({
    meta: [
      { title: "Atendimento Domiciliar de Estética Avançada no DF | Umbelina Mendez" },
      {
        name: "description",
        content:
          "Drenagem linfática pós-operatório, recuperação pós-parto e Método Reviva™ no conforto do seu lar no Distrito Federal (Asa Sul, Asa Norte, Lago Sul, Noroeste).",
      },
      { property: "og:title", content: "Atendimento Domiciliar — Dra. Umbelina Mendez no DF" },
      {
        property: "og:description",
        content:
          "Leve a estrutura completa da clínica estética para o conforto da sua casa. Atendemos todo o Distrito Federal.",
      },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:type", content: "website" },
      { name: "geo.region", content: "BR-DF" },
      { name: "geo.placename", content: "Brasília" },
      { name: "geo.position", content: "-15.7594;-47.8864" },
      { name: "ICBM", content: "-15.7594, -47.8864" },
    ],
    links: [{ rel: "canonical", href: "/atendimento-domiciliar" }],
    scripts: pageSchemaScripts({
      path: "/atendimento-domiciliar",
      name: "Atendimento Domiciliar de Estética no DF — Dra. Umbelina Mendez",
      description:
        "Atendimento em domicílio (home care) de pós-operatório e estética avançada em Brasília.",
      type: "WebPage",
      breadcrumbs: [
        { name: "Início", path: "/" },
        { name: "Atendimento Domiciliar", path: "/atendimento-domiciliar" },
      ],
    }),
  }),
  component: DomiciliarPage,
});

function DomiciliarPage() {
  const media = useMedia();
  const wa = waLink("Olá, Dra. Umbelina! Tenho interesse no atendimento domiciliar.", "page_domiciliar");

  return (
    <div className="min-h-screen bg-[#F9F4F0] text-[#2D2322]">
      <header className="border-b border-[#E8D8D0] backdrop-blur-md bg-[#F9F4F0]/90 sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <Link
            to="/agendamento"
            className="rounded-full bg-[#8C4E43] text-white px-5 py-2 text-xs font-semibold hover:bg-[#8C4E43] shadow-sm transition"
          >
            Agendar Atendimento
          </Link>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="mx-auto max-w-6xl px-6 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-[#8C4E43] font-semibold">
              Conforto & Segurança
            </span>
            <h1
              data-speakable
              className="mt-4 font-serif text-3xl sm:text-4xl md:text-5xl text-[#2D2322] font-semibold leading-tight"
            >
              A excelência da clínica, <em className="text-[#8C4E43] italic font-normal">no conforto do seu lar.</em>
            </h1>
            <p className="mt-5 text-sm md:text-base text-[#6E5A56] leading-relaxed">
              O momento do pós-operatório e do puerpério exige o máximo de repouso. É por isso que oferecemos o serviço de <strong>Home Care Especializado</strong> em Brasília, levando todos os nossos aparelhos, laserterapia e macas profissionais diretamente para você.
            </p>
            <div className="mt-8 flex gap-4">
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                onClick={trackClick("hero_wa_domiciliar")}
                className="rounded-full bg-[#8C4E43] text-white px-6 py-3 text-xs md:text-sm font-semibold shadow-[0_4px_14px_rgba(168,101,88,0.25)] hover:bg-[#8C4E43] transition"
              >
                Agendar Visita Domiciliar
              </a>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl">
            <img src={media.posPartoImg} alt="Atendimento Domiciliar Pós-Parto e Pós-Operatório" className="w-full h-full object-cover" />
          </div>
        </section>

        {/* Regiões Atendidas */}
        <section className="bg-white py-16 md:py-24 border-y border-[#E8D8D0]">
          <div className="mx-auto max-w-6xl px-6 text-center">
            <h2 className="font-serif text-3xl md:text-4xl text-[#2D2322] font-semibold">Regiões Atendidas no DF</h2>
            <p className="mt-4 text-sm text-[#6E5A56] max-w-2xl mx-auto">
              Cobrimos as principais áreas do Distrito Federal com pontualidade e segurança.
            </p>
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Asa Norte', 'Asa Sul', 'Lago Norte', 'Lago Sul', 'Noroeste', 'Sudoeste', 'Águas Claras', 'Park Way', 'Cruzeiro', 'Guará', 'Octogonal', 'Taguatinga'].map(region => (
                <div key={region} className="p-4 rounded-xl border border-[#E8D8D0] bg-[#FDFBF9] text-[#2D2322] font-semibold text-sm">
                  {region}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Como Preparar o Ambiente */}
        <section className="mx-auto max-w-4xl px-6 py-16 md:py-24">
          <div className="bg-[#FDFBF9] p-8 md:p-12 rounded-3xl border border-[#E8D8D0] shadow-sm">
            <h2 className="font-serif text-2xl md:text-3xl text-[#2D2322] font-semibold mb-6">Como preparar a sua casa?</h2>
            <ul className="space-y-4 text-sm text-[#6E5A56]">
              <li className="flex gap-3">
                <span className="text-[#8C4E43] text-lg mt-0.5">✓</span>
                <div>
                  <strong>Nós levamos tudo:</strong> Maca, produtos, toalhas, laser, ultrassom. Você não precisa se preocupar com materiais.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-[#8C4E43] text-lg mt-0.5">✓</span>
                <div>
                  <strong>Espaço necessário:</strong> Apenas um espaço mínimo (aprox. 2x2 metros) na sala ou no quarto para montarmos a maca em segurança.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-[#8C4E43] text-lg mt-0.5">✓</span>
                <div>
                  <strong>Ambiente tranquilo:</strong> Ideal que seja um ambiente com temperatura agradável e pouca circulação para o seu relaxamento.
                </div>
              </li>
              <li className="flex gap-3">
                <span className="text-[#8C4E43] text-lg mt-0.5">✓</span>
                <div>
                  <strong>Pets e Crianças:</strong> Somos totalmente adaptáveis. Entendemos a rotina com recém-nascidos e o atendimento é humanizado (pausas para amamentação são comuns).
                </div>
              </li>
            </ul>
          </div>
        </section>
      </main>
      <WhatsAppFab />
    </div>
  );
}
