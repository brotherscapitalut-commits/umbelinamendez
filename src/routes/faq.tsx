import { createFileRoute, Link } from "@tanstack/react-router";
import { GENERAL_FAQS, SERVICES } from "@/lib/site";
import { FAQAccordion } from "@/components/faq";
import { pageSchemaScripts } from "@/lib/schema";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { Logo } from "@/components/logo";

const ALL_FAQS = [
  ...GENERAL_FAQS,
  ...SERVICES.flatMap((s) => s.faqs.map((f) => ({ ...f, q: `${s.title}: ${f.q}` }))),
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "Central de Dúvidas & Perguntas Frequentes — Dra. Umbelina Mendez | Brasília DF" },
      {
        name: "description",
        content:
          "Tire suas dúvidas sobre Método Reviva™, Conexão Materna (Pós-Parto), Pós-Operatório Cirúrgico e atendimentos na Asa Norte ou em domicílio em Brasília - DF.",
      },
      { property: "og:title", content: "Perguntas Frequentes — Dra. Umbelina Mendez" },
      { property: "og:description", content: "Dúvidas frequentes sobre tratamentos e atendimentos em Brasília." },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "geo.region", content: "BR-DF" },
      { name: "geo.placename", content: "Brasília" },
      { name: "geo.position", content: "-15.7594;-47.8864" },
      { name: "ICBM", content: "-15.7594, -47.8864" },
    ],
    links: [{ rel: "canonical", href: "/faq" }],
    scripts: pageSchemaScripts({
      path: "/faq",
      name: "Perguntas Frequentes — Dra. Umbelina Mendez",
      description:
        "Dúvidas frequentes sobre Método Reviva, Conexão Materna e Pós-Operatório em Brasília.",
      type: "FAQPage",
      faqs: ALL_FAQS,
      breadcrumbs: [
        { name: "Início", path: "/" },
        { name: "FAQ", path: "/faq" },
      ],
    }),
  }),
  component: FAQPage,
});

function FAQPage() {
  return (
    <div className="min-h-screen bg-[#F9F4F0] text-[#2D2322]">
      <header className="border-b border-[#E8D8D0] backdrop-blur-md bg-[#F9F4F0]/90 sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            <Link
              to="/tratamentos"
              className="text-xs uppercase tracking-wider text-[#6E5A56] hover:text-[#A86558] font-medium"
            >
              Tratamentos
            </Link>
            <Link
              to="/agendamento"
              className="rounded-full bg-[#A86558] text-white px-5 py-2 text-xs font-semibold hover:bg-[#8C4E43] shadow-sm transition"
            >
              Agendar Consulta
            </Link>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <span className="text-xs uppercase tracking-[0.25em] text-[#A86558] font-semibold">
          Central de Dúvidas & Guia Clínico
        </span>
        <h1
          data-speakable
          className="mt-4 font-serif text-3xl sm:text-5xl md:text-6xl text-[#2D2322] font-semibold leading-[1.08]"
        >
          Perguntas <em className="text-[#A86558] italic font-normal">Frequentes</em>.
        </h1>
        <p data-speakable className="mt-4 text-xs md:text-sm text-[#6E5A56] leading-relaxed">
          Reunimos as respostas para as principais dúvidas sobre nossos métodos, segurança clínica e rotina de atendimento na Asa Norte e em Domicílio no Distrito Federal.
        </p>

        <div className="mt-12 space-y-10">
          <div>
            <h2 className="font-serif text-2xl text-[#2D2322] font-semibold mb-4">Sobre o Atendimento & Clínica na Asa Norte</h2>
            <FAQAccordion items={GENERAL_FAQS} idBase="geral" />
          </div>
          {SERVICES.map((s) => (
            <div key={s.slug} id={s.slug}>
              <h2 className="font-serif text-2xl text-[#2D2322] font-semibold mb-4">{s.title}</h2>
              <FAQAccordion items={s.faqs} idBase={s.slug} />
            </div>
          ))}
        </div>
      </section>

      <WhatsAppFab />
    </div>
  );
}
