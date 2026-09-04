import { SITE } from "@/lib/site";

export type BlogContentBlock = {
  heading?: string;
  paragraphs: string[];
};

export type BlogPost = {
  id?: string;
  slug: string;
  title: string;
  subtitle?: string;
  meta_title?: string;
  meta_description?: string;
  hero_image?: string;
  excerpt?: string;
  category: string;
  keywords?: string[];
  readingMinutes?: number;
  readingTime?: number;
  content: BlogContentBlock[] | string;
  published_at?: string;
  publishedAt?: string;
  cadence_interval_days?: number;
  status: "draft" | "published" | "archived" | "scheduled";
  created_at?: string;
  featured?: boolean;
  seo?: {
    title: string;
    description: string;
    keywords: string[];
    ogImage: string;
  };
  faqs?: {
    question: string;
    answer: string;
  }[];
  author?: {
    name: string;
    title: string;
    clinic: string;
  };
};

export const BLOG_AUTHOR = {
  name: SITE.name,
  url: SITE.url,
};

export function postUrl(slug: string) {
  return `${SITE.url.replace(/\/$/, "")}/blog/${slug}`;
}

export function formatDatePtBr(iso: string) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
  } catch {
    return "";
  }
}
