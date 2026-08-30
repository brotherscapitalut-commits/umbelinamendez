import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useServices } from "@/lib/services-store";
import { useMedia } from "@/lib/media-store";

import { SITE, GENERAL_FAQS, waLink } from "@/lib/site";
import { loadSeo } from "@/lib/seo-store";
import { trackClick } from "@/lib/tracking";
import { FAQAccordion, faqJsonLd } from "@/components/faq";
import { pageSchemaScripts } from "@/lib/schema";
import { LeadForm } from "@/components/lead-form";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { PromoBar } from "@/components/promo-bar";
import { Promotions } from "@/components/promotions";
import { Logo } from "@/components/logo";
import { MetodoRevivaSection } from "@/components/metodo-reviva-section";
import { BeautyTechDaySection } from "@/components/beauty-tech-day-section";

export const Route = createFileRoute("/")({
  head: () => {
    const seo = loadSeo();
    return {
      meta: [
        { title: seo.title },
        { name: "description", content: seo.description },
        {
          name: "keywords",
          content:
            "Umbelina Mendez, Bióloga Esteta Brasília, Método Reviva Brasília, Conexão Materna pós parto Brasília, drenagem pós parto domiciliar DF, pós operatório cirurgia plástica Asa Norte, Criolipólise placas Brasília, Beauty Tech Day Brasília",
        },
        { property: "og:title", content: seo.title },
        { property: "og:description", content: seo.description },
        { property: "og:locale", content: "pt_BR" },
        { property: "og:type", content: "website" },
        { name: "geo.region", content: seo.region },
        { name: "geo.placename", content: seo.city },
        { name: "geo.position", content: "-15.7594;-47.8864" },
        { name: "ICBM", content: "-15.7594, -47.8864" },
      ],
      links: [{ rel: "canonical", href: "/" }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(faqJsonLd(HOME_FAQS)),
        },
        ...pageSchemaScripts({
          path: "/",
          name: seo.title,
          description: seo.description,
          type: "WebPage",
          breadcrumbs: [{ name: "Início", path: "/" }],
        }),
      ],
    };
  },
  component: Index,
});

const authorityBadges = [
  { n: "20+ Anos", l: "de Experiência Clínica e Biológica" },
  { n: "10+ Anos", l: "Especialista em Recuperação Pós-Parto" },
  { n: "3.000+", l: "Mulheres Cuidadas com Método Próprio" },
  { n: "DF Completo", l: "Atendimento Clínico, Domiciliar e Hospitalar" },
];

const HOME_FAQS = [
  {
    q: "O que é o Método Reviva™ desenvolvido pela Dra. Umbelina Mendez?",
    a: "O Método Reviva™ é um acompanhamento corporal contínuo e estratégico que associa drenagem linfática biológica com tecnologias integradas (Radiofrequência, Criofrequência, Ultrassom de Alta Potência, Crioterapia e Eletroterapia). Focado em constância, redução de retenção e evolução do contorno corporal.",
  },
  {
    q: "Como funciona o Beauty Tech Day na clínica?",
    a: "O Beauty Tech Day é um evento premium com horários agendados e limitados, dedicado à Criolipólise de Placas (sem sucção), Lavier e Depilação a Laser definitiva com condições promocionais exclusivas na Asa Norte.",
  },
  {
    q: "Como funciona o programa Conexão Materna para pós-parto?",
    a: "O Conexão Materna atende puérperas no hospital ou em domicílio no DF. Aplicamos Laserterapia na cicatriz (cesárea ou parto normal), Laser ILIB para regulação sistêmica, Taping Linfático e drenagem suave com absoluto respeito ao ritmo da mãe e do bebê.",
  },
  {
    q: "Onde fica o consultório da Dra. Umbelina Mendez em Brasília?",
    a: "Nosso consultório está localizado na SEPN 513, Edifício Bittar I, Sala 110 — Asa Norte, Brasília - DF, 70768-900. Dispomos também de atendimento domiciliar e hospitalar em todo o Distrito Federal.",
  },
];

