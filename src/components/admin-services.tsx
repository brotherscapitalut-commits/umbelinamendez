import { useState } from "react";
import { useServices, saveServices } from "@/lib/services-store";
import { useMedia, saveMedia } from "@/lib/media-store";
import type { Service } from "@/lib/site";

export function AdminServices() {
  const services = useServices();
  const media = useMedia();

  const [loading, setLoading] = useState(false);
  
  // Media State
  const [heroImg, setHeroImg] = useState(media.heroImg);
  const [aboutImg, setAboutImg] = useState(media.aboutImg);
  const [posopImg, setPosopImg] = useState(media.posopImg);
  const [gestanteImg, setGestanteImg] = useState(media.gestanteImg);
  const [posPartoImg, setPosPartoImg] = useState(media.posPartoImg);

  function handleSaveMedia() {
    setLoading(true);
    saveMedia({
      heroImg,
      aboutImg,
      posopImg,
      gestanteImg,
      posPartoImg,
    });
    alert("Imagens atualizadas com sucesso!");
    setLoading(false);
  }

  return (
    <div className="space-y-8 animate-[fadeIn_.2s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-[#2D2322]">
            Tratamentos & Mídia Dinâmica
          </h2>
          <p className="text-xs text-[#6E5A56] mt-1 leading-relaxed">
            Altere as fotos principais do site ou adicione/remova tratamentos.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-3xl border border-[#E8D8D0] bg-white shadow-sm space-y-4">
        <h3 className="font-semibold text-[#2D2322] border-b border-[#F2E7E1] pb-3 mb-4">Fotos Principais do Site</h3>
        <p className="text-xs text-amber-600 mb-4">
          Insira URLs válidas de imagens hospedadas (ex: Imgur, AWS S3, etc.).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#6E5A56] font-bold mb-1">Capa Principal (Hero)</label>
            <input
              type="text"
              value={heroImg}
              onChange={(e) => setHeroImg(e.target.value)}
              className="w-full rounded-xl border border-[#E8D8D0] bg-[#FDFBF9] px-4 py-2.5 text-xs text-[#2D2322] outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#6E5A56] font-bold mb-1">Foto Sobre a Dra.</label>
            <input
              type="text"
              value={aboutImg}
              onChange={(e) => setAboutImg(e.target.value)}
              className="w-full rounded-xl border border-[#E8D8D0] bg-[#FDFBF9] px-4 py-2.5 text-xs text-[#2D2322] outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#6E5A56] font-bold mb-1">Tratamento: Pós-Operatório</label>
            <input
              type="text"
              value={posopImg}
              onChange={(e) => setPosopImg(e.target.value)}
              className="w-full rounded-xl border border-[#E8D8D0] bg-[#FDFBF9] px-4 py-2.5 text-xs text-[#2D2322] outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#6E5A56] font-bold mb-1">Tratamento: Gestante/Drenagem</label>
            <input
              type="text"
              value={gestanteImg}
              onChange={(e) => setGestanteImg(e.target.value)}
              className="w-full rounded-xl border border-[#E8D8D0] bg-[#FDFBF9] px-4 py-2.5 text-xs text-[#2D2322] outline-none"
            />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-[#6E5A56] font-bold mb-1">Tratamento: Pós-Parto</label>
            <input
              type="text"
              value={posPartoImg}
              onChange={(e) => setPosPartoImg(e.target.value)}
              className="w-full rounded-xl border border-[#E8D8D0] bg-[#FDFBF9] px-4 py-2.5 text-xs text-[#2D2322] outline-none"
            />
          </div>
        </div>

        <button
          onClick={handleSaveMedia}
          disabled={loading}
          className="mt-4 rounded-full bg-[#A86558] text-white px-5 py-2 text-xs font-semibold hover:bg-[#8C4E43]"
        >
          Salvar Imagens
        </button>
      </div>

      <div className="p-6 rounded-3xl border border-[#E8D8D0] bg-white shadow-sm space-y-4">
         <h3 className="font-semibold text-[#2D2322] border-b border-[#F2E7E1] pb-3 mb-4">Tratamentos ({services.length})</h3>
         <p className="text-xs text-[#6E5A56]">
           Para adicionar ou editar tratamentos detalhados (com planos e FAQs), edite a estrutura JSON através do console ou banco de dados. MVP de interface gráfica em desenvolvimento.
         </p>
         <div className="space-y-2 mt-4">
           {services.map(s => (
             <div key={s.slug} className="p-3 bg-[#FDFBF9] border border-[#E8D8D0] rounded-xl flex justify-between items-center text-xs">
               <span className="font-semibold text-[#2D2322]">{s.title}</span>
               <span className="text-[#6E5A56]">{s.slug}</span>
             </div>
           ))}
         </div>
      </div>
    </div>
  );
}
