import { useState, useRef } from "react";
import { useServices, saveServices } from "@/lib/services-store";
import { useMedia, saveMedia } from "@/lib/media-store";
import { compressImageToBase64 } from "@/lib/image-utils";
import type { Service } from "@/lib/site";

function ImageUploader({ label, value, onChange }: { label: string, value: string, onChange: (val: string) => void }) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const base64 = await compressImageToBase64(file);
      onChange(base64);
    } catch (err) {
      console.error(err);
      alert("Erro ao comprimir imagem.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 p-4 border border-[#E8D8D0] rounded-xl bg-[#FDFBF9]">
      <label className="text-[10px] uppercase tracking-wider text-[#6E5A56] font-bold">{label}</label>
      
      {value && (
        <div className="w-full h-32 rounded-lg overflow-hidden border border-[#E8D8D0] bg-white flex items-center justify-center">
          <img src={value} alt={label} className="max-w-full max-h-full object-contain" />
        </div>
      )}

      <div className="flex gap-2 items-center">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="text-xs font-semibold px-4 py-2 bg-white border border-[#E8D8D0] rounded-lg hover:bg-gray-50 flex-1"
        >
          {uploading ? "Comprimindo..." : "Escolher Foto..."}
        </button>
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden" 
        />
      </div>
    </div>
  );
}

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
  
  // Before / After State
  const [beforeAfter1, setBeforeAfter1] = useState(media.beforeAfter1);
  const [beforeAfter2, setBeforeAfter2] = useState(media.beforeAfter2);
  const [beforeAfter3, setBeforeAfter3] = useState(media.beforeAfter3);

  function handleSaveMedia() {
    setLoading(true);
    saveMedia({
      heroImg,
      aboutImg,
      posopImg,
      gestanteImg,
      posPartoImg,
      beforeAfter1,
      beforeAfter2,
      beforeAfter3,
    });
    alert("Imagens salvas com sucesso! Atualize a página inicial para ver.");
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
            Altere as fotos principais do site fazendo o upload diretamente. Elas serão comprimidas e salvas automaticamente.
          </p>
        </div>
      </div>

      <div className="p-6 rounded-3xl border border-[#E8D8D0] bg-white shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-[#F2E7E1] pb-3 mb-4">
          <h3 className="font-semibold text-[#2D2322]">Fotos Principais do Site</h3>
          <button
            onClick={handleSaveMedia}
            disabled={loading}
            className="rounded-full bg-[#A86558] text-white px-5 py-2 text-xs font-semibold hover:bg-[#8C4E43]"
          >
            Salvar e Publicar Imagens
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ImageUploader label="Capa Principal (Hero)" value={heroImg} onChange={setHeroImg} />
          <ImageUploader label="Foto Sobre a Dra." value={aboutImg} onChange={setAboutImg} />
          <ImageUploader label="Tratamento: Pós-Operatório" value={posopImg} onChange={setPosopImg} />
          <ImageUploader label="Tratamento: Gestante/Drenagem" value={gestanteImg} onChange={setGestanteImg} />
          <ImageUploader label="Tratamento: Pós-Parto" value={posPartoImg} onChange={setPosPartoImg} />
        </div>

        <h3 className="font-semibold text-[#2D2322] border-b border-[#F2E7E1] pb-3 mb-4 mt-8">Imagens de Antes e Depois (Resultados)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ImageUploader label="Resultado 1 (Método Reviva)" value={beforeAfter1} onChange={setBeforeAfter1} />
          <ImageUploader label="Resultado 2 (Conexão Materna)" value={beforeAfter2} onChange={setBeforeAfter2} />
          <ImageUploader label="Resultado 3 (Reviva Face)" value={beforeAfter3} onChange={setBeforeAfter3} />
        </div>
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