const LOCAL_BUSINESS_JSONLD = {
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  name: "Clínica Umbelina Mendez - Bióloga Esteta",
  image: `${SITE.url}/og.jpg`,
  description:
    "Especialista no Método Reviva™, Conexão Materna (Pós-Parto), Pós-Operatório Cirúrgico e Estética Avançada na Asa Norte, Brasília - DF.",
  url: SITE.url,
  telephone: `+${SITE.whatsapp}`,
  email: SITE.email,
  priceRange: "$$$",
  address: {
    "@type": "PostalAddress",
    streetAddress: "SEPN 513, Edifício Bittar I, Sala 110",
    addressLocality: "Brasília",
    addressRegion: "DF",
    postalCode: "70768-900",
    addressCountry: "BR",
  },
  geo: { "@type": "GeoCoordinates", latitude: -15.7594, longitude: -47.8864 },
  areaServed: [
    { "@type": "City", name: "Brasília" },
    { "@type": "AdministrativeArea", name: "Distrito Federal" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "08:00",
      closes: "19:00",
    },
  ],
  sameAs: [SITE.instagram],
};

function Index() {
  const services = useServices();
  const media = useMedia();

  return (
    <div className="min-h-screen bg-[#F9F4F0] text-[#2D2322]">
      <PromoBar />
      <Nav />
      <Hero services={services} media={media} />
      <AuthorityBadgesSection />
      <MetodoRevivaSection />
      <BeautyTechDaySection />
      <Promotions />
      <About media={media} />
      <ServicesGridSection services={services} media={media} />
      <Process />
      <BeforeAfterSection media={media} />
      <TestimonialsSection />
      <FAQSection />
      <ContactSection />
      <Footer />
      <WhatsAppFab />
    </div>
  );
}

