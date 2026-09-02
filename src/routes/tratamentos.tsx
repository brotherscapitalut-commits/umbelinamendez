import { createFileRoute, Link } from "@tanstack/react-router";
import { useServices } from "@/lib/services-store";
import { useMedia } from "@/lib/media-store";
import { pageSchemaScripts } from "@/lib/schema";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { Logo } from "@/components/logo";


export const Route = createFileRoute("/tratamentos")({
  head: () => ({
    meta: [
      { title: "Tratamentos de Estética Avançada & Pós-Parto em Brasília — Dra. Umbelina Mendez" },
      {
        name: "description",
        content:
          "Catálogo oficial: Método Reviva™, Reviva Face™, Conexão Materna (Pós-Parto), Pós-Operatório Cirúrgico, Criolipólise 360° e Laserterapia ILIB na Asa Norte e em Domicílio no DF.",
      },
      { property: "og:title", content: "Tratamentos & Métodos — Dra. Umbelina Mendez" },
      {
        property: "og:description",
        content:
          "Todos os tratamentos disponíveis com atendimento personalizado no consultório na Asa Norte (SEPN 513) e em domicílio no Distrito Federal.",
      },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:type", content: "website" },
      { name: "geo.region", content: "BR-DF" },
      { name: "geo.placename", content: "Brasília" },
      { name: "geo.position", content: "-15.7594;-47.8864" },
      { name: "ICBM", content: "-15.7594, -47.8864" },
    ],
    links: [{ rel: "canonical", href: "/tratamentos" }],
    scripts: pageSchemaScripts({
      path: "/tratamentos",
      name: "Tratamentos de Estética Avançada em Brasília — Dra. Umbelina Mendez",
      description:
        "Método Reviva™, Reviva Face™, Conexão Materna, Pós-Operatório e Estética Avançada em Brasília — DF.",
      type: "CollectionPage",
      breadcrumbs: [
        { name: "Início", path: "/" },
        { name: "Tratamentos", path: "/tratamentos" },
      ],
    }),
  }),
  component: TreatmentsPage,
});

function TreatmentsPage() {
  const services = useServices();
  const media = useMedia();

  const IMAGES: Record<string, string> = {
    "metodo-reviva": media.heroImg,
    "reviva-face": media.aboutImg,
    "conexao-materna": media.posPartoImg,
    "pos-operatorio": media.posopImg,
    "beauty-tech-day": media.heroImg,
    "laserterapia-ilib": media.aboutImg,
    "drenagem-linfatica": media.gestanteImg,
    flacidez: media.heroImg,
  };

  return (
    <div className="min-h-screen bg-[#F9F4F0] text-[#2D2322]">
      <header className="border-b border-[#E8D8D0] backdrop-blur-md bg-[#F9F4F0]/90 sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <Link
            to="/agendamento"
            className="rounded-full bg-[#8C4E43] text-white px-5 py-2 text-xs font-semibold hover:bg-[#8C4E43] shadow-sm transition"
          >
            Agendar Consulta
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <span className="text-xs uppercase tracking-[0.25em] text-[#8C4E43] font-semibold">
          Catálogo Oficial de Protocolos & Métodos
        </span>
        <h1
          data-speakable
          className="mt-4 font-serif text-3xl sm:text-5xl md:text-6xl text-[#2D2322] font-semibold leading-[1.08]"
        >
          Cuidados com <em className="text-[#8C4E43] italic font-normal">base científica</em> em Brasília — DF.
        </h1>
        <p data-speakable className="mt-5 text-sm md:text-base text-[#6E5A56] max-w-2xl leading-relaxed">
          Protocolos personalizados combinando biologia tecidual, manobras precisas e tecnologia de ponta no consultório na Asa Norte (SEPN 513) ou no conforto da sua residência no Distrito Federal.
        </p>

        <div className="mt-14 grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {services.map((s) => (
            <Link
              key={s.slug}
              to="/servicos/$slug"
              params={{ slug: s.slug }}
              className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-[#E8D8D0] hover:-translate-y-1 transition duration-500"
              style={{ boxShadow: "0 10px 30px rgba(168, 101, 88, 0.05)" }}
            >
              <div className="relative h-48 sm:h-56 w-full bg-[#F4EAE4] overflow-hidden">
                <img
                  src={IMAGES[s.slug]}
                  alt={s.title}
                  className="w-full h-full object-cover transition duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="text-[10px] uppercase tracking-wider text-[#8C4E43] font-semibold">
                  {s.category}
                </div>
                <h2 className="mt-2 text-lg font-serif font-bold text-[#2D2322] leading-snug">
                  {s.title}
                </h2>
                <p className="mt-2 text-sm text-[#6E5A56] line-clamp-3">
                  {s.desc}
                </p>
                <div className="mt-auto pt-6 flex items-center justify-between border-t border-[#E8D8D0]/50">
                  <span className="text-xs font-semibold text-[#8C4E43] group-hover:underline underline-offset-4">
                    Detalhes do Protocolo →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <WhatsAppFab />
    </div>
  );
}
