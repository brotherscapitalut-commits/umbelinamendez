import { waLink } from "@/lib/site";
import { trackClick } from "@/lib/tracking";

export function WhatsAppFab({
  source = "fab_whatsapp",
  serviceSlug,
  customMessage,
}: {
  source?: string;
  serviceSlug?: string;
  customMessage?: string;
}) {
  const defaultMsg = customMessage ?? "Olá, Dra. Umbelina! Gostaria de agendar uma avaliação na clínica.";
  const wa = waLink(defaultMsg, "fab_whatsapp", serviceSlug);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      {/* Tooltip elegante */}
      <span className="hidden md:inline-block rounded-full bg-white/95 backdrop-blur-md px-3.5 py-1.5 text-xs font-medium text-[#2D2322] border border-[#E8D8D0] shadow-[0_4px_16px_rgba(168,101,88,0.12)] animate-pulse">
        Fale com a Dra. Umbelina
      </span>

      <a
        href={wa}
        target="_blank"
        rel="noreferrer"
        aria-label="Falar no WhatsApp com a Dra. Umbelina Mendez"
        onClick={trackClick(source)}
        className="relative group h-14 w-14 rounded-full bg-[#25D366] text-white grid place-items-center shadow-[0_6px_24px_rgba(37,211,102,0.35)] hover:scale-108 transition-transform duration-300"
      >
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
        </span>
        <svg viewBox="0 0 32 32" width="28" height="28" fill="currentColor" aria-hidden="true">
          <path d="M19.11 17.37c-.28-.14-1.65-.81-1.9-.9-.26-.09-.44-.14-.63.14-.19.28-.72.9-.88 1.09-.16.19-.32.21-.6.07-.28-.14-1.17-.43-2.23-1.38-.82-.73-1.38-1.63-1.54-1.9-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.49.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.63-1.52-.86-2.08-.23-.55-.47-.48-.63-.49h-.54c-.19 0-.49.07-.75.35-.26.28-.98.96-.98 2.34s1 2.72 1.14 2.91c.14.19 1.98 3.02 4.8 4.24.67.29 1.19.46 1.6.59.67.21 1.28.18 1.77.11.54-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.26-.19-.54-.33zM16.02 5.33c-5.87 0-10.65 4.78-10.65 10.65 0 1.87.49 3.7 1.42 5.31L5 27l5.87-1.54c1.55.85 3.31 1.3 5.1 1.3h.01c5.87 0 10.65-4.78 10.65-10.65 0-2.85-1.11-5.52-3.12-7.53a10.61 10.61 0 00-7.49-3.25zm0 19.35h-.01a8.7 8.7 0 01-4.44-1.22l-.32-.19-3.48.91.93-3.39-.21-.35a8.69 8.69 0 01-1.33-4.65c0-4.8 3.91-8.71 8.72-8.71 2.33 0 4.51.91 6.16 2.56a8.65 8.65 0 012.56 6.16c0 4.81-3.91 8.72-8.72 8.72z" />
        </svg>
      </a>
    </div>
  );
}
