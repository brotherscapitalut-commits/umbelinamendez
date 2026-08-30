import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { SITE, waLink, type ServicePlan } from "@/lib/site";
import { loadServices, useServices } from "@/lib/services-store";
import { useMedia } from "@/lib/media-store";
import { trackClick } from "@/lib/tracking";
import { FAQAccordion } from "@/components/faq";
import { pageSchemaScripts } from "@/lib/schema";
import { LeadForm } from "@/components/lead-form";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { Logo } from "@/components/logo";
import { Depoimentos } from "@/components/depoimentos";


export const Route = createFileRoute("/servicos/$slug")({
  head: ({ params }) => {
    const services = loadServices();
    const s = services.find((x) => x.slug === params.slug);
    if (!s)
      return {
        meta: [
          { title: "Tratamento não encontrado — Umbelina Mendez" },
          { name: "robots", content: "noindex" },
        ],
      };
    const title = `${s.title} em Brasília — Dra. Umbelina Mendez | Asa Norte DF`;
    return {
      meta: [
        { title },
        { name: "description", content: `${s.desc} Agende sua avaliação com a Dra. Umbelina Mendez na Asa Norte ou em Domicílio no DF.` },
        {
          name: "keywords",
          content: `${s.title} Brasília, ${s.title} Asa Norte, ${s.title} DF, estética avançada Brasília, Método Reviva DF, Dra Umbelina Mendez`,
        },
        { property: "og:title", content: title },
        { property: "og:description", content: s.desc },
        { property: "og:type", content: "article" },
        { property: "og:locale", content: "pt_BR" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "geo.region", content: "BR-DF" },
        { name: "geo.placename", content: "Brasília" },
        { name: "geo.position", content: "-15.7594;-47.8864" },
        { name: "ICBM", content: "-15.7594, -47.8864" },
      ],
      links: [{ rel: "canonical", href: `/servicos/${s.slug}` }],
      scripts: pageSchemaScripts({
        path: `/servicos/${s.slug}`,
        name: title,
        description: s.desc,
        type: "MedicalWebPage",
        service: s,
        faqs: s.faqs,
        breadcrumbs: [
          { name: "Início", path: "/" },
          { name: "Tratamentos", path: "/tratamentos" },
          { name: s.title, path: `/servicos/${s.slug}` },
        ],
      }),
    };
  },
  loader: ({ params }) => {
    const services = loadServices();
    const s = services.find((x) => x.slug === params.slug);
    if (!s) throw notFound();
    return { service: s };
  },
  component: ServicePage,
  notFoundComponent: () => (
    <div className="p-16 text-center bg-[#F9F4F0] min-h-screen flex flex-col items-center justify-center">
      <h1 className="font-serif text-3xl font-semibold text-[#2D2322]">Tratamento não encontrado</h1>
      <p className="mt-2 text-sm text-[#6E5A56]">O tratamento procurado pode ter sido atualizado.</p>
      <Link
        to="/tratamentos"
        className="mt-6 inline-flex rounded-full bg-[#A86558] text-white px-6 py-2.5 text-xs font-semibold"
      >
        Ver Todos os Tratamentos
      </Link>
    </div>
  ),
});

