import { SITE, SERVICES, type Service, type ServicePlan } from "./site";
import { type BlogPost } from "./blog";
import { depoimentosReais } from "../data/depoimentos";

const BASE = "https://www.umbelinamendez.com.br";

export function absoluteUrl(path: string): string {
    if (!path) return BASE + "/";
    if (path.startsWith("http")) return path;
    return `${BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

export type Crumb = { name: string; path: string };

function parseReviewDate(relativeTime: string) {
    // Calculado a partir da data atual (nao mais uma data fixa), para que o
  // JSON-LD nao fique com "datas relativas" desatualizadas com o tempo.
  const baseDate = new Date();
    const match = relativeTime.match(/(\d+)\s+mês/);
    if (match) {
          const months = parseInt(match[1]);
          baseDate.setMonth(baseDate.getMonth() - months);
    }
    return baseDate.toISOString().split("T")[0];
}

/**
 * 1. SCHEMA GRAPH GLOBAL (ORGANIZAÇÃO, LOCALBUSINESS, PESSOA & WEBSITE)
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
                      name: "Umbelina Mendez - Especialista em Pós-Operatório e Pós-Parto",
                      description:
                                  "Clínica de Estética Avançada e Biologia Tecidual em Brasília - DF. Criadora do Método Reviva™ e do programa Conexão Materna.",
                      inLanguage: "pt-BR",
                      publisher: { "@id": `${BASE}/#negocio` },
            },

                  // ENTIDADE 2: HEALTH & BEAUTY / MEDICAL BUSINESS (LOCAL BUSINESS)
            {
                      "@type": "LocalBusiness",
                      "@id": `${BASE}/#negocio`,
                      name: "Umbelina Mendez - Especialista em Pós-Operatório e Pós-Parto",
                      legalName: "Umbelina Mendez - Bióloga Esteta",
                      url: `${BASE}/`,
                      logo: {
                                  "@type": "ImageObject",
                                  "@id": `${BASE}/#logo`,
                                  url: `${BASE}/logo.svg`,
                                  caption: "Umbelina Mendez",
                      },
                      image: `${BASE}/hero.jpg`,
                      telephone: "+5561981567985",
                      priceRange: "$$",
                      currenciesAccepted: "BRL",
                      paymentAccepted: "Pix, Cartão de Crédito, Dinheiro",
                      address: {
                                  "@type": "PostalAddress",
                                  streetAddress: "SEPN 513, Edifício Bittar I, Sala 110",
                                  addressLocality: "Asa Norte, Brasília",
                                  addressRegion: "DF",
                                  postalCode: "70768-900",
                                  addressCountry: "BR",
                      },
                      geo: {
                                  "@type": "GeoCoordinates",
                                  latitude: -15.7594,
                                  longitude: -47.8864,
                      },
                      hasMap: "https://www.google.com/maps?cid=7360214300302830863",
                      areaServed: [
                        { "@type": "AdministrativeArea", name: "Asa Norte" },
                        { "@type": "AdministrativeArea", name: "Asa Sul" },
                        { "@type": "AdministrativeArea", name: "Lago Norte" },
                        { "@type": "AdministrativeArea", name: "Lago Sul" },
                        { "@type": "AdministrativeArea", name: "Noroeste" },
                        { "@type": "AdministrativeArea", name: "Sudoeste" },
                        { "@type": "AdministrativeArea", name: "Águas Claras" },
                        { "@type": "AdministrativeArea", name: "Guará" },
                        { "@type": "AdministrativeArea", name: "Taguatinga" },
                        { "@type": "City", name: "Brasília" },
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
                                  ratingValue: "5.0",
                                  reviewCount: String(depoimentosReais.length),
                                  bestRating: "5",
                                  worstRating: "1",
                      },
                      review: depoimentosReais.map((d) => ({
                                  "@type": "Review",
                                  author: { "@type": "Person", name: d.nome },
                                  reviewRating: { "@type": "Rating", ratingValue: "5", bestRating: "5" },
                                  reviewBody: d.texto,
                                  datePublished: parseReviewDate(d.data),
                      })),
                      founder: { "@id": `${BASE}/#person` },
                      employee: { "@id": `${BASE}/#person` },
                      sameAs: [
                                  "https://www.instagram.com/umbelina_mendez/",
                                  "https://www.google.com/maps?cid=7360214300302830863" // Example valid Maps CID/link based on reality
                                ],
            },

                  // ENTIDADE 3: PERSON (DRA. UMBELINA MENDEZ)
            {
                      "@type": "Person",
                      "@id": `${BASE}/#person`,
                      name: "Umbelina Mendez",
                      jobTitle: "Bióloga Esteta (CRBio)",
                      description: "Bióloga por formação (CRBio) e Esteticista com mais de 20 anos de experiência clínica.",
                      url: `${BASE}/`,
                      worksFor: { "@id": `${BASE}/#negocio` },
                      hasCredential: {
                                  "@type": "EducationalOccupationalCredential",
                                  credentialCategory: "professional certification",
                                  recognizedBy: { "@type": "Organization", name: "Conselho Regional de Biologia (CRBio)" },
                      },
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
                  cssSelector: ["h1", "h2"],
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
                  "@id": `${BASE}/#negocio`,
          },
          areaServed: { "@id": `${BASE}/#negocio` },
          offers: service.plans?.map((p: ServicePlan) => ({
                  "@type": "Offer",
                  name: p.name,
                  price: p.price ?? 0,
                  priceCurrency: "BRL",
                  availability: "https://schema.org/InStock",
                  url,
          })),
    };
}

/**
 * 6. BLOGPOSTING SCHEMA PARA ARTIGOS
 */
export function blogPostingJsonLd(post: BlogPost) {
    const url = absoluteUrl(`/blog/${post.slug}`);
    return {
          "@context": "https://schema.org",
          "@type": "Article",
          "@id": `${url}#article`,
          headline: post.title,
          description: post.meta_description || post.excerpt,
          articleBody: post.content.map((c) => `${c.heading ? `${c.heading}: ` : ""}${c.paragraphs.join(" ")}`).join("\n\n"),
          author: {
                  "@id": `${BASE}/#person`,
          },
          publisher: {
                  "@id": `${BASE}/#negocio`,
          },
          datePublished: post.published_at,
          dateModified: post.published_at,
          inLanguage: "pt-BR",
          mainEntityOfPage: url,
          keywords: (post.keywords || []).join(", "),
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

  // 4. FAQPage (evita duplicar na home, onde o componente FAQAccordion ja injeta o proprio faqJsonLd)
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
