import { createFileRoute, Link } from "@tanstack/react-router";
import { BLOG_POSTS, formatDatePtBr } from "@/lib/blog";
import { SITE } from "@/lib/site";
import { pageSchemaScripts } from "@/lib/schema";
import { Logo } from "@/components/logo";

const blogListJsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: `Blog — ${SITE.name}`,
  url: `${SITE.url}/blog`,
  description:
    "Artigos sobre Método Reviva, pós-parto, pós-operatório e estética avançada em Brasília.",
  blogPost: BLOG_POSTS.map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    datePublished: p.date,
    url: `${SITE.url}/blog/${p.slug}`,
    author: { "@type": "Person", name: SITE.name },
  })),
};

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Blog & Artigos Científicos — Dra. Umbelina Mendez | Bióloga Esteta Brasília" },
      {
        name: "description",
        content:
          "Artigos com base biológica sobre Método Reviva, pós-operatório cirúrgico, recuperação pós-parto e estética avançada em Brasília. Escritos por Umbelina Mendez.",
      },
      {
        name: "keywords",
        content:
          "blog estética Brasília, Método Reviva Brasília, pós-operatório DF, drenagem linfática Brasília, pós-parto DF, cuidados puerpério, Dra Umbelina Mendez",
      },
      { property: "og:title", content: "Blog & Artigos — Dra. Umbelina Mendez" },
      { property: "og:description", content: "Conteúdo com embasamento biológico sobre recuperação pós-operatória, pós-parto e estética no DF." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE.url}/blog` },
      { property: "og:locale", content: "pt_BR" },
      { name: "geo.region", content: "BR-DF" },
      { name: "geo.placename", content: "Brasília" },
      { name: "geo.position", content: "-15.7594;-47.8864" },
      { name: "ICBM", content: "-15.7594, -47.8864" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE.url}/blog` }],
    scripts: [
      { type: "application/ld+json", children: JSON.stringify(blogListJsonLd) },
      ...pageSchemaScripts({
        path: "/blog",
        name: "Blog & Artigos Científicos — Dra. Umbelina Mendez",
        description:
          "Artigos sobre pós-operatório, pós-parto, drenagem linfática e estética avançada em Brasília.",
        type: "CollectionPage",
        breadcrumbs: [
          { name: "Início", path: "/" },
          { name: "Blog", path: "/blog" },
        ],
      }),
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <div className="min-h-screen bg-[#F9F4F0] text-[#2D2322]">
      <header className="border-b border-[#E8D8D0] bg-[#F9F4F0]/90 backdrop-blur sticky top-0 z-30">
        <div className="mx-auto max-w-5xl px-6 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <nav className="flex gap-6 text-xs uppercase tracking-wider font-semibold text-[#6E5A56]">
            <Link to="/tratamentos" className="hover:text-[#A86558] transition">Tratamentos</Link>
            <Link to="/agendamento" className="hover:text-[#A86558] transition">Agendar</Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="text-xs uppercase tracking-[0.25em] text-[#A86558] font-semibold">Artigos & Ciência</p>
        <h1 className="mt-3 font-serif text-4xl md:text-5xl leading-tight text-[#2D2322] font-semibold">
          Cuidado e saúde feminina, com <em className="text-[#A86558] italic font-normal">embasamento biológico</em>
        </h1>
        <p className="mt-4 text-xs md:text-sm text-[#6E5A56] leading-relaxed">
          Artigos sobre o Método Reviva™, recuperação pós-parto, cirurgias plásticas e tecnologias estéticas — compartilhados pela Dra. Umbelina Mendez a partir de mais de 20 anos de experiência clínica no DF.
        </p>
      </section>

      <section className="mx-auto max-w-3xl px-6 pb-24">
        <ul className="space-y-8">
          {BLOG_POSTS.slice()
            .sort((a, b) => (a.date < b.date ? 1 : -1))
            .map((p) => (
              <li key={p.slug} className="border-b border-[#E8D8D0] pb-8">
                <div className="text-[11px] uppercase tracking-wider text-[#A86558] font-semibold">
                  {p.category} · {formatDatePtBr(p.date)} · {p.readingMinutes} min de leitura
                </div>
                <h2 className="mt-2 font-serif text-2xl md:text-3xl text-[#2D2322] font-semibold">
                  <Link
                    to="/blog/$slug"
                    params={{ slug: p.slug }}
                    className="hover:text-[#A86558] transition"
                  >
                    {p.title}
                  </Link>
                </h2>
                <p className="mt-3 text-xs md:text-sm text-[#6E5A56] leading-relaxed">{p.excerpt}</p>
                <Link
                  to="/blog/$slug"
                  params={{ slug: p.slug }}
                  className="mt-4 inline-block text-xs font-semibold text-[#A86558] underline underline-offset-4 hover:text-[#8C4E43]"
                >
                  Ler artigo completo →
                </Link>
              </li>
            ))}
        </ul>
      </section>
    </div>
  );
}