function ServicePage() {
  const { slug } = Route.useParams();
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

  const service = services.find((s) => s.slug === slug) ?? services[0];
  const img = IMAGES[service?.slug || ""] ?? media.heroImg;
  const wa = waLink(
    `Olá, Dra. Umbelina! Tenho interesse em agendar o tratamento: *${service?.title || ""}*. Podemos conversar sobre horários?`,
    "servico_page",
    service?.slug || ""
  );

  if (!service) return null;

  return (
    <div className="min-h-screen bg-[#F9F4F0] text-[#2D2322]">
      {/* Top Header */}
      <header className="border-b border-[#E8D8D0] backdrop-blur-md bg-[#F9F4F0]/90 sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            <Link
              to="/tratamentos"
              className="text-xs uppercase tracking-wider text-[#6E5A56] hover:text-[#A86558] font-medium"
            >
              Todos os Tratamentos
            </Link>
            <Link
              to="/agendamento"
              className="rounded-full bg-[#A86558] text-white px-5 py-2 text-xs font-semibold hover:bg-[#8C4E43] shadow-sm transition"
            >
              Agendar Avaliação
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Section */}
      <section className="mx-auto max-w-6xl px-6 py-14 md:py-20 grid md:grid-cols-12 gap-12 items-start">
        <div className="md:col-span-7">
          <nav className="text-xs uppercase tracking-widest text-[#6E5A56]">
            <Link to="/" className="hover:text-[#A86558]">Início</Link>
            <span className="mx-2 text-[#E8D8D0]">/</span>
            <Link to="/tratamentos" className="hover:text-[#A86558]">Tratamentos</Link>
            <span className="mx-2 text-[#E8D8D0]">/</span>
            <span className="text-[#A86558] font-semibold">{service.title}</span>
          </nav>

          <h1
            data-speakable
            className="mt-5 font-serif text-3xl sm:text-4xl md:text-5xl text-[#2D2322] font-semibold leading-tight"
          >
            {service.title} <em className="text-[#A86558] italic font-normal">em Brasília — DF</em>
          </h1>
          <p data-speakable className="mt-4 text-base text-[#6E5A56] font-medium leading-relaxed">
            {service.short}
          </p>

          <div data-speakable className="mt-8 space-y-4 text-xs md:text-sm text-[#6E5A56] leading-relaxed">
            {service.long.map((p: string, i: number) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Destaques e Benefícios */}
          <div className="mt-10 p-6 rounded-3xl bg-white border border-[#E8D8D0] shadow-sm">
            <h2 className="font-serif text-2xl text-[#2D2322] font-semibold">Diferenciais Clínicos & Benefícios</h2>
            <ul className="mt-4 grid sm:grid-cols-2 gap-3 text-xs md:text-sm text-[#2D2322]">
              {service.bullets.map((b: string) => (
                <li key={b} className="flex items-start gap-2.5">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#A86558] shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Planos e Modalidades (se houver) */}
          {service.plans && service.plans.length > 0 && (
            <div className="mt-10">
              <h2 className="font-serif text-2xl text-[#2D2322] font-semibold">Planos & Modalidades Recomendadas</h2>
              <div className="mt-4 grid sm:grid-cols-3 gap-4">
                {service.plans.map((plan: ServicePlan) => (
                  <div
                    key={plan.name}
                    className="p-5 rounded-2xl bg-white border border-[#E8D8D0] flex flex-col justify-between shadow-sm"
                  >
                    <div>
                      {plan.badge && (
                        <span className="inline-block rounded-full bg-[#F4EAE4] text-[#A86558] text-[10px] uppercase tracking-wider font-semibold px-2.5 py-0.5 mb-2">
                          {plan.badge}
                        </span>
                      )}
                      <h3 className="font-serif text-lg font-bold text-[#2D2322]">{plan.name}</h3>
                      <p className="mt-1 text-xs text-[#6E5A56]">{plan.description}</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#F2E7E1]">
                      <div className="font-serif text-xl font-bold text-[#2D2322]">
                        {plan.priceFormatted || (plan.price ? `R$ ${plan.price.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "Sob Consulta")}
                      </div>
                      {plan.paymentInfo && (
                        <span className="text-[10px] text-[#6E5A56] block mt-0.5">{plan.paymentInfo}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Indicações Clínicas */}
          <div className="mt-10 p-6 rounded-3xl bg-[#FDFBF9] border border-[#E8D8D0]">
            <h2 className="font-serif text-xl text-[#2D2322] font-semibold">Para quem este tratamento é indicado?</h2>
            <ul className="mt-3 space-y-2 text-xs md:text-sm text-[#6E5A56]">
              {service.indications.map((ind: string) => (
                <li key={ind} className="flex items-center gap-2">
                  <span className="text-[#A86558]">✓</span>
                  <span>{ind}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* FAQs Específicas do Tratamento */}
          {service.faqs && service.faqs.length > 0 && (
            <div className="mt-12">
              <h2 className="font-serif text-2xl text-[#2D2322] font-semibold">Dúvidas Frequentes sobre {service.title}</h2>
              <div className="mt-4">
                <FAQAccordion items={service.faqs} idBase={service.slug} />
              </div>
            </div>
          )}
        </div>

        {/* Sidebar / CTA de Agendamento */}
        <div className="md:col-span-5 sticky top-24 space-y-6">
          <div className="rounded-3xl overflow-hidden border border-[#E8D8D0] bg-white shadow-sm">
            <img
              src={img}
              alt={`${service.title} — Dra. Umbelina Mendez em Brasília DF`}
              width={600}
              height={400}
              className="w-full h-56 object-cover"
              loading="lazy"
            />
            <div className="p-6">
              <h3 className="font-serif text-xl font-bold text-[#2D2322]">
                Agende sua Avaliação Personalizada
              </h3>
              <p className="mt-2 text-xs text-[#6E5A56] leading-relaxed">
                Atendimento presencial no consultório na Asa Norte (SEPN 513) ou domiciliar no Distrito Federal.
              </p>

              <div className="mt-6 space-y-2.5">
                <Link
                  to="/agendamento"
                  className="w-full inline-flex items-center justify-center rounded-full bg-[#A86558] text-white py-3 text-xs font-semibold hover:bg-[#8C4E43] shadow-[0_4px_14px_rgba(168,101,88,0.25)] transition"
                >
                  Agendar com Bloqueio de Horário →
                </Link>
                <a
                  href={wa}
                  target="_blank"
                  rel="noreferrer"
                  onClick={trackClick("servico_wa_sidebar", { service: service.slug })}
                  className="w-full inline-flex items-center justify-center rounded-full border border-[#E8D8D0] bg-[#FDFBF9] py-2.5 text-xs font-semibold text-[#2D2322] hover:bg-white transition"
                >
                  Falar Diretamente no WhatsApp
                </a>
              </div>
            </div>
          </div>

          <LeadForm defaultService={service.slug} />
        </div>
      </section>

      {/* Depoimentos */}
      <Depoimentos 
        filterKeyword={
          service.slug.includes("pos") ? "pós" : undefined
        } 
      />

      <WhatsAppFab />
    </div>
  );
}
