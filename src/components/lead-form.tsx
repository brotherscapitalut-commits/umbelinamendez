import { useMemo, useState } from "react";
import { SERVICES, SITE, waLink } from "@/lib/site";
import { trackEvent } from "@/lib/tracking";

export function LeadForm({ defaultService }: { defaultService?: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [service, setService] = useState<string>(defaultService ?? SERVICES[0].slug);
  const [sent, setSent] = useState(false);

  const serviceTitle = useMemo(
    () => SERVICES.find((s) => s.slug === service)?.title ?? service,
    [service]
  );

  const valid = name.trim().length > 1 && phone.trim().length >= 8;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    const message = [
      `*Nova Solicitação de Avaliação — ${SITE.brand}*`,
      ``,
      `👤 *Nome:* ${name}`,
      `📱 *WhatsApp:* ${phone}`,
      email ? `✉️ *E-mail:* ${email}` : null,
      `💆‍♀️ *Tratamento de Interesse:* ${serviceTitle}`,
    ]
      .filter(Boolean)
      .join("\n");

    trackEvent("lead", {
      source: "form_lead",
      service,
      value: 1,
      currency: "BRL",
    });

    const mailHref = `mailto:${SITE.email}?subject=${encodeURIComponent(
      `Nova solicitação de avaliação — ${name} — ${serviceTitle}`
    )}&body=${encodeURIComponent(message.replace(/\*/g, ""))}`;
    try {
      window.open(mailHref, "_blank");
    } catch {}
    setSent(true);
    setTimeout(() => {
      window.location.href = waLink(message, "form_lead", service);
    }, 500);
  }

  if (sent) {
    return (
      <div
        className="bg-white border border-[#E8D8D0] rounded-3xl p-8 text-center"
        style={{ boxShadow: "0 10px 30px rgba(168, 101, 88, 0.07)" }}
      >
        <div className="font-serif text-3xl text-[#A86558] font-semibold">Solicitação Enviada! ✨</div>
        <p className="mt-3 text-sm text-[#6E5A56] leading-relaxed">
          Estamos te redirecionando ao WhatsApp da Dra. Umbelina Mendez para confirmar seu horário.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-[#E8D8D0] rounded-3xl p-6 md:p-8 space-y-4"
      style={{ boxShadow: "0 10px 30px rgba(168, 101, 88, 0.07)" }}
    >
      <div className="text-xs uppercase tracking-[0.25em] text-[#A86558] font-semibold">
        Atendimento Personalizado
      </div>
      <h3 className="font-serif text-3xl text-[#2D2322] font-semibold">
        Agende sua Avaliação
      </h3>
      <p className="text-xs text-[#6E5A56] leading-relaxed">
        Preencha os campos abaixo para receber um plano sob medida para suas necessidades.
      </p>

      <div className="grid sm:grid-cols-2 gap-3.5 pt-2">
        <input
          required
          maxLength={80}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
          placeholder="Seu nome completo"
        />
        <input
          required
          maxLength={20}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputCls}
          placeholder="WhatsApp com DDD"
          inputMode="tel"
        />
        <input
          type="email"
          maxLength={120}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={`${inputCls} sm:col-span-2`}
          placeholder="E-mail (opcional)"
        />
        <select
          value={service}
          onChange={(e) => setService(e.target.value)}
          className={`${inputCls} sm:col-span-2`}
        >
          {SERVICES.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={!valid}
        className="w-full inline-flex items-center justify-center rounded-full bg-[#A86558] text-white px-6 py-3.5 text-sm font-semibold tracking-wide hover:bg-[#8C4E43] disabled:opacity-40 transition shadow-[0_4px_14px_rgba(168,101,88,0.25)]"
      >
        Solicitar Atendimento via WhatsApp →
      </button>
      <p className="text-[11px] text-[#6E5A56] text-center">
        Atendimento clínico na Asa Norte (513 Norte) ou Domiciliar no DF.
      </p>
    </form>
  );
}

const inputCls =
  "w-full rounded-xl border border-[#E8D8D0] bg-[#FDFBF9] px-4 py-3 text-sm text-[#2D2322] outline-none focus:bg-white focus:ring-2 focus:ring-[#A86558]/60 focus:border-[#A86558] transition placeholder:text-[#6E5A56]/60";
