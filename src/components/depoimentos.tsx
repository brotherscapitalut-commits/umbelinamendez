import { depoimentosReais } from "@/data/depoimentos";
import { Star } from "lucide-react";

export function Depoimentos({ limit = 3, filterKeyword }: { limit?: number, filterKeyword?: string }) {
  const avaliacoes = filterKeyword 
    ? depoimentosReais.filter(d => d.texto.toLowerCase().includes(filterKeyword.toLowerCase())).slice(0, limit)
    : depoimentosReais.slice(0, limit);

  return (
    <div className="py-16 bg-[#FDFBF9]">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif font-semibold text-[#5C4D4A] mb-4">
            Resultados reais de quem vivenciou
          </h2>
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl font-bold text-[#8C4E43]">5,0</span>
            <div className="flex text-[#8C4E43]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-current" />
              ))}
            </div>
          </div>
          <a
            href="https://www.google.com/maps?cid=7360214300302830863"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-[#6E5A56] hover:text-[#8C4E43] underline decoration-1 underline-offset-4"
          >
            Baseado em 21 avaliações reais no Google
          </a>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {avaliacoes.map((depoimento, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl shadow-sm border border-[#E8D8D0]/40 flex flex-col h-full hover:shadow-md transition-shadow"
            >
              <div className="flex text-[#8C4E43] mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-[#6E5A56] text-sm italic mb-6 flex-grow leading-relaxed">
                "{depoimento.texto}"
              </p>
              <div className="flex items-center gap-3 mt-auto">
                <div className="w-10 h-10 rounded-full bg-[#FDFBF9] border border-[#E8D8D0] flex items-center justify-center flex-shrink-0 text-[#8C4E43] font-serif font-bold">
                  {depoimento.nome.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold text-[#2D2322] leading-tight">
                    {depoimento.nome}
                  </p>
                  <p className="text-xs text-[#6E5A56] mt-0.5">{depoimento.data}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
