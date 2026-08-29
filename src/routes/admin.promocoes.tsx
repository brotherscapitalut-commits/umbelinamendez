import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { Promo } from "@/lib/promos";
import { PROMOS as DEFAULT_PROMOS } from "@/lib/promos";
import {
  loadSeo,
  loadSeoRemote,
  saveSeo,
  saveSeoRemote,
  resetSeo,
  DEFAULT_SEO,
  type SeoConfig,
} from "@/lib/seo-store";
import {
  DEFAULT_PIX,
  loadPix,
  loadPromos,
  resetPix,
  resetPromos,
  savePix,
  savePromos,
  type PixConfig,
} from "@/lib/promo-store";
import {
  useLeads,
  updateLeadStatus,
  deleteLead,
  clearAllLeads,
  resetSampleLeads,
  generateRecoveryWhatsAppLink,
  formatPriceBRL,
  type Lead,
  type LeadStatus,
} from "@/lib/leads-store";
import {
  useAgenda,
  useAllAppointments,
  blockSlotAdmin,
  unblockOrCancelSlot,
  resetSampleAgenda,
  type CalculatedSlot,
  type Appointment,
} from "@/lib/agenda-store";
import { SERVICES, waLink, SITE } from "@/lib/site";
import { buildPixPayload, qrImageUrl } from "@/lib/pix";
import { Logo } from "@/components/logo";
import { AdminBlog } from "@/components/admin-blog";
import { AdminLeads } from "@/components/admin-leads";

export const Route = createFileRoute("/admin/promocoes")({
  head: () => ({
    meta: [
      { title: "Painel de Gestão, Agenda & Vendas — Dra. Umbelina Mendez" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPromocoes,
});

const ADMIN_PASS = (import.meta as any).env?.VITE_ADMIN_PASS ?? "belinha2026";
const LS_AUTH = "umbelina.admin.auth";

function toDatetimeLocal(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function fromDatetimeLocal(v: string) {
  if (!v) return new Date().toISOString();
  const d = new Date(v);
  return d.toISOString();
}

function emptyPromo(): Promo {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  return {
    id: `promo-${Math.random().toString(36).slice(2, 8)}`,
    badge: "Campanha Especial",
    title: "Título da Campanha",
    subtitle: "Descrição dos benefícios e diferenciais do protocolo.",
    discount: "-20% OFF",
    price: 490,
    originalPrice: 650,
    ctaLabel: "Garantir vaga",
    serviceSlug: SERVICES[0]?.slug,
    endsAt: d.toISOString(),
    active: true,
    gradient: "linear-gradient(135deg, #A86558 0%, #B76E79 100%)",
    emoji: "✨",
  };
}

function todayISO() {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
}

function AdminPromocoes() {
  const [authed, setAuthed] = useState(false);
  const [pass, setPass] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(LS_AUTH) === "1") setAuthed(true);
  }, []);

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F4F0] px-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (pass === ADMIN_PASS) {
              window.localStorage.setItem(LS_AUTH, "1");
              setAuthed(true);
            } else {
              alert("Senha incorreta");
            }
          }}
          className="w-full max-w-sm rounded-3xl border border-[#E8D8D0] bg-white p-8 shadow-[0_10px_30px_rgba(168,101,88,0.1)] text-center"
        >
          <Logo size="md" className="justify-center mb-6" />
          <h1 className="font-serif text-2xl font-bold text-[#2D2322]">Área Administrativa</h1>
          <p className="text-xs text-[#6E5A56] mt-1.5 leading-relaxed">
            Gestão de agenda em tempo real, campanhas e recuperação de leads.
          </p>
          <input
            type="password"
            autoFocus
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            placeholder="Digite sua senha de acesso"
            className="mt-5 w-full rounded-xl border border-[#E8D8D0] bg-[#FDFBF9] px-4 py-3 text-xs text-[#2D2322] outline-none focus:ring-2 focus:ring-[#A86558]/60 transition text-center"
          />
          <button
            type="submit"
            className="mt-4 w-full rounded-full bg-[#A86558] text-white py-3 text-xs font-semibold tracking-wide hover:bg-[#8C4E43] transition shadow-md"
          >
            Acessar Painel
          </button>
        </form>
      </div>
    );
  }

  return (
    <AdminEditor
      onLogout={() => {
        window.localStorage.removeItem(LS_AUTH);
        setAuthed(false);
      }}
    />
  );
}

