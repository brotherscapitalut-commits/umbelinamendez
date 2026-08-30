import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SITE, waLink } from "@/lib/site";
import { useServices } from "@/lib/services-store";
import { trackEvent } from "@/lib/tracking";
import { WhatsAppFab } from "@/components/whatsapp-fab";
import { pageSchemaScripts } from "@/lib/schema";
import { Logo } from "@/components/logo";
import { AgendaPicker } from "@/components/agenda-picker";
import {
  bookAppointment,
  formatAppointmentWhatsAppMessage,
  type CalculatedSlot,
} from "@/lib/agenda-store";
import { saveLead } from "@/lib/leads-store";

export const Route = createFileRoute("/agendamento")({
  head: () => ({
    meta: [
      { title: "Agendamento de Consulta & Procedimentos — Dra. Umbelina Mendez | Brasília DF" },
      {
        name: "description",
        content:
          "Agende sua avaliação ou sessão para Método Reviva™, Conexão Materna (Pós-Parto), Pós-Operatório Cirúrgico ou Beauty Tech Day na Asa Norte (SEPN 513) ou em domicílio em Brasília — DF.",
      },
      { property: "og:title", content: "Agendar Atendimento — Dra. Umbelina Mendez" },
      {
        property: "og:description",
        content:
          "Escolha o tratamento, dia e horário com bloqueio em tempo real. Confirmação direta pelo WhatsApp com a Dra. Umbelina.",
      },
      { property: "og:locale", content: "pt_BR" },
      { property: "og:type", content: "website" },
      { name: "geo.region", content: "BR-DF" },
      { name: "geo.placename", content: "Brasília" },
      { name: "geo.position", content: "-15.7594;-47.8864" },
      { name: "ICBM", content: "-15.7594, -47.8864" },
      { name: "robots", content: "index,follow" },
    ],
    links: [{ rel: "canonical", href: "/agendamento" }],
    scripts: pageSchemaScripts({
      path: "/agendamento",
      name: "Agendar Atendimento — Dra. Umbelina Mendez",
      description:
        "Agendamento de avaliação e tratamentos com Dra. Umbelina Mendez em Brasília — DF.",
      type: "ContactPage",
      breadcrumbs: [
        { name: "Início", path: "/" },
        { name: "Agendamento", path: "/agendamento" },
      ],
    }),
  }),
  component: AgendamentoPage,
});

