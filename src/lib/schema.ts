import { SITE, SERVICES, type Service, type ServicePlan } from "./site";
import { type BlogPost } from "./blog";

const BASE = SITE.url.replace(/\/$/, "");

export function absoluteUrl(path: string): string {
  if (!path) return BASE + "/";
  if (path.startsWith("http")) return path;
  return `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export type Crumb = { name: string; path: string };

/**
 * 1. SCHEMA GRAPH GLOBAL (ORGANIZAÇÃO, LOCALBUSINESS, PESSOA & WEBSITE)
 * Otimizado para Google Knowledge Graph, Perplexity AI, ChatGPT Search, Apple Intelligence e Gemini.
 */
export function getGlobalEntityGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      // ENTIDADE 1: WEBSITE
      {
        "@type": "WebSite",
        "@id": `${BASE}/#website`,
        url: `${BASE}/`,
        name: "Umbelina Mendez — Bióloga Esteta",
        alternateName: [
          "Dra. Umbelina Mendez",
          "Método Reviva Brasília",
          "Conexão Materna Pós-Parto DF",
          "Clínica de Estética Avançada Asa Norte",
        ],
        description:
          "Clínica de Estética Avançada e Biologia Tecidual em Brasília - DF. Criadora do Método Reviva™ e do programa Conexão Materna.",
        inLanguage: "pt-BR",
        publisher: { "@id": `${BASE}/#organization` },
      },

      // ENTIDADE 2: HEALTH & BEAUTY / MEDICAL BUSINESS (LOCAL BUSINESS)
      {
        "@type": ["HealthAndBeautyBusiness", "MedicalBusiness", "LocalBusiness"],
        "@id": `${BASE}/#organization`,
        name: "Clínica Umbelina Mendez — Bióloga Esteta",
        alternateName: "Umbelina Mendez Estética Avançada",
        url: `${BASE}/`,
        logo: {
          "@type": "ImageObject",
          "@id": `${BASE}/#logo`,
          url: `${BASE}/logo.svg`,
          caption: "Umbelina Mendez — Bióloga Esteta",
        },
        image: `${BASE}/hero.jpg`,
        telephone: "+5561981567985",
        email: SITE.email,
        priceRange: "$$$",
        currenciesAccepted: "BRL",
        paymentAccepted: "Pix, Cartão de Crédito, Cartão de Débito, Transferência Bancária",
        address: {
          "@type": "PostalAddress",
          streetAddress: "SQN 513 Bloco A, Edifício Bittar 1, Sala 110",
          addressLocality: "Brasília",
          addressRegion: "DF",
          postalCode: "70763-510",
          addressCountry: "BR",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: -15.7594,
          longitude: -47.8864,
        },
        areaServed: [
          { "@type": "City", name: "Brasília" },
          { "@type": "AdministrativeArea", name: "Asa Norte" },
          { "@type": "AdministrativeArea", name: "Asa Sul" },
          { "@type": "AdministrativeArea", name: "Lago Sul" },
          { "@type": "AdministrativeArea", name: "Lago Norte" },
          { "@type": "AdministrativeArea", name: "Sudoeste" },
          { "@type": "AdministrativeArea", name: "Noroeste" },
          { "@type": "AdministrativeArea", name: "Águas Claras" },
          { "@type": "AdministrativeArea", name: "Distrito Federal" },
        ],
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            opens: "08:00",
            closes: "18:00",
          },
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Saturday"],
            opens: "08:00",
            closes: "13:00",
          },
        ],
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "4.9",
          reviewCount: "185",
          bestRating: "5",
          worstRating: "1",
        },
        founder: { "@id": `${BASE}/#person` },
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Portfólio de Tratamentos Oficiais",
          itemListElement: SERVICES.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              name: s.title,
              description: s.desc,
              url: absoluteUrl(`/servicos/${s.slug}`),
            },
          })),
        },
      },

      // ENTIDADE 3: PERSON (DRA. UMBELINA MENDEZ)
      {
        "@type": "Person",
        "@id": `${BASE}/#person`,
        name: "Dra. Umbelina Mendez",
        alternateName: "Umbelina Mendez",
        jobTitle: "Bióloga Esteta & Especialista em Recuperação Pós-Parto",
        description:
          "Bióloga por formação (CRBio) e Esteticista com mais de 20 anos de experiência clínica. Criadora do Método Reviva™ e do programa Conexão Materna para o Distrito Federal.",
        url: `${BASE}/`,
        worksFor: { "@id": `${BASE}/#organization` },
        knowsAbout: [
          "Biologia Tecidual e Fisiologia Dérmica",
          "Método Reviva™ (Acompanhamento Corporal Contínuo)",
          "Reviva Face™ (Rejuvenescimento Facial 60 Dias)",
          "Conexão Materna (Recuperação Pós-Parto)",
          "Laserterapia de Baixa Intensidade e Protocolo ILIB",
          "Drenagem Linfática Manual Especializada",
          "Pós-Operatório de Cirurgia Plástica",
          "Criolipólise de Placas 360°",
          "Radiofrequência Multipolar",
        ],
      },
    ],
  };
}

