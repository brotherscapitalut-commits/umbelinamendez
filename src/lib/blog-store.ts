import { supabase } from "@/lib/supabase";
import type { BlogPost } from "@/lib/blog";
import { BLOG_SEEDS } from "@/data/blog-seed";

export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .order("published_at", { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) console.error("Erro ao buscar posts publicados:", error);
      return BLOG_SEEDS;
    }
    return data;
  } catch (err) {
    console.error("Erro no fetch de posts:", err);
    return BLOG_SEEDS;
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .lte("published_at", new Date().toISOString())
      .single();

    if (error || !data) {
      if (error) console.error(`Erro ao buscar post ${slug}:`, error);
      return BLOG_SEEDS.find(p => p.slug === slug) || null;
    }
    return data;
  } catch (err) {
    console.error(`Erro no fetch do post ${slug}:`, err);
    return BLOG_SEEDS.find(p => p.slug === slug) || null;
  }
}

export async function getAllAdminPosts(): Promise<BlogPost[]> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("published_at", { ascending: false });

    if (error || !data || data.length === 0) {
      if (error) console.error("Erro ao buscar todos os posts:", error);
      return BLOG_SEEDS;
    }
    return data;
  } catch (err) {
    console.error("Erro admin:", err);
    return BLOG_SEEDS;
  }
}

export async function savePost(post: Partial<BlogPost>): Promise<BlogPost | null> {
  try {
    const { data, error } = await supabase
      .from("blog_posts")
      .upsert(post)
      .select()
      .single();

    if (error) {
      console.error("Erro ao salvar post:", error);
      return null;
    }
    return data;
  } catch (err) {
    console.error("Erro save:", err);
    return null;
  }
}

export async function deletePost(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("blog_posts").delete().eq("id", id);
    if (error) {
      console.error("Erro ao deletar post:", error);
      return false;
    }
    return true;
  } catch (err) {
    return false;
  }
}

export async function batchSchedulePosts(posts: Partial<BlogPost>[], intervalDays: number) {
  if (posts.length === 0) return true;

  try {
    // Ordena os posts para garantir consistência
    const postsToSchedule = [...posts];
    const now = new Date();

    const scheduledData = postsToSchedule.map((p, index) => {
      const scheduledDate = new Date(now);
      scheduledDate.setDate(scheduledDate.getDate() + (index * intervalDays));
      return {
        ...p,
        published_at: scheduledDate.toISOString(),
        cadence_interval_days: intervalDays,
        status: "published",
      };
    });

    const { error } = await supabase.from("blog_posts").upsert(scheduledData);
    if (error) {
      console.error("Erro no batch schedule:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Erro batch:", err);
    return false;
  }
}
