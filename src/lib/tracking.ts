import { TRACKING } from "./site";

declare global {
  interface Window {
    dataLayer?: any[];
    gtag?: (...args: any[]) => void;
    fbq?: (...args: any[]) => void;
  }
}

/** Dispara um evento de conversão em GA4 e Meta Pixel. */
export function trackEvent(
  name: string,
  params: Record<string, any> = {}
) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...params });
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params);
    }
    if (typeof window.fbq === "function") {
      // Mapear alguns eventos padrão do Meta
      const meta = name === "lead" ? "Lead" : name === "contact" ? "Contact" : "CustomEvent";
      window.fbq("track", meta, params);
    }
  } catch {
    /* noop */
  }
}

/** Onclick helper para links WhatsApp/CTA. */
export function trackClick(source: string, extra: Record<string, any> = {}) {
  return () => trackEvent("click_whatsapp", { source, ...extra });
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
