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
            className="rounded-full bg-[#A86558] text-white px-5 py-2 text-xs font-semibold hover:bg-[#8C4E43] shadow-sm transition"
          >
            Agendar Consulta
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <span className="text-xs uppercase tracking-[0.25em] text-[#A86558] font-semibold">
          Catálogo Oficial de Protocolos & Métodos
        </span>
        <h1
          data-speakable
          className="mt-4 font-serif text-3xl sm:text-5xl md:text-6xl text-[#2D2322] font-semibold leading-[1.08]"
        >
          Cuidados com <em className="text-[#A86558] italic font-normal">base científica</em> em Brasília — DF.
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
              className="group bg-white rounded-3xl overflow-hidden border border-[#E8D8D0] hover:-translate-y-1.5 transition-all duration-500 block"
              style={{ boxShadow: "0 10px 30px rgba(168, 101, 88, 0.06)" }}
            >
              <div className="overflow-hidden h-56">
                <img
                  src={IMAGES[s.slug] ?? media.heroImg}
                  alt={`${s.title} — Dra. Umbelina Mendez Brasília DF`}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="p-6">
                <div className="text-[11px] uppercase tracking-wider text-[#A86558] font-semibold">
                  {s.short}
                </div>
                <h2 className="mt-2 font-serif text-2xl text-[#2D2322] font-semibold">{s.title}</h2>
                <p className="mt-2.5 text-xs text-[#6E5A56] leading-relaxed line-clamp-3">{s.desc}</p>
                <span className="mt-5 inline-block text-xs font-semibold text-[#A86558] group-hover:underline underline-offset-4">
                  Ver protocolo e detalhes →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <WhatsAppFab />
    </div>
  );
}