function Nav() {
  const links = [
    { href: "#metodo-reviva", label: "Método Reviva™" },
    { href: "#beauty-tech-day", label: "Beauty Tech Day" },
    { href: "#promocoes", label: "Campanhas" },
    { href: "#sobre", label: "Sobre a Dra. Umbelina" },
    { href: "#tratamentos", label: "Tratamentos" },
    { href: "#depoimentos", label: "Resultados" },
    { href: "/blog", label: "Blog" },
    { href: "#faq", label: "Dúvidas" },
    { href: "#contato", label: "Contato" },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[#F9F4F0]/85 border-b border-[#E8D8D0]/70 transition-all">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between gap-4">
        <Logo size="md" />

        <nav className="hidden lg:flex items-center gap-7 text-xs uppercase tracking-widest text-[#6E5A56] font-medium">
          {links.map((l) => (
            l.href.startsWith("#") ? (
              <a key={l.href} href={l.href} className="hover:text-[#A86558] transition-colors">
                {l.label}
              </a>
            ) : (
              <Link key={l.href} to={l.href as any} className="hover:text-[#A86558] transition-colors">
                {l.label}
              </Link>
            )
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            to="/agendamento"
            onClick={trackClick("nav_agendar")}
            className="inline-flex items-center justify-center rounded-full bg-[#A86558] text-white px-5 py-2.5 text-xs font-semibold tracking-wide hover:bg-[#8C4E43] shadow-[0_4px_14px_rgba(168,101,88,0.22)] transition-all"
          >
            Agendar Consulta
          </Link>
        </div>
      </div>
    </header>
  );
}

function Hero({ services, media }: { services: any[]; media: any }) {
  const seo = loadSeo();
  const [selectedService, setSelectedService] = useState<string>(services[0]?.slug || "");
  const currentService = services.find((s) => s.slug === selectedService) ?? services[0];
  const wa = waLink(
    `Olá, Dra. Umbelina! Gostaria de agendar uma avaliação para o tratamento: *${currentService?.title || ""}*.`,
    "hero_whatsapp",
    selectedService
  );

  return (
    <section id="top" className="relative overflow-hidden pt-8 pb-20 md:pt-16 md:pb-28">
      {/* Luzes difusas Rose Gold */}
      <div
        className="absolute inset-0 -z-10 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 15% 15%, rgba(183, 110, 121, 0.14) 0%, transparent 60%), radial-gradient(ellipse at 85% 85%, rgba(168, 101, 88, 0.1) 0%, transparent 60%), #F9F4F0",
        }}
      />

      <div className="mx-auto max-w-6xl px-6 grid md:grid-cols-12 gap-12 items-center">
        <div className="md:col-span-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#E8D8D0] bg-white/80 backdrop-blur px-3.5 py-1 text-xs uppercase tracking-[0.25em] text-[#A86558] font-medium shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#A86558]" />
            BIÓLOGA ESTETA • ASA NORTE, BRASÍLIA
          </div>

          <h1 
            className="mt-6 font-serif text-4xl sm:text-5xl md:text-6xl leading-[1.1] text-[#2D2322] font-semibold"
          >
            Pós-Operatório e Drenagem Linfática em Brasília
          </h1>

          <p className="mt-6 text-base md:text-lg text-[#6E5A56] max-w-xl leading-relaxed">
            Recuperação de cirurgia plástica, pós-parto e lipedema com drenagem linfática especializada, laserterapia e protocolo individualizado, Método Reviva™, na Asa Norte – Brasília.
          </p>

          {/* Card Seletor de Avaliação Rápida */}
          <div
            className="mt-8 bg-white border border-[#E8D8D0] rounded-3xl p-5 md:p-6 max-w-xl"
            style={{ boxShadow: "0 12px 36px rgba(168, 101, 88, 0.08)" }}
          >
            <label className="text-xs uppercase tracking-[0.2em] text-[#6E5A56] font-semibold block">
              Qual cuidado você busca hoje?
            </label>
            <div className="mt-3 flex flex-col sm:flex-row gap-3">
              <select
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
                className="flex-1 rounded-xl border border-[#E8D8D0] bg-[#FDFBF9] px-4 py-3 text-sm text-[#2D2322] outline-none focus:ring-2 focus:ring-[#A86558]/60 transition"
              >
                {services.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.title}
                  </option>
                ))}
              </select>
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                onClick={trackClick("hero_whatsapp", { service: selectedService })}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#A86558] text-white px-6 py-3 text-xs font-semibold tracking-wide hover:bg-[#8C4E43] shadow-[0_4px_14px_rgba(168,101,88,0.25)] transition shrink-0"
              >
                <svg viewBox="0 0 32 32" width="18" height="18" fill="currentColor" aria-hidden="true">
                  <path d="M19.11 17.37c-.28-.14-1.65-.81-1.9-.9-.26-.09-.44-.14-.63.14-.19.28-.72.9-.88 1.09-.16.19-.32.21-.6.07-.28-.14-1.17-.43-2.23-1.38-.82-.73-1.38-1.63-1.54-1.9-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.49.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.63-1.52-.86-2.08-.23-.55-.47-.48-.63-.49h-.54c-.19 0-.49.07-.75.35-.26.28-.98.96-.98 2.34s1 2.72 1.14 2.91c.14.19 1.98 3.02 4.8 4.24.67.29 1.19.46 1.6.59.67.21 1.28.18 1.77.11.54-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.26-.19-.54-.33zM16.02 5.33c-5.87 0-10.65 4.78-10.65 10.65 0 1.87.49 3.7 1.42 5.31L5 27l5.87-1.54c1.55.85 3.31 1.3 5.1 1.3h.01c5.87 0 10.65-4.78 10.65-10.65 0-2.85-1.11-5.52-3.12-7.53a10.61 10.61 0 00-7.49-3.25z" />
                </svg>
                {seo.heroCtaText}
              </a>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-[#6E5A56]">
              <span>Asa Norte (SEPN 513) ou Domiciliar</span>
              <Link
                to="/agendamento"
                onClick={trackClick("hero_agendar")}
                className="text-[#A86558] font-medium underline underline-offset-4 hover:text-[#8C4E43]"
              >
                Formulário completo →
              </Link>
            </div>
          </div>
        </div>

        <div className="md:col-span-5 relative">
          <div
            className="relative rounded-[2.5rem] overflow-hidden border border-[#E8D8D0]"
            style={{ boxShadow: "0 20px 50px -15px rgba(168, 101, 88, 0.16)" }}
          >
            <img
              src={media.heroImg}
              alt="Dra. Umbelina Mendez — Bióloga Esteta em Brasília"
              width={1400}
              height={1400}
              className="w-full h-[500px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2D2322]/50 via-transparent to-transparent" />
          </div>

          <div
            className="absolute -bottom-6 -left-6 bg-white border border-[#E8D8D0] rounded-2xl p-4 max-w-[240px]"
            style={{ boxShadow: "0 10px 30px rgba(168, 101, 88, 0.12)" }}
          >
            <div className="font-serif text-3xl font-bold text-[#A86558]">+3.000</div>
            <div className="text-[11px] text-[#6E5A56] uppercase tracking-wider font-semibold mt-1">
              Mulheres transformadas com segurança biológica
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function AuthorityBadgesSection() {
  return (
    <section className="border-y border-[#E8D8D0] bg-[#F7EFE9]/60">
      <div className="mx-auto max-w-6xl px-6 py-10 grid grid-cols-2 md:grid-cols-4 gap-6">
        {authorityBadges.map((b) => (
          <div key={b.n} className="text-center sm:text-left">
            <div className="font-serif text-3xl md:text-4xl text-[#A86558] font-bold">{b.n}</div>
            <div className="mt-1.5 text-xs text-[#6E5A56] uppercase tracking-wider font-medium leading-tight">
              {b.l}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function About({ media }: { media: any }) {
  return (
    <section id="sobre" className="mx-auto max-w-6xl px-6 py-24 md:py-32 grid md:grid-cols-12 gap-12 items-center">
      <div className="md:col-span-5 order-2 md:order-1">
        <div
          className="relative rounded-[2.5rem] overflow-hidden border border-[#E8D8D0]"
          style={{ boxShadow: "0 20px 50px -15px rgba(168, 101, 88, 0.14)" }}
        >
          <img
            src={media.aboutImg}
            alt="Dra. Umbelina Mendez — Bióloga Esteta"
            width={1000}
            height={1200}
            loading="lazy"
            className="w-full h-[540px] object-cover"
          />
        </div>
      </div>

      <div className="md:col-span-7 order-1 md:order-2">
        <span className="text-xs uppercase tracking-[0.25em] text-[#A86558] font-semibold">
          Autoridade & Fundamentação
        </span>
        <h2 className="mt-4 font-serif text-3xl md:text-5xl leading-tight text-[#2D2322] font-semibold">
          Dra. Umbelina Mendez — <em className="text-[#A86558] italic font-normal">Bióloga Esteta</em>
        </h2>

        <p className="mt-6 text-[#6E5A56] leading-relaxed text-sm md:text-base">
          Bióloga por formação (CRBio) e Esteticista Especialista, a Dra. Umbelina Mendez consolidou sua trajetória através de mais de <strong>20 anos dedicados à biologia do tecido humano</strong>, recuperação pós-parto e pós-operatório cirúrgico de alta precisão em Brasília.
        </p>
        <p className="mt-4 text-[#6E5A56] leading-relaxed text-sm md:text-base">
          Seu método integra tecnologias médicas seguras a uma escuta acolhedora e individualizada, proporcionando às suas pacientes um ambiente de profunda tranquilidade, segurança biológica e resultados duradouros.
        </p>

        <ul className="mt-8 grid sm:grid-cols-2 gap-3.5 text-xs md:text-sm text-[#2D2322]">
          {[
            "Bióloga (CRBio) & Especialista em Estética Avançada",
            "Criadora do Método Reviva™ e Conexão Materna",
            "Mais de 10 anos de atuação em maternidades e pós-parto",
            "Acompanhamento integrado com cirurgiões plásticos",
            "Atendimento no Consultório (Asa Norte) e Domiciliar no DF",
            "+3.000 atendimentos realizados com excelência",
          ].map((i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="mt-1 h-2 w-2 rounded-full bg-[#A86558] shrink-0" />
              <span>{i}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function ServicesGridSection({ services, media }: { services: any[]; media: any }) {
  const IMG: Record<string, string> = {
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
    <section id="tratamentos" className="bg-[#F7EFE9]/50 py-24 md:py-32 border-y border-[#E8D8D0]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.25em] text-[#A86558] font-semibold">
            Portfólio de Cuidados
          </span>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl text-[#2D2322] leading-tight font-semibold">
            Tratamentos e <em className="text-[#A86558] italic font-normal">Protocolos Especiais</em>
          </h2>
          <p className="mt-3 text-[#6E5A56] text-sm md:text-base leading-relaxed">
            Conheça todos os procedimentos clínicos disponíveis em nosso espaço na Asa Norte e em domicílio.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {services.map((s) => (
            <Link
              key={s.slug}
              to="/servicos/$slug"
              params={{ slug: s.slug }}
              className="group bg-white rounded-3xl overflow-hidden border border-[#E8D8D0] hover:-translate-y-1.5 transition-all duration-500 block"
              style={{ boxShadow: "0 10px 30px rgba(168, 101, 88, 0.06)" }}
            >
              {IMG[s.slug] && (
                <div className="overflow-hidden h-52">
                  <img
                    src={IMG[s.slug]}
                    alt={s.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              )}
              <div className="p-6">
                <div className="text-[11px] uppercase tracking-wider text-[#A86558] font-semibold">
                  {s.short}
                </div>
                <h3 className="mt-2 font-serif text-2xl text-[#2D2322] font-semibold">{s.title}</h3>
                <p className="mt-2 text-xs text-[#6E5A56] leading-relaxed line-clamp-2">{s.desc}</p>
                <span className="mt-4 inline-block text-xs font-semibold text-[#A86558] group-hover:underline underline-offset-4">
                  Saiba mais sobre este tratamento →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Process() {
  const steps = [
    { n: "01", t: "Avaliação Biológica", d: "Diagnóstico aprofundado do seu histórico, da sua pele e das suas metas (Dermoscan / Termografia)." },
    { n: "02", t: "Plano Sob Medida", d: "Definição do protocolo ideal e da frequência necessária para o seu corpo ou momento pós-cirúrgico." },
    { n: "03", t: "Sessões Integradas", d: "Execução precisa combinando manobras manuais especializadas e tecnologia de alta performance." },
    { n: "04", t: "Acompanhamento Contínuo", d: "Suporte e monitoramento constante da sua evolução clínica com a Dra. Umbelina." },
  ];

  return (
    <section id="processo" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div className="max-w-2xl">
        <span className="text-xs uppercase tracking-[0.25em] text-[#A86558] font-semibold">
          Metodologia de Atendimento
        </span>
        <h2 className="mt-4 font-serif text-3xl md:text-5xl leading-tight text-[#2D2322] font-semibold">
          Um acompanhamento <em className="text-[#A86558] italic font-normal">estruturado</em> em 4 etapas.
        </h2>
      </div>

      <div className="mt-14 grid sm:grid-cols-2 md:grid-cols-4 gap-8">
        {steps.map((s) => (
          <div key={s.n} className="relative p-6 rounded-2xl bg-white border border-[#E8D8D0] shadow-sm">
            <div className="font-serif text-4xl text-[#A86558] font-bold">{s.n}</div>
            <h3 className="mt-3 font-serif text-xl font-semibold text-[#2D2322]">{s.t}</h3>
            <p className="mt-2 text-xs text-[#6E5A56] leading-relaxed">{s.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function BeforeAfterSection({ media }: { media: any }) {
  const beforeAfter = [
    { title: "Método Reviva™ — 8 semanas de remodelamento corporal", img: media.beforeAfter1 },
    { title: "Conexão Materna — Cicatrização com Laserterapia e ILIB", img: media.beforeAfter2 },
    { title: "Reviva Face™ — Programa de 60 dias de colágeno", img: media.beforeAfter3 },
  ];

  return (
    <section id="antes-depois" className="bg-[#F7EFE9]/60 py-24 md:py-32 border-y border-[#E8D8D0]">
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-[0.25em] text-[#A86558] font-semibold">
            Evoluções Documentadas
          </span>
          <h2 className="mt-4 font-serif text-3xl md:text-5xl text-[#2D2322] font-semibold">
            Resultados reais de quem <em className="text-[#A86558] italic font-normal">vivenciou o método</em>.
          </h2>
          <p className="mt-3 text-xs md:text-sm text-[#6E5A56]">
            Registros clínicos compartilhados mediante autorização. A resposta biológica pode variar de acordo com cada organismo.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {beforeAfter.map((b) => (
            <figure
              key={b.title}
              className="bg-white rounded-3xl overflow-hidden border border-[#E8D8D0] shadow-sm"
            >
              <div className="grid grid-cols-2">
                <div className="relative">
                  <img
                    src={b.img}
                    alt={`Antes — ${b.title}`}
                    loading="lazy"
                    className="w-full h-60 object-cover grayscale"
                  />
                  <span className="absolute top-3 left-3 text-[10px] uppercase tracking-wider bg-white/90 font-semibold text-[#2D2322] rounded-full px-2.5 py-1 shadow-sm">
                    Início
                  </span>
                </div>
                <div className="relative">
                  <img
                    src={b.img}
                    alt={`Depois — ${b.title}`}
                    loading="lazy"
                    className="w-full h-60 object-cover"
                  />
                  <span className="absolute top-3 right-3 text-[10px] uppercase tracking-wider bg-[#A86558] text-white font-semibold rounded-full px-2.5 py-1 shadow-sm">
                    Evolução
                  </span>
                </div>
              </div>
              <figcaption className="p-4 text-xs font-medium text-[#2D2322] text-center border-t border-[#F2E7E1]">
                {b.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Depoimentos } from "@/components/depoimentos";

function TestimonialsSection() {
  return (
    <section id="depoimentos">
      <Depoimentos limit={6} />
    </section>
  );
}

function FAQSection() {
  const items = useMemo(() => [...HOME_FAQS, ...GENERAL_FAQS.slice(0, 3)], []);
  return (
    <section id="faq" className="mx-auto max-w-4xl px-6 py-24 md:py-32 border-t border-[#E8D8D0]">
      <div className="max-w-2xl">
        <span className="text-xs uppercase tracking-[0.25em] text-[#A86558] font-semibold">
          Esclareça suas Dúvidas
        </span>
        <h2 className="mt-4 font-serif text-3xl md:text-5xl leading-tight text-[#2D2322] font-semibold">
          Perguntas <em className="text-[#A86558] italic font-normal">Frequentes</em>.
        </h2>
      </div>

      <div className="mt-10">
        <FAQAccordion items={items} idBase="home-faq" />
      </div>

      <div className="mt-8 text-center sm:text-left">
        <Link to="/faq" className="text-xs uppercase tracking-wider text-[#A86558] font-semibold underline underline-offset-4 hover:text-[#8C4E43]">
          Acessar Central de Dúvidas Completa →
        </Link>
      </div>
    </section>
  );
}

function ContactSection() {
  const wa = waLink("Olá, Dra. Umbelina! Gostaria de agendar uma avaliação na clínica.", "cta_contato");

  return (
    <section id="contato" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <div
        className="rounded-[3rem] p-8 md:p-14 grid md:grid-cols-2 gap-10 items-start border border-[#E8D8D0]"
        style={{
          background: "linear-gradient(135deg, #FFFFFF 0%, #FDFBF9 50%, #F4EAE4 100%)",
          boxShadow: "0 20px 60px rgba(168, 101, 88, 0.1)",
        }}
      >
        <div>
          <span className="text-xs uppercase tracking-[0.25em] text-[#A86558] font-semibold">
            Localização & Contato
          </span>
          <h2 className="mt-3 font-serif text-3xl md:text-5xl leading-tight text-[#2D2322] font-semibold">
            Agende seu momento na <em className="text-[#A86558] italic font-normal">Asa Norte</em>.
          </h2>
          <p className="mt-4 text-xs md:text-sm text-[#6E5A56] leading-relaxed">
            Atendimento exclusivo com hora marcada em nosso consultório ou no conforto do seu domicílio no DF.
          </p>

          <ul className="mt-8 space-y-4 text-xs md:text-sm text-[#2D2322]">
            <li className="p-3.5 rounded-2xl bg-white border border-[#E8D8D0]/80">
              <div className="text-[10px] uppercase tracking-widest text-[#A86558] font-bold">
                WhatsApp Oficial
              </div>
              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                onClick={trackClick("contato_whatsapp")}
                className="mt-1 block font-serif text-xl font-semibold text-[#2D2322] hover:text-[#A86558] transition"
              >
                {SITE.whatsappDisplay}
              </a>
            </li>

            <li className="p-3.5 rounded-2xl bg-white border border-[#E8D8D0]/80">
              <div className="text-[10px] uppercase tracking-widest text-[#A86558] font-bold">
                Endereço Físico
              </div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(SITE.mapsQuery)}`}
                target="_blank"
                rel="noreferrer"
                className="mt-1 block text-xs md:text-sm text-[#2D2322] hover:text-[#A86558] font-medium"
              >
                {SITE.address}
              </a>
            </li>

            <li className="p-3.5 rounded-2xl bg-white border border-[#E8D8D0]/80">
              <div className="text-[10px] uppercase tracking-widest text-[#A86558] font-bold">
                Horário de Atendimento
              </div>
              <div className="mt-1 text-xs md:text-sm text-[#2D2322]">{SITE.hours}</div>
            </li>

            <li className="p-3.5 rounded-2xl bg-white border border-[#E8D8D0]/80">
              <div className="text-[10px] uppercase tracking-widest text-[#A86558] font-bold">
                Instagram Oficial
              </div>
              <a
                href={SITE.instagram}
                target="_blank"
                rel="noreferrer"
                onClick={trackClick("contato_instagram")}
                className="mt-1 block text-xs md:text-sm text-[#A86558] font-semibold hover:underline"
              >
                {SITE.instagramHandle}
              </a>
            </li>
          </ul>
        </div>

        <LeadForm />
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-[#E8D8D0] bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#6E5A56]">
        <Logo size="sm" />

        <div className="flex flex-wrap items-center justify-center gap-6 font-medium">
          <Link to="/tratamentos" className="hover:text-[#A86558] transition">Tratamentos</Link>
          <Link to="/agendamento" className="hover:text-[#A86558] transition">Agendar</Link>
          <Link to="/blog" className="hover:text-[#A86558] transition">Blog</Link>
          <Link to="/faq" className="hover:text-[#A86558] transition">FAQ</Link>
          <Link to="/admin/promocoes" className="hover:text-[#A86558] transition text-[#6E5A56]/60">Painel Admin</Link>
        </div>

        <div className="text-center md:text-right">
          <div>© {new Date().getFullYear()} {SITE.brand}.</div>
          <div className="text-[10px] text-[#6E5A56]/70 mt-1">SEPN 513, Edifício Bittar I, Sala 110 — Asa Norte, Brasília - DF</div>
        </div>
      </div>
    </footer>
  );
}