function AdminEditor({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<"agenda" | "leads" | "promos" | "pix" | "seo" | "blog">("agenda");

  const [promos, setPromos] = useState<Promo[]>(() => loadPromos());
  const [pix, setPix] = useState<PixConfig>(() => loadPix());
  const [seoConfig, setSeoConfig] = useState<SeoConfig>(() => loadSeo());
  const [dirty, setDirty] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");
  
  // Sincronizar com KV remote
  useEffect(() => {
    loadSeoRemote().then((remoteConfig) => {
      setSeoConfig(remoteConfig);
    });
  }, []);

  // Estado da aba SEO
  const [isVerifyingSEO, setIsVerifyingSEO] = useState(false);
  const [seoScore, setSeoScore] = useState<number | null>(null);
  const [seoUrl, setSeoUrl] = useState(SITE.url);

  const handleVerifySEO = () => {
    setIsVerifyingSEO(true);
    setSeoScore(null);
    setTimeout(() => {
      setIsVerifyingSEO(false);
      setSeoScore(100);
    }, 1500);
  };

  // Estado da aba Agenda
  const [selectedAgendaDate, setSelectedAgendaDate] = useState<string>(todayISO());
  const agendaSlots = useAgenda(selectedAgendaDate);
  const allAppointments = useAllAppointments();

  const leads = useLeads();

  // Métricas dos Leads
  const metrics = useMemo(() => {
    const total = leads.length;
    const pendentes = leads.filter((l) => l.status === "pendente_pix");
    const pagos = leads.filter((l) => l.status === "pago");
    const valorPago = pagos.reduce((acc, l) => acc + (l.price || 0), 0);
    const valorPendente = pendentes.reduce((acc, l) => acc + (l.price || 0), 0);

    return {
      total,
      pendentesCount: pendentes.length,
      pagosCount: pagos.length,
      valorPago,
      valorPendente,
    };
  }, [leads]);

  const update = (idx: number, patch: Partial<Promo>) => {
    setPromos((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
    setDirty(true);
  };
  const remove = (idx: number) => {
    if (!confirm("Remover esta campanha?")) return;
    setPromos((prev) => prev.filter((_, i) => i !== idx));
    setDirty(true);
  };
  const add = () => {
    setPromos((prev) => [...prev, emptyPromo()]);
    setDirty(true);
  };
  const move = (idx: number, dir: -1 | 1) => {
    setPromos((prev) => {
      const next = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
    setDirty(true);
  };

  const saveAll = () => {
    savePromos(promos);
    savePix(pix);
    
    // Tentamos salvar no backend (Vercel KV), token mockado por ora
    saveSeoRemote(seoConfig, "umbelina2026");
    
    setDirty(false);
    setSavedMsg("Alterações salvas com sucesso! ✨");
    setTimeout(() => setSavedMsg(""), 2500);
  };

  const restoreDefaults = () => {
    if (!confirm("Restaurar campanhas padrão? Alterações não salvas serão perdidas.")) return;
    resetPromos();
    setPromos(DEFAULT_PROMOS);
    setDirty(true);
  };
  const restorePix = () => {
    if (!confirm("Restaurar dados padrão do Pix?")) return;
    resetPix();
    setPix(DEFAULT_PIX);
    setDirty(true);
  };

  const restoreSeo = () => {
    if (!confirm("Restaurar dados padrão de SEO?")) return;
    resetSeo();
    setSeoConfig(DEFAULT_SEO);
    setDirty(true);
  };

  function changeDay(delta: number) {
    const [y, m, d] = selectedAgendaDate.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    dateObj.setDate(dateObj.getDate() + delta);
    setSelectedAgendaDate(dateObj.toISOString().slice(0, 10));
  }

  return (
    <div className="min-h-screen bg-[#F9F4F0] text-[#2D2322]">
      {/* Header Sticky */}
      <header className="sticky top-0 z-40 border-b border-[#E8D8D0] bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <Logo size="sm" />

          {/* Abas de Navegação */}
          <div className="flex items-center gap-1.5 bg-[#F9F4F0] p-1 rounded-2xl border border-[#E8D8D0]">
            <button
              type="button"
              onClick={() => setActiveTab("agenda")}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
                activeTab === "agenda"
                  ? "bg-[#A86558] text-white shadow-sm"
                  : "text-[#6E5A56] hover:text-[#2D2322]"
              }`}
            >
              <span>📅 Agenda & Slots</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("leads")}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition flex items-center gap-2 ${
                activeTab === "leads"
                  ? "bg-[#A86558] text-white shadow-sm"
                  : "text-[#6E5A56] hover:text-[#2D2322]"
              }`}
            >
              <span>📊 Leads & Vendas</span>
              {metrics.pendentesCount > 0 && (
                <span className="h-5 min-w-5 px-1.5 rounded-full bg-amber-400 text-[#2D2322] text-[10px] font-bold flex items-center justify-center">
                  {metrics.pendentesCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("promos")}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition ${
                activeTab === "promos"
                  ? "bg-[#A86558] text-white shadow-sm"
                  : "text-[#6E5A56] hover:text-[#2D2322]"
              }`}
            >
              🏷️ Campanhas ({promos.length})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("pix")}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition ${
                activeTab === "pix"
                  ? "bg-[#A86558] text-white shadow-sm"
                  : "text-[#6E5A56] hover:text-[#2D2322]"
              }`}
            >
              💳 Chave Pix
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("seo")}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                activeTab === "seo"
                  ? "bg-[#A86558] text-white shadow-sm"
                  : "bg-white/80 text-[#5C4D4A] hover:bg-[#A86558]/10"
              }`}
            >
              🔍 Auditoria SEO
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("blog")}
              className={`px-4 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition flex items-center gap-1.5 ${
                activeTab === "blog"
                  ? "bg-[#A86558] text-white shadow-sm"
                  : "text-[#6E5A56] hover:text-[#2D2322]"
              }`}
            >
              <span>📝 Blog</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs text-[#6E5A56] hover:text-[#A86558] underline underline-offset-4 mr-1 font-medium"
            >
              Ver Site
            </Link>
            <button
              onClick={onLogout}
              className="text-xs rounded-full border border-[#E8D8D0] px-3.5 py-1.5 hover:bg-[#F9F4F0] text-[#6E5A56] transition font-medium"
            >
              Sair
            </button>
            <button
              onClick={saveAll}
              disabled={!dirty}
              className="rounded-full bg-[#A86558] text-white px-5 py-1.5 text-xs font-semibold hover:bg-[#8C4E43] disabled:opacity-40 shadow-sm transition"
            >
              {dirty ? "Salvar Alterações *" : "Salvo ✓"}
            </button>
          </div>
        </div>

        {savedMsg && (
          <div className="bg-[#A86558] text-white text-xs text-center py-1.5 font-medium tracking-wide">
            {savedMsg}
          </div>
        )}
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {/* ============================================================ */}
        {/* ABA 1: AGENDA & HORÁRIOS EM TEMPO REAL */}
        {/* ============================================================ */}
        {activeTab === "agenda" && (
          <div className="space-y-8 animate-[fadeIn_.2s_ease-out]">
            {/* Top Bar da Agenda */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E8D8D0] shadow-sm">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#A86558] font-bold">
                  Motor de Agendamento
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2322] mt-0.5">
                  Grade de Horários & Atendimentos
                </h2>
                <p className="text-xs text-[#6E5A56] mt-1">
                  Horários com 60 min de sessão + 20 min de higienização de cabine (Total 80 min).
                </p>
              </div>

              {/* Seletor de Data */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => changeDay(-1)}
                  className="h-9 w-9 rounded-xl border border-[#E8D8D0] bg-[#FDFBF9] grid place-items-center text-xs hover:border-[#A86558] transition"
                  title="Dia anterior"
                >
                  ‹
                </button>
                <input
                  type="date"
                  value={selectedAgendaDate}
                  onChange={(e) => setSelectedAgendaDate(e.target.value)}
                  className="rounded-xl border border-[#E8D8D0] bg-[#FDFBF9] px-3.5 py-2 text-xs font-semibold text-[#2D2322] outline-none focus:ring-2 focus:ring-[#A86558]/60"
                />
                <button
                  type="button"
                  onClick={() => changeDay(1)}
                  className="h-9 w-9 rounded-xl border border-[#E8D8D0] bg-[#FDFBF9] grid place-items-center text-xs hover:border-[#A86558] transition"
                  title="Próximo dia"
                >
                  ›
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAgendaDate(todayISO())}
                  className="text-xs text-[#A86558] underline underline-offset-4 ml-1 font-semibold"
                >
                  Hoje
                </button>
              </div>
            </div>

            {/* Resumo do Dia */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-[#E8D8D0] shadow-sm">
                <div className="text-[10px] uppercase tracking-wider text-[#6E5A56] font-semibold">
                  Total de Slots
                </div>
                <div className="font-serif text-2xl font-bold text-[#2D2322] mt-0.5">
                  {agendaSlots.length}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm">
                <div className="text-[10px] uppercase tracking-wider text-emerald-800 font-semibold">
                  Vagas Livres
                </div>
                <div className="font-serif text-2xl font-bold text-emerald-900 mt-0.5">
                  {agendaSlots.filter((s) => s.isAvailable).length}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 shadow-sm">
                <div className="text-[10px] uppercase tracking-wider text-amber-800 font-semibold">
                  Horários Agendados
                </div>
                <div className="font-serif text-2xl font-bold text-amber-900 mt-0.5">
                  {agendaSlots.filter((s) => s.status === "ocupado").length}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-stone-100 border border-stone-300 shadow-sm">
                <div className="text-[10px] uppercase tracking-wider text-stone-700 font-semibold">
                  Bloqueados Admin
                </div>
                <div className="font-serif text-2xl font-bold text-stone-800 mt-0.5">
                  {agendaSlots.filter((s) => s.status === "bloqueado_admin").length}
                </div>
              </div>
            </div>

            {/* Lista dos Slots da Data */}
            <div className="rounded-3xl border border-[#E8D8D0] bg-white overflow-hidden shadow-sm">
              <div className="p-6 border-b border-[#F2E7E1] flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-[#2D2322]">
                  Slots do Dia ({selectedAgendaDate.split("-").reverse().join("/")})
                </h3>
                <button
                  onClick={resetSampleAgenda}
                  className="text-xs text-[#6E5A56] hover:text-[#A86558] underline underline-offset-4"
                >
                  Restaurar Exemplos da Agenda
                </button>
              </div>

              {agendaSlots.length === 0 ? (
                <div className="p-12 text-center text-xs text-[#6E5A56]">
                  Clínica fechada aos domingos ou sem slots configurados para esta data.
                </div>
              ) : (
                <div className="divide-y divide-[#F2E7E1]">
                  {agendaSlots.map((slot) => {
                    const apt = slot.appointment;

                    return (
                      <div
                        key={slot.startTime}
                        className={`p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition ${
                          slot.status === "ocupado"
                            ? "bg-[#FDFBF9]"
                            : slot.status === "bloqueado_admin"
                            ? "bg-stone-50/70"
                            : "hover:bg-[#FDFBF9]/60"
                        }`}
                      >
                        {/* Horário do Bloco */}
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-24 rounded-xl border border-[#E8D8D0] bg-white flex flex-col items-center justify-center font-mono shadow-xs">
                            <span className="text-sm font-bold text-[#2D2322] leading-none">
                              {slot.startTime}
                            </span>
                            <span className="text-[10px] text-[#6E5A56] leading-none mt-1">
                              até {slot.endTime}
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                  slot.status === "livre"
                                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                                    : slot.status === "ocupado"
                                    ? "bg-amber-50 text-amber-800 border border-amber-200"
                                    : slot.status === "bloqueado_admin"
                                    ? "bg-stone-200 text-stone-700"
                                    : "bg-stone-100 text-stone-500"
                                }`}
                              >
                                ● {slot.status === "livre" ? "Livre para reserva" : slot.status === "ocupado" ? "Confirmado" : slot.status === "bloqueado_admin" ? "Bloqueio Admin" : "Encerrado"}
                              </span>
                              <span className="text-[10px] text-[#6E5A56]">
                                Higienização até {slot.bufferEnd}
                              </span>
                            </div>

                            {apt && (
                              <div className="mt-1.5">
                                <div className="text-sm font-bold text-[#2D2322]">
                                  {apt.clientName} {apt.clientPhone && `• ${apt.clientPhone}`}
                                </div>
                                <div className="text-xs text-[#6E5A56]">
                                  💆‍♀️ {apt.service} {apt.price ? `(${formatPriceBRL(apt.price)})` : ""}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Ações */}
                        <div className="flex items-center gap-2">
                          {slot.status === "livre" && (
                            <button
                              type="button"
                              onClick={() => {
                                const reason =
                                  prompt("Motivo do bloqueio (ex: Curso, Manutenção, Compromisso Pessoal):") ||
                                  "Bloqueio de Agenda";
                                blockSlotAdmin(
                                  selectedAgendaDate,
                                  slot.startTime,
                                  slot.endTime,
                                  reason
                                );
                              }}
                              className="rounded-full border border-[#E8D8D0] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#6E5A56] hover:text-[#A86558] hover:border-[#A86558] transition"
                            >
                              🔒 Bloquear Horário
                            </button>
                          )}

                          {apt && apt.clientPhone && (
                            <a
                              href={`https://wa.me/${apt.clientPhone.replace(/\D/g, "")}`}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-full bg-[#A86558] text-white px-3.5 py-1.5 text-xs font-semibold hover:bg-[#8C4E43] shadow-sm transition"
                            >
                              💬 WhatsApp
                            </a>
                          )}

                          {apt && (
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  confirm(
                                    `Deseja liberar o horário ${slot.startTime} às ${slot.endTime}?`
                                  )
                                ) {
                                  unblockOrCancelSlot(apt.id);
                                }
                              }}
                              className="rounded-full border border-red-200 bg-red-50 text-red-700 px-3.5 py-1.5 text-xs font-semibold hover:bg-red-100 transition"
                            >
                              {slot.status === "bloqueado_admin" ? "🔓 Desbloquear" : "✕ Desmarcar / Liberar"}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* ABA BLOG: CMS E SEO */}
        {/* ============================================================ */}
        {activeTab === "blog" && <AdminBlog />}

        {/* ============================================================ */}
        {/* ABA 2: LEADS & RECUPERAÇÃO DE VENDAS */}
        {/* ============================================================ */}
        {activeTab === "leads" && (
          <div className="space-y-12 animate-[fadeIn_.2s_ease-out]">
            <AdminLeads />

            <div className="pt-8 border-t border-[#E8D8D0] space-y-8">
            {/* Header da Aba */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-3xl font-bold text-[#2D2322]">
                  Recuperação de Leads & Vendas Pix
                </h2>
                <p className="text-xs text-[#6E5A56] mt-1 leading-relaxed">
                  Monitore quem iniciou a compra de pacotes e recupere vendas pendentes diretamente pelo WhatsApp.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={resetSampleLeads}
                  className="text-xs text-[#6E5A56] hover:text-[#A86558] underline underline-offset-4 font-medium"
                >
                  Restaurar Exemplos
                </button>
                <button
                  onClick={() => {
                    if (confirm("Deseja apagar todos os registros de leads da lista?")) {
                      clearAllLeads();
                    }
                  }}
                  className="text-xs text-red-700 hover:underline underline-offset-4 ml-2 font-medium"
                >
                  Limpar Todos
                </button>
              </div>
            </div>

            {/* Cards de Métricas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-[#E8D8D0] shadow-sm">
                <div className="text-[10px] uppercase tracking-wider text-[#6E5A56] font-semibold">
                  Total de Leads
                </div>
                <div className="font-serif text-3xl font-bold text-[#2D2322] mt-1">{metrics.total}</div>
                <div className="text-[10px] text-[#6E5A56] mt-0.5">Cadastrados no site</div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-amber-200 bg-amber-50/40 shadow-sm">
                <div className="text-[10px] uppercase tracking-wider text-amber-800 font-bold flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                  Pendentes Pix
                </div>
                <div className="font-serif text-3xl font-bold text-amber-900 mt-1">
                  {metrics.pendentesCount}
                </div>
                <div className="text-[10px] text-amber-700 mt-0.5">
                  {formatPriceBRL(metrics.valorPendente)} a recuperar
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-emerald-200 bg-emerald-50/40 shadow-sm">
                <div className="text-[10px] uppercase tracking-wider text-emerald-800 font-bold flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Vendas Pagas
                </div>
                <div className="font-serif text-3xl font-bold text-emerald-900 mt-1">
                  {metrics.pagosCount}
                </div>
                <div className="text-[10px] text-emerald-700 mt-0.5">
                  {formatPriceBRL(metrics.valorPago)} faturado
                </div>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-[#E8D8D0] shadow-sm">
                <div className="text-[10px] uppercase tracking-wider text-[#A86558] font-bold">
                  Taxa de Conversão
                </div>
                <div className="font-serif text-3xl font-bold text-[#A86558] mt-1">
                  {metrics.total > 0
                    ? `${Math.round((metrics.pagosCount / metrics.total) * 100)}%`
                    : "0%"}
                </div>
                <div className="text-[10px] text-[#6E5A56] mt-0.5">Pix concluídos</div>
              </div>
            </div>

            {/* Tabela de Leads & Vendas */}
            <div className="rounded-3xl border border-[#E8D8D0] bg-white overflow-hidden shadow-sm">
              <div className="p-6 border-b border-[#F2E7E1] flex items-center justify-between">
                <h3 className="font-serif text-xl font-bold text-[#2D2322]">
                  Leads & Reservas Recentes
                </h3>
                <span className="text-xs text-[#6E5A56] font-medium">
                  {leads.length} registro(s) encontrados
                </span>
              </div>

              {leads.length === 0 ? (
                <div className="p-12 text-center text-xs text-[#6E5A56]">
                  Nenhum lead registrado até o momento. Quando clientes iniciarem o checkout do Beauty Tech Day ou de campanhas, eles aparecerão aqui instantaneamente.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs text-[#2D2322]">
                    <thead className="bg-[#FDFBF9] border-b border-[#E8D8D0] text-[10px] uppercase tracking-wider text-[#6E5A56] font-bold">
                      <tr>
                        <th className="py-3.5 px-6">Data / Hora</th>
                        <th className="py-3.5 px-6">Cliente</th>
                        <th className="py-3.5 px-6">Tratamento / Pacote</th>
                        <th className="py-3.5 px-6">Valor</th>
                        <th className="py-3.5 px-6">Status</th>
                        <th className="py-3.5 px-6 text-right">Ação de Recuperação</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F2E7E1]">
                      {leads.map((l) => {
                        const recLink = generateRecoveryWhatsAppLink(l);

                        return (
                          <tr key={l.id} className="hover:bg-[#FDFBF9] transition">
                            {/* Data */}
                            <td className="py-4 px-6 text-[11px] text-[#6E5A56] whitespace-nowrap">
                              {new Date(l.createdAt).toLocaleDateString("pt-BR", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                              })}
                              <div className="text-[10px] text-[#6E5A56]/70">
                                {new Date(l.createdAt).toLocaleTimeString("pt-BR", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </td>

                            {/* Cliente */}
                            <td className="py-4 px-6">
                              <div className="font-semibold text-sm text-[#2D2322]">{l.name}</div>
                              <div className="text-xs text-[#6E5A56]">{l.phone}</div>
                              {l.bestContactTime && (
                                <div className="text-[10px] text-[#A86558] font-medium mt-0.5">
                                  Preferência: {l.bestContactTime}
                                </div>
                              )}
                            </td>

                            {/* Serviço / Preferência */}
                            <td className="py-4 px-6">
                              <div className="font-medium text-[#2D2322]">{l.serviceName}</div>
                              {l.preferredDate && (
                                <div className="text-[10px] text-[#6E5A56] mt-0.5">
                                  📅 {l.preferredDate} • Turno: {l.preferredShift || "Manhã"}
                                </div>
                              )}
                            </td>

                            {/* Valor */}
                            <td className="py-4 px-6 font-serif font-bold text-sm text-[#2D2322] whitespace-nowrap">
                              {formatPriceBRL(l.price)}
                            </td>

                            {/* Status */}
                            <td className="py-4 px-6 whitespace-nowrap">
                              <select
                                value={l.status}
                                onChange={(e) =>
                                  updateLeadStatus(l.id, e.target.value as LeadStatus)
                                }
                                className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider outline-none border cursor-pointer ${
                                  l.status === "pago"
                                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                                    : l.status === "pendente_pix"
                                    ? "bg-amber-50 text-amber-800 border-amber-300"
                                    : "bg-stone-100 text-stone-700 border-stone-300"
                                }`}
                              >
                                <option value="pendente_pix">● Pendente Pix</option>
                                <option value="pago">✓ Confirmado (Pago)</option>
                                <option value="expirado">✕ Expirado</option>
                              </select>
                            </td>

                            {/* Ações */}
                            <td className="py-4 px-6 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-2">
                                <a
                                  href={recLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  title="Abrir WhatsApp com mensagem de recuperação formatada"
                                  className="inline-flex items-center gap-1.5 rounded-full bg-[#A86558] text-white px-3.5 py-1.5 text-xs font-semibold hover:bg-[#8C4E43] shadow-sm transition"
                                >
                                  <span>💬 Recuperar no WhatsApp</span>
                                </a>

                                <button
                                  type="button"
                                  onClick={() => deleteLead(l.id)}
                                  title="Remover registro"
                                  className="text-stone-400 hover:text-red-700 p-1 transition"
                                >
                                  ✕
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
        )}

        {/* ============================================================ */}
        {/* ABA 3: CAMPANHAS & PROMOÇÕES SAZONAIS */}
        {/* ============================================================ */}
        {activeTab === "promos" && (
          <div className="space-y-8 animate-[fadeIn_.2s_ease-out]">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-3xl font-bold text-[#2D2322]">
                  Campanhas & Promoções Sazonais
                </h2>
                <p className="text-xs text-[#6E5A56] mt-1">
                  Ative, pause ou edite ofertas para o Beauty Tech Day, Método Reviva, Conexão Materna ou outros tratamentos.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={restoreDefaults}
                  className="text-xs text-[#6E5A56] hover:text-[#A86558] underline underline-offset-4"
                >
                  Restaurar Padrão
                </button>
                <button
                  onClick={add}
                  className="rounded-full bg-[#A86558] text-white px-5 py-2 text-xs font-semibold hover:bg-[#8C4E43] shadow-sm transition"
                >
                  + Nova Campanha
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {promos.length === 0 && (
                <div className="rounded-3xl border border-dashed border-[#E8D8D0] bg-white p-12 text-center text-xs text-[#6E5A56]">
                  Nenhuma campanha cadastrada no momento. Clique em <b>+ Nova Campanha</b>.
                </div>
              )}
              {promos.map((p, idx) => (
                <PromoRow
                  key={p.id + idx}
                  promo={p}
                  pix={pix}
                  onChange={(patch) => update(idx, patch)}
                  onRemove={() => remove(idx)}
                  onUp={() => move(idx, -1)}
                  onDown={() => move(idx, 1)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* ABA 4: CONFIGURAÇÃO CHAVE PIX */}
        {/* ============================================================ */}
        {activeTab === "pix" && (
          <div className="space-y-6 animate-[fadeIn_.2s_ease-out]">
            <section className="rounded-3xl border border-[#E8D8D0] bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-serif text-3xl font-bold text-[#2D2322]">
                    Configuração de Recebimento Pix
                  </h2>
                  <p className="text-xs text-[#6E5A56] mt-1">
                    Estes dados alimentam automaticamente o QR Code e o Pix Copia e Cola dos clientes em tempo real.
                  </p>
                </div>
                <button
                  onClick={restorePix}
                  className="text-xs text-[#A86558] hover:underline underline-offset-4 font-medium"
                >
                  Restaurar Padrão
                </button>
              </div>

              <div className="mt-8 grid md:grid-cols-3 gap-5">
                <Field label="Chave Pix (Telefone, E-mail ou CPF)">
                  <input
                    value={pix.key}
                    onChange={(e) => {
                      setPix({ ...pix, key: e.target.value });
                      setDirty(true);
                    }}
                    className="input-admin"
                    placeholder="+5561981567985"
                  />
                </Field>
                <Field label="Nome do Titular (Até 25 letras)">
                  <input
                    maxLength={25}
                    value={pix.merchantName}
                    onChange={(e) => {
                      setPix({ ...pix, merchantName: e.target.value });
                      setDirty(true);
                    }}
                    className="input-admin"
                    placeholder="Umbelina Mendez"
                  />
                </Field>
                <Field label="Cidade (Sem acentos, ex: Brasilia)">
                  <input
                    maxLength={15}
                    value={pix.merchantCity}
                    onChange={(e) => {
                      setPix({ ...pix, merchantCity: e.target.value });
                      setDirty(true);
                    }}
                    className="input-admin"
                    placeholder="Brasilia"
                  />
                </Field>
              </div>

              <div className="mt-8 p-4 rounded-2xl bg-[#FDFBF9] border border-[#E8D8D0] text-xs text-[#6E5A56]">
                💡 <b>Dica de Segurança:</b> Para pagamentos automáticos no Pix, certifique-se de que a chave cadastrada acima esteja ativa e habilitada no aplicativo do seu banco.
              </div>
            </section>
          </div>
        )}

        {/* ============================================================ */}
        {/* ABA 5: SEO, GEO e AEO */}
        {/* ============================================================ */}
        {activeTab === "seo" && (
          <div className="space-y-8 animate-[fadeIn_.2s_ease-out]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-[#E8D8D0] shadow-sm">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#A86558] font-bold">
                  Conteúdo Estrutural & Metadados
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2D2322] mt-0.5">
                  SEO, GEO e AEO
                </h2>
                <p className="text-xs text-[#6E5A56] mt-1">
                  Altere os textos principais da Home, localização do Google Maps e metatags de busca.
                </p>
              </div>
              <button
                onClick={restoreSeo}
                className="text-[11px] font-semibold text-[#A86558] border border-[#A86558] rounded-full px-4 py-1.5 hover:bg-[#F9F4F0] transition"
              >
                Restaurar Padrões
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* === SEO: Títulos e Metatags === */}
              <div className="bg-white p-6 rounded-3xl border border-[#E8D8D0] shadow-sm space-y-5">
                <div className="pb-3 border-b border-[#E8D8D0]">
                  <h3 className="font-serif text-xl font-bold text-[#2D2322]">🔍 SEO da Página (Head)</h3>
                  <p className="text-xs text-[#6E5A56]">Estas tags aparecem no Google e no navegador.</p>
                </div>
                <Field label="Título Principal (Site Title)">
                  <input
                    value={seoConfig.title}
                    onChange={(e) => { setSeoConfig({ ...seoConfig, title: e.target.value }); setDirty(true); }}
                    className="input-admin"
                  />
                </Field>
                <Field label="Slogan (Tagline)">
                  <input
                    value={seoConfig.tagline}
                    onChange={(e) => { setSeoConfig({ ...seoConfig, tagline: e.target.value }); setDirty(true); }}
                    className="input-admin"
                  />
                </Field>
                <Field label="Descrição SEO (Meta Description)">
                  <textarea
                    rows={4}
                    value={seoConfig.description}
                    onChange={(e) => { setSeoConfig({ ...seoConfig, description: e.target.value }); setDirty(true); }}
                    className="input-admin resize-y"
                  />
                </Field>
              </div>

              {/* === H1 / H2 / H3 da Home === */}
              <div className="bg-white p-6 rounded-3xl border border-[#E8D8D0] shadow-sm space-y-5">
                <div className="pb-3 border-b border-[#E8D8D0]">
                  <h3 className="font-serif text-xl font-bold text-[#2D2322]">📝 Hero Section (Topo do Site)</h3>
                  <p className="text-xs text-[#6E5A56]">Modifique a primeira dobra da página (topo do site).</p>
                </div>
                <Field label="Pequena chamada (Crachá / Badge)">
                  <input
                    value={seoConfig.heroH1}
                    onChange={(e) => { setSeoConfig({ ...seoConfig, heroH1: e.target.value }); setDirty(true); }}
                    className="input-admin"
                  />
                </Field>
                <Field label="Título Principal (H1 Grandão)">
                  <input
                    value={seoConfig.heroH2}
                    onChange={(e) => { setSeoConfig({ ...seoConfig, heroH2: e.target.value }); setDirty(true); }}
                    className="input-admin text-lg font-serif"
                  />
                </Field>
                <Field label="Parágrafo Descritivo (H2/H3)">
                  <textarea
                    rows={3}
                    value={seoConfig.heroH3}
                    onChange={(e) => { setSeoConfig({ ...seoConfig, heroH3: e.target.value }); setDirty(true); }}
                    className="input-admin resize-y"
                  />
                </Field>
                <Field label="Texto do Botão CTA">
                  <input
                    value={seoConfig.heroCtaText}
                    onChange={(e) => { setSeoConfig({ ...seoConfig, heroCtaText: e.target.value }); setDirty(true); }}
                    className="input-admin"
                  />
                </Field>
              </div>

              {/* === GEO: Localização === */}
              <div className="bg-white p-6 rounded-3xl border border-[#E8D8D0] shadow-sm space-y-5 md:col-span-2">
                <div className="pb-3 border-b border-[#E8D8D0]">
                  <h3 className="font-serif text-xl font-bold text-[#2D2322]">📍 GEO & Local SEO</h3>
                  <p className="text-xs text-[#6E5A56]">Endereço físico usado para SEO Local, rodapé e Schema.org.</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <Field label="Cidade">
                    <input
                      value={seoConfig.city}
                      onChange={(e) => { setSeoConfig({ ...seoConfig, city: e.target.value }); setDirty(true); }}
                      className="input-admin"
                    />
                  </Field>
                  <Field label="Estado (Sigla)">
                    <input
                      value={seoConfig.region}
                      onChange={(e) => { setSeoConfig({ ...seoConfig, region: e.target.value }); setDirty(true); }}
                      className="input-admin"
                    />
                  </Field>
                  <Field label="País">
                    <input
                      value={seoConfig.country}
                      onChange={(e) => { setSeoConfig({ ...seoConfig, country: e.target.value }); setDirty(true); }}
                      className="input-admin"
                    />
                  </Field>
                </div>
                <Field label="Endereço Completo">
                  <input
                    value={seoConfig.address}
                    onChange={(e) => { setSeoConfig({ ...seoConfig, address: e.target.value }); setDirty(true); }}
                    className="input-admin"
                  />
                </Field>
                <Field label="Rua (Versão Curta)">
                  <input
                    value={seoConfig.addressStreet}
                    onChange={(e) => { setSeoConfig({ ...seoConfig, addressStreet: e.target.value }); setDirty(true); }}
                    className="input-admin"
                  />
                </Field>
                <Field label="Query do Google Maps">
                  <input
                    value={seoConfig.mapsQuery}
                    onChange={(e) => { setSeoConfig({ ...seoConfig, mapsQuery: e.target.value }); setDirty(true); }}
                    className="input-admin"
                  />
                </Field>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function PromoRow({
  promo,
  pix,
  onChange,
  onRemove,
  onUp,
  onDown,
}: {
  promo: Promo;
  pix: PixConfig;
  onChange: (patch: Partial<Promo>) => void;
  onRemove: () => void;
  onUp: () => void;
  onDown: () => void;
}) {
  const isExpired = new Date(promo.endsAt).getTime() < Date.now();
  const status = !promo.active ? "Pausada" : isExpired ? "Esgotada" : "No ar";

  const payload = useMemo(
    () =>
      buildPixPayload({
        key: pix.key,
        merchantName: pix.merchantName,
        merchantCity: pix.merchantCity,
        amount: promo.price,
        txid: promo.id.replace(/[^a-zA-Z0-9]/g, "").slice(0, 25) || "PROMO",
        description: promo.badge,
      }),
    [promo, pix]
  );
  const qrUrl = useMemo(() => qrImageUrl(payload, 160), [payload]);

  return (
    <div className="rounded-3xl border border-[#E8D8D0] bg-white p-6 md:p-8 shadow-sm space-y-6">
      {/* Top Bar da Campanha */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#F2E7E1]">
        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={promo.active}
              onChange={(e) => onChange({ active: e.target.checked })}
              className="h-4 w-4 rounded accent-[#A86558]"
            />
            <span className="text-xs font-semibold text-[#2D2322]">Campanha Ativa</span>
          </label>

          <span
            className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
              status === "No ar"
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : status === "Pausada"
                ? "bg-amber-50 text-amber-700 border border-amber-200"
                : "bg-stone-100 text-stone-600 border border-stone-200"
            }`}
          >
            ● {status}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onUp}
            className="rounded-lg border border-[#E8D8D0] p-1.5 text-xs hover:bg-[#F9F4F0] text-[#6E5A56]"
            title="Subir posição"
          >
            ▲
          </button>
          <button
            type="button"
            onClick={onDown}
            className="rounded-lg border border-[#E8D8D0] p-1.5 text-xs hover:bg-[#F9F4F0] text-[#6E5A56]"
            title="Descer posição"
          >
            ▼
          </button>
          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg border border-red-200 bg-red-50 text-red-700 px-3 py-1 text-xs hover:bg-red-100 ml-2 font-medium"
          >
            Excluir
          </button>
        </div>
      </div>

      {/* Grid de Edição */}
      <div className="grid md:grid-cols-12 gap-6">
        <div className="md:col-span-8 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Selo / Badge (ex: Beauty Tech Day, Método Reviva™)">
              <input
                value={promo.badge}
                onChange={(e) => onChange({ badge: e.target.value })}
                className="input-admin"
              />
            </Field>
            <Field label="Desconto / Tag (ex: -25% OFF, Vagas Limitadas)">
              <input
                value={promo.discount}
                onChange={(e) => onChange({ discount: e.target.value })}
                className="input-admin"
              />
            </Field>
          </div>

          <Field label="Título Principal da Oferta">
            <input
              value={promo.title}
              onChange={(e) => onChange({ title: e.target.value })}
              className="input-admin"
            />
          </Field>

          <Field label="Descrição Curta">
            <textarea
              rows={2}
              value={promo.subtitle}
              onChange={(e) => onChange({ subtitle: e.target.value })}
              className="input-admin resize-none"
            />
          </Field>

          <div className="grid sm:grid-cols-3 gap-4">
            <Field label="Preço Pix (R$)">
              <input
                type="number"
                step="1"
                min="0"
                value={promo.price}
                onChange={(e) => onChange({ price: Number(e.target.value) || 0 })}
                className="input-admin"
              />
            </Field>
            <Field label="Preço Original (De)">
              <input
                type="number"
                step="1"
                min="0"
                value={promo.originalPrice ?? ""}
                onChange={(e) =>
                  onChange({
                    originalPrice: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                className="input-admin"
                placeholder="Opcional"
              />
            </Field>
            <Field label="Tratamento Vinculado">
              <select
                value={promo.serviceSlug ?? ""}
                onChange={(e) => onChange({ serviceSlug: e.target.value || undefined })}
                className="input-admin"
              >
                <option value="">Nenhum</option>
                {SERVICES.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.title}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Data e Hora de Encerramento">
              <input
                type="datetime-local"
                value={toDatetimeLocal(promo.endsAt)}
                onChange={(e) => onChange({ endsAt: fromDatetimeLocal(e.target.value) })}
                className="input-admin"
              />
            </Field>
            <Field label="Texto do Botão CTA">
              <input
                value={promo.ctaLabel}
                onChange={(e) => onChange({ ctaLabel: e.target.value })}
                className="input-admin"
              />
            </Field>
          </div>
        </div>

        {/* Preview do QR Code Pix */}
        <div className="md:col-span-4 p-5 rounded-2xl bg-[#FDFBF9] border border-[#E8D8D0] flex flex-col items-center justify-center text-center">
          <div className="text-[10px] uppercase tracking-wider text-[#A86558] font-bold mb-2">
            Pré-visualização do Pix
          </div>
          <img
            src={qrUrl}
            alt="QR Code Pix"
            width={140}
            height={140}
            className="rounded-lg shadow-sm border border-[#E8D8D0]"
          />
          <div className="mt-3 font-serif text-xl font-bold text-[#2D2322]">
            {formatPriceBRL(promo.price)}
          </div>
          <div className="text-[10px] text-[#6E5A56] mt-0.5">{promo.badge}</div>
        </div>
      </div>


    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-[#6E5A56] font-semibold">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