function todayOrNextValidISO() {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  if (d.getDay() === 0) d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function AgendamentoPage() {
  const services = useServices();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState<string>(services[0]?.slug || "");
  const [date, setDate] = useState<string>(todayOrNextValidISO());
  const [selectedSlot, setSelectedSlot] = useState<CalculatedSlot | null>(null);
  const [modality, setModality] = useState<"clinica" | "domiciliar">("clinica");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [bookingError, setBookingError] = useState("");

  const currentServiceObj = useMemo(
    () => services.find((s) => s.slug === service) ?? services[0],
    [service, services]
  );

  const valid =
    name.trim().length > 1 &&
    phone.trim().length >= 8 &&
    selectedSlot !== null &&
    (modality === "clinica" || address.trim().length > 3);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || !selectedSlot) {
      if (!selectedSlot) {
        setBookingError("Por favor, selecione um horário disponível na grade antes de prosseguir.");
      }
      return;
    }

    setBookingError("");

    // 1. Bloqueia o slot na agenda em tempo real
    const bookResult = bookAppointment({
      clientName: name,
      clientPhone: phone,
      clientEmail: email,
      service: currentServiceObj.title,
      serviceSlug: currentServiceObj.slug,
      date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      status: "confirmado",
      paymentStatus: "na_clinica",
      notes: `${modality === "domiciliar" ? `Domiciliar: ${address} | ` : ""}${notes}`.trim(),
    });

    if (!bookResult.success) {
      setBookingError(bookResult.error || "Este horário foi reservado por outro visitante. Escolha outro slot.");
      setSelectedSlot(null);
      return;
    }

    // 2. Salva lead
    saveLead({
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim() || undefined,
      serviceName: currentServiceObj.title,
      serviceSlug: currentServiceObj.slug,
      price: currentServiceObj.plans?.[0]?.price || 280,
      status: "confirmado" as any,
      preferredDate: date,
      preferredShift: selectedSlot.period === "manha" ? "Manhã" : "Tarde",
      notes: `Horário: ${selectedSlot.startTime} às ${selectedSlot.endTime}`,
    });

    trackEvent("lead", { source: "form_agendamento", service, value: 1, currency: "BRL" });

    // 3. Monta mensagem estruturada
    const waMsg = formatAppointmentWhatsAppMessage({
      clientName: name,
      clientPhone: phone,
      service: `${currentServiceObj.title} (${modality === "clinica" ? "Clínica Asa Norte" : "Domiciliar"})`,
      date,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      paymentMethod: "A combinar / Na clínica",
      price: currentServiceObj.plans?.[0]?.price,
    });

    window.location.href = waLink(waMsg, "form_agendamento", service);
  }

  return (
    <div className="min-h-screen bg-[#F9F4F0] text-[#2D2322]">
      <header className="border-b border-[#E8D8D0] backdrop-blur-md bg-[#F9F4F0]/90 sticky top-0 z-30">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <Logo size="sm" />
          <Link
            to="/"
            className="text-xs uppercase tracking-wider text-[#6E5A56] hover:text-[#A86558] font-semibold"
          >
            ← Voltar ao Início
          </Link>
        </div>
      </header>

      <section className="relative py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-6">
          <span className="text-xs uppercase tracking-[0.25em] text-[#A86558] font-semibold">
            Agendamento Inteligente em Tempo Real
          </span>
          <h1 className="mt-3 font-serif text-3xl sm:text-5xl md:text-6xl text-[#2D2322] font-semibold leading-[1.08]">
            Reserve seu <em className="text-[#A86558] italic font-normal">momento de cuidado</em>.
          </h1>
          <p className="mt-4 text-xs md:text-sm text-[#6E5A56] max-w-2xl leading-relaxed">
            Selecione o tratamento e escolha o horário diretamente no calendário da clínica. O horário selecionado será <b>bloqueado imediatamente</b> para o seu atendimento.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24 -mt-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-[#E8D8D0] rounded-3xl p-6 md:p-10 space-y-8 shadow-sm"
        >
          {/* Seção 1: Identificação */}
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A86558] font-bold">
              Passo 1
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#2D2322] mt-0.5">
              Seus Dados Pessoais
            </h2>
            <div className="grid md:grid-cols-3 gap-4 mt-4">
              <Field label="Nome Completo *">
                <input
                  required
                  maxLength={80}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={inputCls}
                  placeholder="Como prefere ser chamada(o)"
                />
              </Field>
              <Field label="WhatsApp com DDD *">
                <input
                  required
                  maxLength={20}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputCls}
                  placeholder="(61) 99999-9999"
                  inputMode="tel"
                />
              </Field>
              <Field label="E-mail (opcional)">
                <input
                  type="email"
                  maxLength={120}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputCls}
                  placeholder="seu@email.com"
                />
              </Field>
            </div>
          </div>

          {/* Seção 2: Tratamento & Modalidade */}
          <div className="pt-4 border-t border-[#F2E7E1]">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A86558] font-bold">
              Passo 2
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#2D2322] mt-0.5">
              Tratamento & Modalidade
            </h2>

            <div className="mt-4 space-y-4">
              <Field label="Selecione o Tratamento ou Protocolo *">
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className={inputCls}
                >
                  {services.map((s) => (
                    <option key={s.slug} value={s.slug}>
                      {s.title}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Modalidade de Atendimento *">
                <div className="grid grid-cols-2 gap-3 mt-1">
                  <button
                    type="button"
                    onClick={() => setModality("clinica")}
                    className={`py-3 px-4 rounded-xl border text-xs font-semibold tracking-wide transition ${
                      modality === "clinica"
                        ? "border-[#A86558] bg-[#F4EAE4] text-[#A86558]"
                        : "border-[#E8D8D0] bg-[#FDFBF9] text-[#6E5A56] hover:bg-white"
                    }`}
                  >
                    🏢 Consultório na Asa Norte (SEPN 513)
                  </button>
                  <button
                    type="button"
                    onClick={() => setModality("domiciliar")}
                    className={`py-3 px-4 rounded-xl border text-xs font-semibold tracking-wide transition ${
                      modality === "domiciliar"
                        ? "border-[#A86558] bg-[#F4EAE4] text-[#A86558]"
                        : "border-[#E8D8D0] bg-[#FDFBF9] text-[#6E5A56] hover:bg-white"
                    }`}
                  >
                    🏡 Atendimento Domiciliar no DF
                  </button>
                </div>
              </Field>

              {modality === "domiciliar" && (
                <Field label="Endereço Completo para Atendimento Domiciliar *">
                  <input
                    required
                    maxLength={200}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className={inputCls}
                    placeholder="Endereço, bairro e cidade no DF"
                  />
                </Field>
              )}
            </div>
          </div>

          {/* Seção 3: Calendário & Grade de Horários Inteligente */}
          <div className="pt-4 border-t border-[#F2E7E1]">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A86558] font-bold">
              Passo 3
            </span>
            <h2 className="font-serif text-2xl font-bold text-[#2D2322] mt-0.5 mb-4">
              Escolha seu Horário no Calendário
            </h2>

            <AgendaPicker
              selectedDate={date}
              onSelectDate={(newDate) => {
                setDate(newDate);
                setSelectedSlot(null);
                setBookingError("");
              }}
              selectedSlot={selectedSlot}
              onSelectSlot={(slot) => {
                setSelectedSlot(slot);
                setBookingError("");
              }}
            />

            {bookingError && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium text-center mt-4">
                ⚠️ {bookingError}
              </div>
            )}
          </div>

          {/* Seção 4: Observações e Confirmação */}
          <div className="pt-4 border-t border-[#F2E7E1] space-y-4">
            <Field label="Observações Clínicas (cirurgia realizada, tempo pós-parto, etc.)">
              <textarea
                maxLength={600}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={`${inputCls} min-h-[90px] resize-y`}
                placeholder="Descreva seu momento para planejarmos o protocolo ideal..."
              />
            </Field>

            {selectedSlot && (
              <div className="p-4 rounded-2xl bg-[#F4EAE4] border border-[#A86558]/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-[#A86558] font-bold">
                    Resumo do Agendamento
                  </div>
                  <div className="font-serif text-base md:text-lg font-bold text-[#2D2322] mt-0.5">
                    {currentServiceObj.title} • {date.split("-").reverse().join("/")} das {selectedSlot.startTime} às {selectedSlot.endTime}
                  </div>
                </div>
                <span className="inline-block text-xs font-semibold text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full shrink-0">
                  ✓ Vaga Disponível
                </span>
              </div>
            )}

            <div className="flex flex-wrap gap-4 items-center pt-2">
              <button
                type="submit"
                disabled={!valid}
                className="inline-flex items-center gap-2 rounded-full bg-[#A86558] text-white px-8 py-3.5 text-xs font-semibold tracking-wide hover:bg-[#8C4E43] disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(168,101,88,0.22)] transition"
              >
                Bloquear Horário e Confirmar no WhatsApp →
              </button>
              <Link
                to="/"
                className="text-xs text-[#6E5A56] hover:text-[#A86558] underline underline-offset-4"
              >
                Cancelar e voltar
              </Link>
            </div>
          </div>
        </form>
      </section>

      <WhatsAppFab />
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-[#E8D8D0] bg-[#FDFBF9] px-4 py-3 text-sm text-[#2D2322] outline-none focus:bg-white focus:ring-2 focus:ring-[#A86558]/60 focus:border-[#A86558] transition placeholder:text-[#6E5A56]/60";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-wider text-[#6E5A56] font-semibold">{label}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
