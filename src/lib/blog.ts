import { SITE } from "@/lib/site";

export type BlogContentBlock = {
  heading?: string;
  paragraphs: string[];
};

export type BlogPost = {
  id?: string;
  slug: string;
  title: string;
  meta_title: string;
  meta_description: string;
  hero_image: string;
  excerpt: string;
  category: string;
  keywords: string[];
  readingMinutes: number;
  content: BlogContentBlock[];
  published_at: string;
  cadence_interval_days: number;
  status: "draft" | "published" | "archived";
  created_at?: string;
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
