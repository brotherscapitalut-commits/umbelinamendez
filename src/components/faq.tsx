import { useState } from "react";

type FAQ = { q: string; a: string };

export function FAQAccordion({ items, idBase = "faq" }: { items: FAQ[]; idBase?: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <ul className="divide-y divide-[#E8D8D0] border border-[#E8D8D0] rounded-3xl bg-white overflow-hidden shadow-sm">
      {items.map((it, i) => {
        const isOpen = open === i;
        return (
          <li key={i}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`${idBase}-${i}`}
              onClick={() => setOpen(isOpen ? null : i)}
              className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 hover:bg-[#FDFBF9] transition"
            >
              <span className="font-serif text-lg md:text-xl text-[#2D2322] font-medium">{it.q}</span>
              <span
                aria-hidden
                className={`text-[#8C4E43] text-2xl font-light transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
              >
                +
              </span>
            </button>
            {isOpen && (
              <div
                id={`${idBase}-${i}`}
                className="px-6 pb-6 -mt-1 text-xs md:text-sm text-[#6E5A56] leading-relaxed"
              >
                {it.a}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

export function faqJsonLd(items: FAQ[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