/**
 * 2. BREADCRUMBLIST SCHEMA
 */
export function breadcrumbJsonLd(items: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

/**
 * 3. SCHEMA DE PÁGINA (COM SPEAKABLE PARA GEO/AEO & ASSISTENTES DE VOZ)
 */
export function webPageJsonLd(opts: {
  path: string;
  name: string;
  description: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "FAQPage" | "CollectionPage" | "ItemPage" | "MedicalWebPage";
  breadcrumbs?: Crumb[];
  inLanguage?: string;
  primaryImage?: string;
}) {
  const url = absoluteUrl(opts.path);
  const node: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": opts.type ?? "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: opts.name,
    description: opts.description,
    inLanguage: opts.inLanguage ?? "pt-BR",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${BASE}/#website`,
    },
    about: { "@id": `${BASE}/#organization` },
    // AEO (Answer Engine Optimization) & Voice Search
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["[data-speakable]", "h1", "h2", ".hero-description"],
    },
  };
  if (opts.primaryImage) {
    node.primaryImageOfPage = {
      "@type": "ImageObject",
      url: absoluteUrl(opts.primaryImage),
    };
  }
  if (opts.breadcrumbs && opts.breadcrumbs.length > 0) {
    node.breadcrumb = { "@id": `${url}#breadcrumbs` };
  }
  return node;
}

/**
 * 4. FAQPAGE SCHEMA PARA GOOGLE RICH SNIPPETS & RESPOSTAS DIRETAS POR IA
 */
export function faqPageJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}

/**
 * 5. MEDICAL PROCEDURE / SERVICE SCHEMA (SERVIÇOS & MÉTODOS)
 */
export function serviceJsonLd(service: Service) {
  const url = absoluteUrl(`/servicos/${service.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "MedicalProcedure",
    "@id": `${url}#service`,
    name: service.title,
    description: service.desc,
    procedureType: "NoninvasiveProcedure",
    provider: {
      "@id": `${BASE}/#organization`,
    },
    offers: service.plans?.map((p: ServicePlan) => ({
      "@type": "Offer",
      name: p.name,
      price: p.price ?? 0,
      priceCurrency: "BRL",
      availability: "https://schema.org/InStock",
      url,
    })),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "142",
    },
  };
}

/**
 * 6. BLOGPOSTING SCHEMA PARA ARTIGOS
 */
export function blogPostingJsonLd(post: BlogPost) {
  const url = absoluteUrl(`/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    headline: post.title,
    description: post.description,
    articleBody: post.content.map((c) => `${c.heading ? `${c.heading}: ` : ""}${c.paragraphs.join(" ")}`).join("\n\n"),
    author: {
      "@id": `${BASE}/#person`,
    },
    publisher: {
      "@id": `${BASE}/#organization`,
    },
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: "pt-BR",
    mainEntityOfPage: url,
    keywords: post.keywords.join(", "),
  };
}

/**
 * HELPER: GERA AS TAGS <script type="application/ld+json"> PARA O ROUTER
 */
export function pageSchemaScripts(opts: {
  path: string;
  name: string;
  description: string;
  type?: Parameters<typeof webPageJsonLd>[0]["type"];
  breadcrumbs?: Crumb[];
  primaryImage?: string;
  faqs?: { q: string; a: string }[];
  service?: Service;
  blogPost?: BlogPost;
  includeGlobalGraph?: boolean;
}) {
  const url = absoluteUrl(opts.path);
  const scripts: { type: string; children: string }[] = [];

  // 1. Grafo Global (se for home ou solicitado)
  if (opts.includeGlobalGraph || opts.path === "/" || opts.path === "") {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify(getGlobalEntityGraph()),
    });
  }

  // 2. Schema da Página
  scripts.push({
    type: "application/ld+json",
    children: JSON.stringify(webPageJsonLd(opts)),
  });

  // 3. Breadcrumbs
  if (opts.breadcrumbs && opts.breadcrumbs.length > 0) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify({
        ...breadcrumbJsonLd(opts.breadcrumbs),
        "@id": `${url}#breadcrumbs`,
      }),
    });
  }

  // 4. FAQPage
  if (opts.faqs && opts.faqs.length > 0) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify(faqPageJsonLd(opts.faqs)),
    });
  }

  // 5. Medical Procedure / Service
  if (opts.service) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify(serviceJsonLd(opts.service)),
    });
  }

  // 6. Blog Posting
  if (opts.blogPost) {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify(blogPostingJsonLd(opts.blogPost)),
    });
  }

  return scripts;
}
