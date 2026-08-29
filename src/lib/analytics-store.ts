import { supabase } from "./supabase";

export type ConversionEvent = {
  id: string;
  created_at: string;
  event_type: string;
  source_location: string;
  service_interest: string | null;
  page_path: string;
  device_type: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
};

export async function getRecentConversions(): Promise<ConversionEvent[]> {
  try {
    const { data, error } = await supabase!
      .from("leads_conversions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Erro ao buscar conversões:", error);
      return [];
    }
    return data || [];
  } catch (err) {
    console.error("Erro fetch conversões:", err);
    return [];
  }
}
