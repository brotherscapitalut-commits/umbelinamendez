import { useEffect, useState } from "react";
import { getRecentConversions, type ConversionEvent } from "@/lib/analytics-store";

export function AdminLeads() {
  const [conversions, setConversions] = useState<ConversionEvent[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadData();
    // Poderia configurar realtime do Supabase aqui futuramente se desejar
  }, []);

  async function loadData() {
    setLoading(true);
    const data = await getRecentConversions();
    setConversions(data);
    setLoading(false);
  }

  // Métricas
  const totalWhatsApp = conversions.filter(c => c.event_type === "click_whatsapp" || c.event_type.includes("wa")).length;
  const totalPix = conversions.filter(c => c.event_type === "pix_intent" || c.event_type === "begin_checkout").length;

  const serviceCounts = conversions.reduce((acc, curr) => {
    if (curr.service_interest) {
      acc[curr.service_interest] = (acc[curr.service_interest] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  let topService = "-";
  let topServiceCount = 0;
  for (const [srv, count] of Object.entries(serviceCounts)) {
    if (count > topServiceCount) {
      topServiceCount = count;
      topService = srv;
    }
  }

  return (
    <div className="space-y-8 animate-[fadeIn_.2s_ease-out]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-serif text-3xl font-bold text-[#2D2322]">
            Leads & Conversões (Analytics)
          </h2>
          <p className="text-xs text-[#6E5A56] mt-1 leading-relaxed">
            Monitoramento em tempo real de cliques em WhatsApp, intenções de Pix e tráfego de conversão.
          </p>
        </div>
        <button
          onClick={loadData}
          className="rounded-full bg-[#8C4E43] text-white px-5 py-2 text-xs font-semibold hover:bg-[#8C4E43] shadow-sm transition"
        >
          Atualizar Dados
        </button>
      </div>

      {/* Cards de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-3xl bg-white border border-emerald-200 bg-emerald-50/40 shadow-sm">
          <div className="text-[10px] uppercase tracking-wider text-emerald-800 font-bold flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Cliques WhatsApp
          </div>
          <div className="font-serif text-3xl font-bold text-emerald-900 mt-1">{totalWhatsApp}</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-amber-200 bg-amber-50/40 shadow-sm">
          <div className="text-[10px] uppercase tracking-wider text-amber-800 font-bold flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Intenções Pix
          </div>
          <div className="font-serif text-3xl font-bold text-amber-900 mt-1">{totalPix}</div>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-[#E8D8D0] shadow-sm">
          <div className="text-[10px] uppercase tracking-wider text-[#8C4E43] font-bold">
            Serviço Mais Buscado
          </div>
          <div className="font-serif text-xl font-bold text-[#8C4E43] mt-1 truncate">{topService}</div>
          <div className="text-[10px] text-[#6E5A56] mt-0.5">{topServiceCount} interações</div>
        </div>
      </div>

      {/* Tabela de Feed */}
      <div className="rounded-3xl border border-[#E8D8D0] bg-white overflow-hidden shadow-sm">
        <div className="p-6 border-b border-[#F2E7E1] flex items-center justify-between">
          <h3 className="font-serif text-xl font-bold text-[#2D2322]">Feed em Tempo Real</h3>
          <span className="text-xs text-[#6E5A56] font-medium">{conversions.length} eventos (últimos 100)</span>
        </div>

        {loading && conversions.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#6E5A56]">Carregando análises...</div>
        ) : conversions.length === 0 ? (
          <div className="p-12 text-center text-xs text-[#6E5A56]">Nenhum evento registrado ainda.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-[#2D2322]">
              <thead className="bg-[#FDFBF9] border-b border-[#E8D8D0] text-[10px] uppercase tracking-wider text-[#6E5A56] font-bold">
                <tr>
                  <th className="py-3.5 px-6">Data / Hora</th>
                  <th className="py-3.5 px-6">Tipo / Ação</th>
                  <th className="py-3.5 px-6">Origem do Clique</th>
                  <th className="py-3.5 px-6">Interesse / Serviço</th>
                  <th className="py-3.5 px-6">Dispositivo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2E7E1]">
                {conversions.map(c => (
                  <tr key={c.id} className="hover:bg-[#FDFBF9] transition">
                    <td className="py-4 px-6 text-[11px] text-[#6E5A56] whitespace-nowrap">
                      {new Date(c.created_at).toLocaleDateString("pt-BR")}
                      <div className="text-[10px] text-[#6E5A56]/70">
                        {new Date(c.created_at).toLocaleTimeString("pt-BR")}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        c.event_type.includes("whatsapp") ? "bg-emerald-50 text-emerald-700" :
                        (c.event_type.includes("pix") || c.event_type.includes("checkout")) ? "bg-amber-50 text-amber-700" :
                        "bg-stone-100 text-stone-600"
                      }`}>
                        {c.event_type.replace("click_", "")}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-medium text-[#2D2322]">
                      {c.source_location}
                      {c.utm_source && (
                        <div className="text-[9px] text-[#8C4E43] mt-1 bg-[#FDFBF9] px-2 py-0.5 rounded border border-[#E8D8D0] inline-block">
                          UTM: {c.utm_source} / {c.utm_medium}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 text-[#6E5A56]">
                      {c.service_interest || "-"}
                    </td>
                    <td className="py-4 px-6 text-[#6E5A56] capitalize">
                      {c.device_type}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
