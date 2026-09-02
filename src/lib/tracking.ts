import { TRACKING } from "./site";
import { supabase } from "./supabase";

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

function getDeviceType() {
  if (typeof navigator === "undefined") return "desktop";
  const ua = navigator.userAgent;
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) return "tablet";
  if (/Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(ua)) return "mobile";
  return "desktop";
}

function getUTMs() {
  if (typeof window === "undefined") return {};
  const params = new URLSearchParams(window.location.search);
  
  let source = params.get("utm_source");
  if (!source && document.referrer) {
    if (document.referrer.includes("instagram.com")) source = "instagram";
    else if (document.referrer.includes("facebook.com")) source = "facebook";
    else if (document.referrer.includes("google.com")) source = "google";
    else source = document.referrer;
  }
  
  return {
    utm_source: source || null,
    utm_medium: params.get("utm_medium") || null,
    utm_campaign: params.get("utm_campaign") || null,
  };
}

export async function trackConversion(data: {
  event_type: string;
  source_location: string;
  service_interest?: string;
}) {
  if (typeof window === "undefined") return;

  const utms = getUTMs();
  const device = getDeviceType();
  const page_path = window.location.pathname;

  try {
    // Fire and forget, non-blocking
    if (!supabase) return;
    
    supabase.from("leads_conversions").insert([
      {
        event_type: data.event_type,
        source_location: data.source_location,
        service_interest: data.service_interest || null,
        page_path,
        device_type: device,
        ...utms
      }
    ]).then(({ error }) => {
      if (error) console.error("Erro ao rastrear lead:", error);
    });
  } catch (err) {
    /* silent fail */
  }
}

/** Dispara um evento de conversão em GA4, Meta Pixel e Supabase. */
export function trackEvent(
  name: string,
  params: Record<string, any> = {}
) {
  if (typeof window === "undefined") return;
  
  const utms = getUTMs();
  const fullParams = { ...params, ...utms };
  
  // Envia para o Supabase
  trackConversion({
    event_type: name,
    source_location: params.source || "unknown",
    service_interest: params.service || params.promo || null,
  });

  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...fullParams });
    if (typeof window.gtag === "function") {
      window.gtag("event", name, fullParams);
    }
    if (typeof window.fbq === "function") {
      const meta = name === "lead" ? "Lead" : name === "contact" ? "Contact" : "CustomEvent";
      window.fbq("track", meta, fullParams);
    }
  } catch {
    /* noop */
  }
}

/** Onclick helper para links WhatsApp/CTA. */
export function trackClick(source: string, extra: Record<string, any> = {}) {
  return () => trackEvent("click_whatsapp", { source, ...extra });
}

export function trackPixIntent(source: string, extra: Record<string, any> = {}) {
  return () => trackEvent("pix_intent", { source, ...extra });
}

/** Retorna as tags <script> a serem injetadas via head().scripts. */
export function trackingScripts() {
  const scripts: Array<{
    src?: string;
    async?: boolean;
    children?: string;
    type?: string;
  }> = [];

  if (TRACKING.ga4) {
    scripts.push({
      src: `https://www.googletagmanager.com/gtag/js?id=${TRACKING.ga4}`,
      async: true,
    });
    scripts.push({
      children: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${TRACKING.ga4}');`,
    });
  }
  if (TRACKING.gtm) {
    scripts.push({
      children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${TRACKING.gtm}');`,
    });
  }
  if (TRACKING.metaPixel) {
    scripts.push({
      children: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${TRACKING.metaPixel}');fbq('track','PageView');`,
    });
  }
  return scripts;
}
