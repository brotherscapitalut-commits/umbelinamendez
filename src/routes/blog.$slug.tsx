import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { BLOG_POSTS, findPost, formatDatePtBr, postUrl } from "@/lib/blog";
import { SITE, waLink } from "@/lib/site";
import { trackClick } from "@/lib/tracking";
import { pageSchemaScripts } from "@/lib/schema";
import { Logo } from "@/components/logo";
import { WhatsAppFab } from "@/components/whatsapp-fab";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = findPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Artigo não encontrado — Blog Umbelina Mendez" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const p = loaderData.post;
    const url = postUrl(p.slug);
    const title = `${p.title} — Dra. Umbelina Mendez | Brasília DF`;

    return {
      meta: [
        { title },
        { name: "description", content: p.description },
        { name: "keywords", content: `${p.keywords.join(", ")}, Brasília DF, Dra Umbelina Mendez` },
        { name: "author", content: "Dra. Umbelina Mendez — Bióloga Esteta" },
        { property: "og:title", content: title },
        { property: "og:description", content: p.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: url },
        { property: "article:published_time", content: p.date },
        { property: "article:section", content: p.category },
        { property: "article:author", content: "Dra. Umbelina Mendez" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: p.description },
        { name: "geo.region", content: "BR-DF" },
        { name: "geo.placename", content: "Brasília" },
        { name: "geo.position", content: "-15.7594;-47.8864" },
        { name: "ICBM", content: "-15.7594, -47.8864" },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: pageSchemaScripts({
        path: `/blog/${p.slug}`,
        name: title,
        description: p.description,
        type: "MedicalWebPage",
        blogPost: p,
        breadcrumbs: [
          { name: "Início", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: p.title, path: `/blog/${p.slug}` },
        ],
      }),
    };
  },
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-serif text-3xl text-[#2D2322]">Artigo não encontrado</h1>
      <p className="mt-3 text-sm text-[#6E5A56]">
        O conteúdo que você procura pode ter sido movido.
      </p>
      <Link to="/blog" className="mt-6 inline-block text-xs font-semibold text-[#A86558] underline">
        Voltar para o blog
      </Link>
    </div>
  ),
  errorComponent: ({ reset }) => (
    <div className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="font-serif text-2xl text-[#2D2322]">Não conseguimos abrir este artigo</h1>
      <button onClick={reset} className="mt-4 text-xs font-semibold text-[#A86558] underline">
        Tentar novamente
      </button>
    </div>
  ),
  component: BlogPostPage,
});

function BlogPostPage() {
  const { post } = Route.useLoaderData();
  const wa = waLink(
    `Olá, Dra. Umbelina! Li o artigo "${post.title}" no seu blog e gostaria de agendar uma avaliação.`,
    "blog_wa"
  );

  return (
    <div className="min-h-screen bg-[#F9F4F0] text-[#2D2322]">
      {/* Top Header */}
      <header className="border-b border-[#E8D8D0] backdrop-blur-md bg-[#F9F4F0]/90 sticky top-0 z-30">
        <div className="mx-auto max-w-4xl px-6 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <div className="flex items-center gap-4">
            <Link
              to="/blog"
              className="text-xs uppercase tracking-wider text-[#6E5A56] hover:text-[#A86558] font-medium"
            >
              ← Todos os Artigos
            </Link>
            <Link
              to="/agendamento"
              className="rounded-full bg-[#A86558] text-white px-4 py-1.5 text-xs font-semibold hover:bg-[#8C4E43] shadow-sm transition"
            >
              Agendar Avaliação
            </Link>
          </div>
        </div>
      </header>

      {/* Artigo */}
      <article className="mx-auto max-w-3xl px-6 py-14 md:py-20">
        <nav className="text-xs uppercase tracking-widest text-[#6E5A56]">
          <Link to="/" className="hover:text-[#A86558]">Início</Link>
          <span className="mx-2 text-[#E8D8D0]">/</span>
          <Link to="/blog" className="hover:text-[#A86558]">Blog</Link>
          <span className="mx-2 text-[#E8D8D0]">/</span>
          <span className="text-[#A86558] font-semibold">{post.category}</span>
        </nav>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-xs text-[#6E5A56]">
          <span className="rounded-full bg-[#F4EAE4] px-3 py-1 font-semibold text-[#A86558]">
            {post.category}
          </span>
          <span>•</span>
          <time dateTime={post.date}>{formatDatePtBr(post.date)}</time>
          <span>•</span>
          <span>{post.readingMinutes} min de leitura</span>
        </div>

        <h1
          data-speakable
          className="mt-5 font-serif text-3xl sm:text-4xl md:text-5xl text-[#2D2322] font-semibold leading-tight"
        >
          {post.title}
        </h1>

        <p
          data-speakable
          className="mt-5 text-base md:text-lg text-[#6E5A56] font-medium leading-relaxed border-l-2 border-[#A86558] pl-4"
        >
          {post.excerpt}
        </p>

        {/* Autor e Credenciais */}
        <div className="mt-8 p-4 rounded-2xl bg-white border border-[#E8D8D0] flex items-center gap-3.5 shadow-xs">
          <div className="h-11 w-11 rounded-full bg-[#F4EAE4] border border-[#A86558]/30 grid place-items-center text-xs font-serif font-bold text-[#A86558]">
            UM
          </div>
          <div>
            <div className="text-xs font-bold text-[#2D2322]">Dra. Umbelina Mendez (CRBio)</div>
            <div className="text-[10px] text-[#6E5A56]">Bióloga Esteta • Mais de 20 anos de experiência clínica no DF</div>
          </div>
        </div>

        {/* Corpo do Artigo */}
        <div data-speakable className="mt-10 space-y-8 text-sm md:text-base text-[#2D2322]/90 leading-relaxed font-normal">
          {post.content.map((sec, i) => (
            <section key={i} className="space-y-4">
              {sec.heading && (
                <h2 className="font-serif text-2xl md:text-3xl text-[#2D2322] font-semibold pt-4">
                  {sec.heading}
                </h2>
              )}
              {sec.paragraphs.map((par, j) => (
                <p key={j} className="text-[#6E5A56] leading-relaxed">
                  {par}
                </p>
              ))}
            </section>
          ))}
        </div>

        {/* Box de Ação no Final do Artigo */}
        <div className="mt-14 p-8 rounded-3xl bg-white border border-[#E8D8D0] shadow-sm text-center">
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#A86558] font-bold">
            Atendimento na Asa Norte ou em Domicílio
          </span>
          <h3 className="font-serif text-2xl font-bold text-[#2D2322] mt-1">
            Gostaria de uma avaliação personalizada?
          </h3>
          <p className="mt-2 text-xs text-[#6E5A56] max-w-md mx-auto leading-relaxed">
            Converse diretamente com a Dra. Umbelina Mendez e monte seu plano de cuidado sob medida.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              to="/agendamento"
              className="rounded-full bg-[#A86558] text-white px-7 py-3 text-xs font-semibold hover:bg-[#8C4E43] shadow-[0_4px_14px_rgba(168,101,88,0.22)] transition"
            >
              Agendar Avaliação com Bloqueio de Horário →
            </Link>
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              onClick={trackClick("blog_post_wa_bottom", { post: post.slug })}
              className="rounded-full border border-[#E8D8D0] bg-[#FDFBF9] px-6 py-3 text-xs font-semibold text-[#2D2322] hover:bg-white transition"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </article>

      <WhatsAppFab />
    </div>
  );
}
