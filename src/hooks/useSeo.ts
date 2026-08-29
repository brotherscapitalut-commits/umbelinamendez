import { useEffect } from "react";
import { useLocation } from "@tanstack/react-router";
import { seoConfig, type RouteSeo } from "@/seo/seo.config";

export function useSeo() {
  const location = useLocation();
  const path = location.pathname;

  useEffect(() => {
    // Busca a config. Fallback para um padrão se a rota não existir no mapa
    const config: RouteSeo = seoConfig[path] || {
      title: "Umbelina Mendez - Especialista em Pós-Operatório e Pós-Parto",
      description: "Bióloga esteta na Asa Norte, Brasília. Drenagem linfática, pós-operatório de cirurgia plástica e recuperação pós-parto.",
      type: "website",
    };

    // 1. Title
    document.title = config.title;

    // 2. Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.setAttribute("name", "description");
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute("content", config.description);

    // 3. Canonical
    const canonicalUrl = `https://www.umbelinamendez.com.br${path === '/' ? '' : path}`;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", canonicalUrl);

    // Helper para OpenGraph / Twitter
    const setMeta = (name: string, content: string, isProperty = false) => {
      const attr = isProperty ? "property" : "name";
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };

    // 4. OpenGraph
    setMeta("og:title", config.title, true);
    setMeta("og:description", config.description, true);
    setMeta("og:url", canonicalUrl, true);
    setMeta("og:type", config.type || "website", true);
    setMeta("og:image", config.image || "https://www.umbelinamendez.com.br/og-cover.jpg", true);

    // 5. Twitter
    setMeta("twitter:title", config.title);
    setMeta("twitter:description", config.description);
    setMeta("twitter:image", config.image || "https://www.umbelinamendez.com.br/og-cover.jpg");
    setMeta("twitter:card", "summary_large_image");

    // 6. JSON-LD Schema
    const scriptId = "seo-json-ld";
    let scriptTag = document.getElementById(scriptId);
    if (!scriptTag) {
      scriptTag = document.createElement("script");
      scriptTag.id = scriptId;
      scriptTag.type = "application/ld+json";
      document.head.appendChild(scriptTag);
    }
    
    // Dynamically import schema to avoid circular dependencies or bloating the hook unnecessarily
    import("../lib/schema").then(async ({ pageSchemaScripts }) => {
      // Fetch specific entity data based on route
      let serviceData, blogPostData, faqsData;
      
      if (path.startsWith("/servicos/")) {
        const { SERVICES } = await import("../lib/site");
        const slug = path.split("/").pop();
        serviceData = SERVICES.find(s => s.slug === slug);
      } else if (path.startsWith("/blog/")) {
        const { findPost } = await import("../lib/blog");
        const slug = path.split("/").pop();
        blogPostData = findPost(slug || "");
      } else if (path === "/faq" || path === "/") {
        const { HOME_FAQS } = await import("../lib/site");
        faqsData = HOME_FAQS;
      }

      // Injetamos o schema consolidado
      const scripts = pageSchemaScripts({
        path,
        name: config.title,
        description: config.description,
        type: config.type === "article" ? "Article" : "WebPage",
        includeGlobalGraph: true,
        service: serviceData,
        blogPost: blogPostData,
        faqs: faqsData
      });
      // Flatten the scripts into an array and set it
      scriptTag.textContent = `[${scripts.map(s => s.children).join(",")}]`;
    });

  }, [path]);
}
