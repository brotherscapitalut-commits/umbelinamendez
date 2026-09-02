import { useEffect, useMemo, useState } from "react";
import { buildPixPayload, qrImageUrl } from "@/lib/pix";
import { SERVICES, SITE, waLink } from "@/lib/site";
import { trackEvent } from "@/lib/tracking";
import { loadPix } from "@/lib/promo-store";
import {
  saveLead,
  updateLeadStatus,
  formatPriceBRL,
  type Lead,
} from "@/lib/leads-store";
import {
  bookAppointment,
  formatAppointmentWhatsAppMessage,
  type CalculatedSlot,
} from "@/lib/agenda-store";
import { AgendaPicker } from "./agenda-picker";
import { MonogramUM } from "./logo";

export type CheckoutItem = {
  id?: string;
  badge?: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  serviceSlug?: string;
  emoji?: string;
};

type Props = {
  promo: CheckoutItem;
  onClose: () => void;
};

const BEST_HOURS = [
  "Qualquer Horário",
  "Manhã (08h às 12h)",
  "Tarde (13h às 18h)",
  "Noite (18h às 20h)",
];

export function PixCheckout({ promo, onClose }: Props) {
  // Passos: 1 = Identificação, 2 = Pagamento Pix, 3 = Agendamento com Bloqueio de Horário, 4 = Comprovante Confirmado
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Dados do Lead (Passo 1)
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bestContactTime, setBestContactTime] = useState(BEST_HOURS[0]);
  const [leadId, setLeadId] = useState<string>("");

  // Dados do Agendamento Inteligente (Passo 3)
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) d.setDate(d.getDate() + 1); // evita domingo
    return d.toISOString().slice(0, 10);
  });
  const [selectedSlot, setSelectedSlot] = useState<CalculatedSlot | null>(null);
  const [bookingError, setBookingError] = useState<string>("");
  const [voucherCode, setVoucherCode] = useState<string>("");

  // Estado do Pix (Passo 2)
  const [copied, setCopied] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(15 * 60); // 15 minutos

  const pixCfg = useMemo(() => loadPix(), []);
  const payload = useMemo(
    () =>
      buildPixPayload({
        key: pixCfg.key,
        merchantName: pixCfg.merchantName,
        merchantCity: pixCfg.merchantCity,
        amount: promo.price,
        txid: (promo.id || "RESERVA").replace(/[^a-zA-Z0-9]/g, "").slice(0, 25) || "RESERVA",
        description: promo.badge || promo.title,
      }),
    [promo, pixCfg]
  );
  const qrUrl = useMemo(() => qrImageUrl(payload, 320), [payload]);

  // Contador de 15 minutos para expiração do Pix
  useEffect(() => {
    if (step !== 2) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          if (leadId) {
            updateLeadStatus(leadId, "expirado");
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [step, leadId]);

  // Bloqueio de scroll do body e tecla ESC
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  // Passo 1 -> Passo 2 (Salva Lead como 'pendente_pix')
  function handleAdvanceToPix(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || phone.trim().length < 8) return;

    const saved = saveLead({
      name: name.trim(),
      phone: phone.trim(),
      bestContactTime,
      serviceName: promo.title,
      serviceSlug: promo.serviceSlug,
      price: promo.price,
      status: "pendente_pix",
    });

    setLeadId(saved.id);
    setStep(2);

    trackEvent("begin_checkout", {
      lead_id: saved.id,
      item: promo.title,
      value: promo.price,
      currency: "BRL",
    });
  }

  // Copiar código Pix
  async function copyPayload() {
    try {
      await navigator.clipboard.writeText(payload);
      setCopied(true);
      trackEvent("pix_copy", { promo: promo.title, value: promo.price });
      setTimeout(() => setCopied(false), 2400);
    } catch {
      const el = document.createElement("textarea");
      el.value = payload;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  }

  // Passo 2 -> Passo 3 (Confirmação de Pagamento pelo cliente e transição para o calendário)
  function handleConfirmPaid() {
    if (leadId) {
      updateLeadStatus(leadId, "pago", {
        notes: `Pix confirmado pelo cliente - R$ ${promo.price.toFixed(2)}`,
      });
    }

    trackEvent("purchase", {
      lead_id: leadId,
      promo: promo.title,
      value: promo.price,
      currency: "BRL",
      payment_method: "pix",
    });

    setStep(3);
  }

  // Enviar Comprovante Direto pelo WhatsApp no Passo 2
  function handleSendReceiptOnly() {
    const confirmMessage =
      `Olá Umbelina! Acabei de pagar via *Pix* a reserva de *${promo.title}* no valor de *${formatPriceBRL(
        promo.price
      )}*.\n` +
      `👤 *Nome:* ${name}\n` +
      `📱 *WhatsApp:* ${phone}\n\n` +
      `Segue meu comprovante em anexo para confirmar minha vaga! ✨`;

    window.open(waLink(confirmMessage, "pix_confirmation", promo.serviceSlug), "_blank");
  }

  // Formatação detalhada da data selecionada
  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return "";
    const [y, m, d] = selectedDate.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, [selectedDate]);

  // Passo 3: Concluir agendamento com bloqueio em tempo real
  function handleFinishBooking() {
    if (!selectedSlot) {
      setBookingError("Por favor, selecione um dia e horário disponível antes de prosseguir.");
      return;
    }

    setBookingError("");
    const generatedVoucher = `UM-${Math.random().toString(36).slice(2, 7).toUpperCase()}-${new Date().getFullYear()}`;
    setVoucherCode(generatedVoucher);

    // 1. Realiza o bloqueio do horário na agenda em tempo real
    const bookResult = bookAppointment({
      clientName: name,
      clientPhone: phone,
      service: promo.title,
      serviceSlug: promo.serviceSlug,
      date: selectedDate,
      startTime: selectedSlot.startTime,
      endTime: selectedSlot.endTime,
      price: promo.price,
      paymentStatus: "pago_pix",
      status: "confirmado",
      notes: `Voucher: ${generatedVoucher} | Pago via Pix R$ ${promo.price.toFixed(2)}`,
    });

    if (!bookResult.success) {
      setBookingError(bookResult.error || "Este horário acabou de ser ocupado. Por favor, escolha outro horário.");
      setSelectedSlot(null);
      return;
    }

    // 2. Atualiza o lead com os dados do agendamento confirmado
    if (leadId) {
      updateLeadStatus(leadId, "pago", {
        preferredDate: selectedDate,
        preferredShift: selectedSlot.period === "manha" ? "Manhã" : "Tarde",
        notes: `Horário Confirmado e Bloqueado: ${selectedDate} das ${selectedSlot.startTime} às ${selectedSlot.endTime} (Voucher ${generatedVoucher})`,
      });
    }

    // 3. Monta mensagem completa e detalhada para o WhatsApp da clínica
    const [y, m, d] = selectedDate.split("-");
    const dateBr = d && m && y ? `${d}/${m}/${y}` : selectedDate;

    const waMsg =
      `✨ *COMPROVANTE DE AGENDAMENTO & PAGAMENTO PIX* ✨\n` +
      `*Clínica Dra. Umbelina Mendez — Bióloga Esteta*\n\n` +
      `👤 *Paciente:* ${name}\n` +
      `📱 *WhatsApp:* ${phone}\n` +
      `💆‍♀️ *Procedimento Pago:* ${promo.title}\n` +
      `💰 *Valor:* ${formatPriceBRL(promo.price)} (Pix Confirmado)\n` +
      `🗓️ *Data Agendada:* ${dateBr} (${formattedSelectedDate.split(",")[0]})\n` +
      `⏰ *Horário Reservado:* ${selectedSlot.startTime} às ${selectedSlot.endTime} (60 min)\n` +
      `🏥 *Local:* Clínica Asa Norte — SEPN 513 Bloco A, Sala 110\n` +
      `🔖 *Código do Voucher:* ${generatedVoucher}\n\n` +
      `✅ *Status:* Vaga garantida e horário bloqueado no sistema da clínica.`;

    setStep(4);

    try {
      window.open(waLink(waMsg, "pix_confirmation", promo.serviceSlug), "_blank");
    } catch {
      window.location.href = waLink(waMsg, "pix_confirmation", promo.serviceSlug);
    }
  }

  // Formatador do contador mm:ss
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isTimeExpired = secondsLeft === 0;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 bg-[#2D2322]/80 backdrop-blur-sm animate-[fadeIn_.2s_ease-out] overflow-y-auto"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Reserva — ${promo.title}`}
    >
      <div
        className="relative w-full max-w-xl my-4 sm:my-8 overflow-hidden rounded-[2.5rem] bg-white border border-[#E8D8D0] shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabeçalho Rose Gold */}
        <div
          className="p-6 text-white relative"
          style={{
            background: "linear-gradient(135deg, #8C4A3E 0%, #8C4E43 50%, #B76E79 100%)",
          }}
        >
          <button
            aria-label="Fechar"
            onClick={onClose}
            className="absolute top-4 right-5 text-white/80 hover:text-white text-2xl leading-none transition"
          >
            ×
          </button>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 backdrop-blur px-3 py-1 text-[10px] uppercase tracking-[0.2em] font-semibold">
              {promo.emoji ?? "✦"} {promo.badge || "Reserva Exclusiva"}
            </span>

            {/* Stepper Indicator */}
            <div className="flex items-center gap-1.5 ml-auto text-[10px] font-semibold text-white/90 mr-6">
              <span
                className={`h-2 w-2 rounded-full ${
                  step === 1 ? "bg-white ring-2 ring-white/40" : "bg-white/50"
                }`}
              />
              <span
                className={`h-2 w-2 rounded-full ${
                  step === 2 ? "bg-white ring-2 ring-white/40" : "bg-white/50"
                }`}
              />
              <span
                className={`h-2 w-2 rounded-full ${
                  step >= 3 ? "bg-white ring-2 ring-white/40" : "bg-white/50"
                }`}
              />
              <span className="ml-1 tracking-wider">
                {step === 4 ? "CONFIRMADO ✓" : `ETAPA ${step}/3`}
              </span>
            </div>
          </div>

          <h3 className="mt-3 font-serif text-2xl sm:text-3xl leading-tight font-semibold">
            {promo.title}
          </h3>

          <div className="mt-2.5 flex items-baseline gap-3">
            {promo.originalPrice && (
              <span className="text-white/70 line-through text-xs">
                {formatPriceBRL(promo.originalPrice)}
              </span>
            )}
            <span className="font-serif text-3xl sm:text-4xl font-bold">
              {formatPriceBRL(promo.price)}
            </span>
            {step >= 3 ? (
              <span className="rounded-full bg-emerald-500 text-white px-3 py-0.5 text-xs font-bold shadow-sm animate-pulse">
                ✓ PAGO VIA PIX
              </span>
            ) : promo.discount ? (
              <span className="rounded-full bg-white text-[#8C4E43] px-2.5 py-0.5 text-xs font-bold shadow-sm">
                {promo.discount}
              </span>
            ) : null}
          </div>
        </div>

        {/* Corpo Dinâmico por Etapa */}
        <div className="p-5 md:p-8 bg-[#FDFBF9] max-h-[78vh] overflow-y-auto">
          {/* ============================================================ */}
          {/* PASSO 1: IDENTIFICAÇÃO DO CLIENTE */}
          {/* ============================================================ */}
          {step === 1 && (
            <form onSubmit={handleAdvanceToPix} className="space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C4E43] font-bold">
                  Passo 1 de 3
                </span>
                <h4 className="font-serif text-2xl text-[#2D2322] font-semibold mt-0.5">
                  Quem vai usufruir desta sessão?
                </h4>
                <p className="text-xs text-[#6E5A56] mt-1 leading-relaxed">
                  Informe seus dados para vincularmos a sua vaga exclusiva na agenda da clínica.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <label className="block">
                  <span className="text-[11px] uppercase tracking-wider text-[#6E5A56] font-semibold">
                    Nome Completo *
                  </span>
                  <input
                    required
                    maxLength={80}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Seu nome completo"
                    className={inputCls}
                    autoFocus
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] uppercase tracking-wider text-[#6E5A56] font-semibold">
                    WhatsApp com DDD *
                  </span>
                  <input
                    required
                    maxLength={20}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(61) 99999-9999"
                    inputMode="tel"
                    className={inputCls}
                  />
                </label>

                <label className="block">
                  <span className="text-[11px] uppercase tracking-wider text-[#6E5A56] font-semibold">
                    Melhor Horário para Contato
                  </span>
                  <select
                    value={bestContactTime}
                    onChange={(e) => setBestContactTime(e.target.value)}
                    className={inputCls}
                  >
                    {BEST_HOURS.map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={!name.trim() || phone.trim().length < 8}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#8C4E43] text-white py-3.5 text-xs font-semibold tracking-wide hover:bg-[#8C4E43] disabled:opacity-40 disabled:cursor-not-allowed transition shadow-[0_4px_16px_rgba(168,101,88,0.25)]"
                >
                  Avançar para Pagamento Pix →
                </button>
                <p className="mt-2 text-[10px] text-center text-[#6E5A56]">
                  Garantia de atendimento individualizado na Asa Norte ou em Domicílio.
                </p>
              </div>
            </form>
          )}

          {/* ============================================================ */}
          {/* PASSO 2: PAGAMENTO PIX + CONTADOR REGRESSIVO */}
          {/* ============================================================ */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C4E43] font-bold">
                    Passo 2 de 3
                  </span>
                  <h4 className="font-serif text-2xl text-[#2D2322] font-semibold mt-0.5">
                    Pagamento Instantâneo via Pix
                  </h4>
                </div>

                {/* Badge de Expiração 15 Minutos */}
                <div
                  className={`rounded-full px-3 py-1 text-xs font-mono font-bold tracking-wider border ${
                    isTimeExpired
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-[#F4EAE4] text-[#8C4E43] border-[#E8D8D0]"
                  }`}
                >
                  ⏱️ {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
                </div>
              </div>

              {isTimeExpired ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-800 text-center">
                  O tempo de reserva temporária expirou. Você ainda pode efetuar o pagamento e confirmar no WhatsApp.
                </div>
              ) : null}

              {/* Bloco QR Code e Instruções */}
              <div className="grid sm:grid-cols-[auto_1fr] gap-4 items-center bg-white p-4 rounded-2xl border border-[#E8D8D0]">
                <div className="mx-auto rounded-xl bg-white p-2 border border-[#E8D8D0]">
                  <img
                    src={qrUrl}
                    alt="QR Code Pix"
                    width={150}
                    height={150}
                    className="block rounded-lg"
                  />
                </div>
                <ol className="text-xs text-[#6E5A56] space-y-1.5 list-decimal list-inside leading-relaxed">
                  <li>Abra o aplicativo do seu banco e escolha <b>Pix</b>.</li>
                  <li>Escaneie o QR Code ou use o <b>Copia e Cola</b> abaixo.</li>
                  <li>Confirme o valor de <b>{formatPriceBRL(promo.price)}</b>.</li>
                  <li>Clique em <b>Confirmar Pagamento e Escolher Horário</b>.</li>
                </ol>
              </div>

              {/* Copia e Cola */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-[#6E5A56] font-semibold">
                  Pix Copia e Cola
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    readOnly
                    value={payload}
                    onFocus={(e) => e.currentTarget.select()}
                    className="flex-1 rounded-xl border border-[#E8D8D0] bg-white px-3 py-2 text-xs font-mono text-[#2D2322] truncate outline-none focus:ring-2 focus:ring-[#8C4E43]/60"
                  />
                  <button
                    onClick={copyPayload}
                    className="rounded-xl bg-[#8C4E43] text-white px-4 py-2 text-xs font-semibold hover:bg-[#8C4E43] transition shadow-sm shrink-0"
                  >
                    {copied ? "Copiado ✓" : "Copiar"}
                  </button>
                </div>
                <p className="mt-1.5 text-[10px] text-[#6E5A56]">
                  Chave: <b>{pixCfg.key}</b> — Titular: {pixCfg.merchantName}.
                </p>
              </div>

              {/* Botões de Ação do Passo 2 */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmPaid}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#8C4E43] text-white py-3.5 text-xs font-semibold tracking-wide hover:bg-[#8C4E43] transition shadow-[0_4px_16px_rgba(168,101,88,0.25)]"
                >
                  ✓ Confirmar Pagamento e Escolher Horário →
                </button>

                <button
                  type="button"
                  onClick={handleSendReceiptOnly}
                  className="w-full inline-flex items-center justify-center rounded-full border border-[#E8D8D0] bg-white py-2.5 text-xs font-semibold text-[#2D2322] hover:bg-[#FDFBF9] transition"
                >
                  Enviar Comprovante via WhatsApp
                </button>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* PASSO 3: AGENDAMENTO INTELIGENTE COM BLOQUEIO DE SLOTS */}
          {/* ============================================================ */}
          {step === 3 && (
            <div className="space-y-6 animate-[fadeIn_.3s_ease-out]">
              {/* Card de Confirmação do Pagamento & Identificação */}
              <div className="p-4 rounded-3xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-600 text-white grid place-items-center font-bold text-lg shrink-0 shadow-sm">
                    ✓
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-emerald-800 font-bold">
                      Pagamento Pix Confirmado
                    </div>
                    <div className="text-sm font-bold text-[#2D2322]">
                      {name || "Paciente"} • {phone}
                    </div>
                    <div className="text-xs text-[#6E5A56]">
                      {promo.title} ({formatPriceBRL(promo.price)})
                    </div>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-white/80 border border-emerald-300 px-3 py-1 rounded-full shrink-0">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                  Pronto para Agendar
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C4E43] font-bold">
                  Passo 3 de 3 • Agendamento
                </span>
                <h4 className="font-serif text-2xl sm:text-3xl text-[#2D2322] font-semibold mt-0.5">
                  Selecione o Dia e Horário Desejado
                </h4>
                <p className="text-xs text-[#6E5A56] mt-1 leading-relaxed">
                  Escolha seu horário no calendário abaixo. Ele será <b>bloqueado imediatamente em tempo real</b> no sistema da clínica para o seu procedimento.
                </p>
              </div>

              {/* Calendário & Grade de Horários Inteligente */}
              <AgendaPicker
                selectedDate={selectedDate}
                onSelectDate={(newDate) => {
                  setSelectedDate(newDate);
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
                <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium text-center">
                  ⚠️ {bookingError}
                </div>
              )}

              {/* Voucher de Pré-Visualização */}
              {selectedSlot && (
                <div className="p-5 rounded-3xl bg-white border-2 border-[#8C4E43] shadow-sm relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-[#8C4E43] text-white text-[10px] uppercase tracking-wider font-bold px-4 py-1 rounded-bl-2xl">
                    Vaga Selecionada
                  </div>

                  <div className="text-[10px] uppercase tracking-wider text-[#8C4E43] font-bold">
                    Resumo da Reserva na Clínica
                  </div>
                  <div className="font-serif text-xl font-bold text-[#2D2322] mt-1">
                    {formattedSelectedDate}
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[#8C4E43] mt-1">
                    <span>⏰ {selectedSlot.startTime} às {selectedSlot.endTime}</span>
                    <span>•</span>
                    <span>60 min de sessão</span>
                  </div>
                  <div className="text-xs text-[#6E5A56] mt-2 pt-2 border-t border-[#F2E7E1]">
                    📍 <b>Local:</b> SEPN 513, Edifício Bittar I, Sala 110 – Asa Norte
                  </div>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="button"
                  disabled={!selectedSlot}
                  onClick={handleFinishBooking}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#8C4E43] text-white py-4 text-xs font-semibold tracking-wide hover:bg-[#8C4E43] disabled:opacity-40 disabled:cursor-not-allowed transition shadow-[0_4px_16px_rgba(168,101,88,0.25)]"
                >
                  <svg viewBox="0 0 32 32" width="18" height="18" fill="currentColor" aria-hidden="true">
                    <path d="M19.11 17.37c-.28-.14-1.65-.81-1.9-.9-.26-.09-.44-.14-.63.14-.19.28-.72.9-.88 1.09-.16.19-.32.21-.6.07-.28-.14-1.17-.43-2.23-1.38-.82-.73-1.38-1.63-1.54-1.9-.16-.28-.02-.43.12-.57.13-.13.28-.32.42-.49.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.63-1.52-.86-2.08-.23-.55-.47-.48-.63-.49h-.54c-.19 0-.49.07-.75.35-.26.28-.98.96-.98 2.34s1 2.72 1.14 2.91c.14.19 1.98 3.02 4.8 4.24.67.29 1.19.46 1.6.59.67.21 1.28.18 1.77.11.54-.08 1.65-.67 1.89-1.32.23-.65.23-1.2.16-1.32-.07-.12-.26-.19-.54-.33zM16.02 5.33c-5.87 0-10.65 4.78-10.65 10.65 0 1.87.49 3.7 1.42 5.31L5 27l5.87-1.54c1.55.85 3.31 1.3 5.1 1.3h.01c5.87 0 10.65-4.78 10.65-10.65 0-2.85-1.11-5.52-3.12-7.53a10.61 10.61 0 00-7.49-3.25z" />
                  </svg>
                  Bloquear Horário e Enviar Confirmação no WhatsApp →
                </button>
                <p className="mt-2 text-[10px] text-center text-[#6E5A56]">
                  A Dra. Umbelina Mendez receberá instantaneamente seu agendamento com nome, valor pago e horário.
                </p>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* PASSO 4: VOUCHER CONFIRMADO & TELA DE SUCESSO */}
          {/* ============================================================ */}
          {step === 4 && (
            <div className="space-y-6 text-center animate-[fadeIn_.3s_ease-out]">
              <div className="h-16 w-16 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-700 grid place-items-center text-3xl mx-auto shadow-sm">
                ✓
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-[0.25em] text-emerald-800 font-bold">
                  Agendamento & Pagamento Confirmados
                </span>
                <h4 className="font-serif text-3xl text-[#2D2322] font-semibold mt-1">
                  Seu horário está garantido!
                </h4>
                <p className="text-xs text-[#6E5A56] mt-1.5 leading-relaxed">
                  Os dados do seu atendimento foram bloqueados no sistema e enviados para o WhatsApp da Dra. Umbelina Mendez.
                </p>
              </div>

              {/* Ticket do Voucher */}
              <div className="p-6 rounded-3xl bg-white border border-[#E8D8D0] shadow-md text-left space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-[#F2E7E1]">
                  <span className="text-[10px] uppercase tracking-wider text-[#8C4E43] font-bold">
                    VOUCHER OFICIAL
                  </span>
                  <span className="font-mono text-xs font-bold text-[#2D2322] bg-[#F4EAE4] px-2 py-0.5 rounded-md">
                    {voucherCode || "UM-CONFIRMADO"}
                  </span>
                </div>

                <div className="space-y-1 text-xs text-[#2D2322]">
                  <div><b>Paciente:</b> {name}</div>
                  <div><b>WhatsApp:</b> {phone}</div>
                  <div><b>Procedimento:</b> {promo.title}</div>
                  <div><b>Valor:</b> {formatPriceBRL(promo.price)} <span className="text-emerald-700 font-semibold">(Pago via Pix)</span></div>
                  <div><b>Data:</b> {formattedSelectedDate}</div>
                  <div><b>Horário Reservado:</b> {selectedSlot?.startTime} às {selectedSlot?.endTime} (60 min)</div>
                  <div><b>Local:</b> SEPN 513, Edifício Bittar I, Sala 110 — Asa Norte, Brasília</div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full inline-flex items-center justify-center rounded-full bg-[#8C4E43] text-white py-3.5 text-xs font-semibold hover:bg-[#8C4E43] transition shadow-md"
                >
                  Concluir e Fechar Janela
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const [y, m, d] = selectedDate.split("-");
                    const dateBr = d && m && y ? `${d}/${m}/${y}` : selectedDate;
                    const waMsg =
                      `✨ *COMPROVANTE DE AGENDAMENTO & PAGAMENTO PIX* ✨\n` +
                      `*Clínica Dra. Umbelina Mendez — Bióloga Esteta*\n\n` +
                      `👤 *Paciente:* ${name}\n` +
                      `📱 *WhatsApp:* ${phone}\n` +
                      `💆‍♀️ *Procedimento Pago:* ${promo.title}\n` +
                      `💰 *Valor:* ${formatPriceBRL(promo.price)} (Pix Confirmado)\n` +
                      `🗓️ *Data Agendada:* ${dateBr}\n` +
                      `⏰ *Horário Reservado:* ${selectedSlot?.startTime} às ${selectedSlot?.endTime}\n` +
                      `🔖 *Código:* ${voucherCode}\n\n` +
                      `Por favor, confirme meu agendamento! ♡`;
                    window.open(waLink(waMsg, "pix_confirmation", promo.serviceSlug), "_blank");
                  }}
                  className="text-xs text-[#8C4E43] hover:underline underline-offset-4 font-semibold"
                >
                  Reabrir conversa no WhatsApp Oficial →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-xl border border-[#E8D8D0] bg-white px-3.5 py-2.5 text-xs text-[#2D2322] outline-none focus:ring-2 focus:ring-[#8C4E43]/60 focus:border-[#8C4E43] transition placeholder:text-[#6E5A56]/60 mt-1";
