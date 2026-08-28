import { useEffect, useState } from "react";

export type SlotTemplate = {
  startTime: string; // "08:00"
  endTime: string; // "09:00"
  bufferEnd: string; // "09:20"
  period: "manha" | "tarde";
};

export type AppointmentStatus = "confirmado" | "bloqueado_admin" | "cancelado";

export type Appointment = {
  id: string;
  clientName: string;
  clientPhone: string;
  clientEmail?: string;
  service: string;
  serviceSlug?: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "08:00"
  endTime: string; // "09:00"
  status: AppointmentStatus;
  paymentStatus?: "pago_pix" | "pendente" | "na_clinica";
  price?: number;
  notes?: string;
  createdAt: string; // ISO
};

export type CalculatedSlot = {
  startTime: string;
  endTime: string;
  bufferEnd: string;
  period: "manha" | "tarde";
  isAvailable: boolean;
  status: "livre" | "ocupado" | "bloqueado_admin" | "passado" | "fechado";
  appointment?: Appointment;
};

const LS_AGENDA = "umbelina.agenda.v1";

// Grade Padrão Seg-Sex (60min sessão + 20min higienização = 80min bloco)
export const WEEKDAY_SLOTS: SlotTemplate[] = [
  { startTime: "08:00", endTime: "09:00", bufferEnd: "09:20", period: "manha" },
  { startTime: "09:20", endTime: "10:20", bufferEnd: "10:40", period: "manha" },
  { startTime: "10:40", endTime: "11:40", bufferEnd: "12:00", period: "manha" },
  { startTime: "13:00", endTime: "14:00", bufferEnd: "14:20", period: "tarde" },
  { startTime: "14:20", endTime: "15:20", bufferEnd: "15:40", period: "tarde" },
  { startTime: "15:40", endTime: "16:40", bufferEnd: "17:00", period: "tarde" },
  { startTime: "17:00", endTime: "18:00", bufferEnd: "18:20", period: "tarde" },
];

// Grade Padrão Sábado (08:00 às 13:00)
export const SATURDAY_SLOTS: SlotTemplate[] = [
  { startTime: "08:00", endTime: "09:00", bufferEnd: "09:20", period: "manha" },
  { startTime: "09:20", endTime: "10:20", bufferEnd: "10:40", period: "manha" },
  { startTime: "10:40", endTime: "11:40", bufferEnd: "12:00", period: "manha" },
  { startTime: "12:00", endTime: "13:00", bufferEnd: "13:20", period: "tarde" },
];

// Mock de agendamentos iniciais para teste
const DEFAULT_SAMPLE_APPOINTMENTS: Appointment[] = [
  {
    id: "apt-sample-1",
    clientName: "Mariana Costa",
    clientPhone: "(61) 98234-1122",
    service: "Método Reviva™ (Corporal)",
    serviceSlug: "metodo-reviva",
    date: getNextDateStr(1), // Amanhã
    startTime: "09:20",
    endTime: "10:20",
    status: "confirmado",
    paymentStatus: "pago_pix",
    price: 230,
    createdAt: new Date().toISOString(),
  },
  {
    id: "apt-sample-2",
    clientName: "Fernanda Silveira",
    clientPhone: "(61) 99188-7744",
    service: "Conexão Materna (Pós-Parto)",
    serviceSlug: "conexao-materna",
    date: getNextDateStr(1),
    startTime: "14:20",
    endTime: "15:20",
    status: "confirmado",
    paymentStatus: "pago_pix",
    price: 280,
    createdAt: new Date().toISOString(),
  },
  {
    id: "apt-sample-3",
    clientName: "Horário Reservado Clínica",
    clientPhone: "",
    service: "Higienização & Manutenção de Equipamentos",
    date: getNextDateStr(2),
    startTime: "08:00",
    endTime: "09:00",
    status: "bloqueado_admin",
    createdAt: new Date().toISOString(),
  },
];

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadAppointments(): Appointment[] {
  if (typeof window === "undefined") return DEFAULT_SAMPLE_APPOINTMENTS;
  return safeParse<Appointment[]>(
    window.localStorage.getItem(LS_AGENDA),
    DEFAULT_SAMPLE_APPOINTMENTS
  );
}

export function saveAppointments(list: Appointment[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_AGENDA, JSON.stringify(list));
  window.dispatchEvent(new Event("agenda:updated"));
}

export function getSlotTemplatesForDate(dateStr: string): SlotTemplate[] {
  if (!dateStr) return [];
  const parts = dateStr.split("-").map(Number);
  if (parts.length < 3) return [];
  const [year, month, day] = parts;
  const d = new Date(year, month - 1, day);
  const dayOfWeek = d.getDay(); // 0 = Dom, 6 = Sáb

  if (dayOfWeek === 0) return []; // Domingo fechado
  if (dayOfWeek === 6) return SATURDAY_SLOTS;
  return WEEKDAY_SLOTS;
}

export function getCalculatedSlots(dateStr: string): CalculatedSlot[] {
  const templates = getSlotTemplatesForDate(dateStr);
  if (templates.length === 0) return [];

  const allApts = loadAppointments();
  const dateApts = allApts.filter(
    (a) => a.date === dateStr && a.status !== "cancelado"
  );

  const now = new Date();
  const [y, m, d] = dateStr.split("-").map(Number);
  const isToday =
    now.getFullYear() === y && now.getMonth() + 1 === m && now.getDate() === d;
  const isPast =
    new Date(y, m - 1, d, 23, 59, 59).getTime() < now.getTime() && !isToday;

  return templates.map((tmpl) => {
    // Verifica se há agendamento para este slot
    const found = dateApts.find((a) => a.startTime === tmpl.startTime);

    if (found) {
      if (found.status === "bloqueado_admin") {
        return {
          ...tmpl,
          isAvailable: false,
          status: "bloqueado_admin",
          appointment: found,
        };
      }
      return {
        ...tmpl,
        isAvailable: false,
        status: "ocupado",
        appointment: found,
      };
    }

    if (isPast) {
      return {
        ...tmpl,
        isAvailable: false,
        status: "passado",
      };
    }

    // Se for hoje, verifica se o horário já passou
    if (isToday) {
      const [sh, sm] = tmpl.startTime.split(":").map(Number);
      const slotTime = new Date(y, m - 1, d, sh, sm);
      if (slotTime.getTime() <= now.getTime()) {
        return {
          ...tmpl,
          isAvailable: false,
          status: "passado",
        };
      }
    }

    return {
      ...tmpl,
      isAvailable: true,
      status: "livre",
    };
  });
}

export function bookAppointment(
  data: Omit<Appointment, "id" | "createdAt" | "status"> & {
    status?: AppointmentStatus;
  }
): { success: boolean; appointment?: Appointment; error?: string } {
  const slots = getCalculatedSlots(data.date);
  const targetSlot = slots.find((s) => s.startTime === data.startTime);

  if (!targetSlot || !targetSlot.isAvailable) {
    return {
      success: false,
      error: "Este horário acabou de ser ocupado. Por favor, escolha outro slot disponível.",
    };
  }

  const all = loadAppointments();
  const newApt: Appointment = {
    ...data,
    id: `apt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    status: data.status || "confirmado",
    createdAt: new Date().toISOString(),
  };

  all.push(newApt);
  saveAppointments(all);

  return {
    success: true,
    appointment: newApt,
  };
}

export function blockSlotAdmin(
  date: string,
  startTime: string,
  endTime: string,
  reason = "Bloqueio Administrativo"
) {
  const all = loadAppointments();
  const existing = all.find(
    (a) => a.date === date && a.startTime === startTime && a.status !== "cancelado"
  );
  if (existing) {
    existing.status = "bloqueado_admin";
    existing.service = reason;
  } else {
    all.push({
      id: `block-${Date.now()}`,
      clientName: "Bloqueio de Agenda",
      clientPhone: "",
      service: reason,
      date,
      startTime,
      endTime,
      status: "bloqueado_admin",
      createdAt: new Date().toISOString(),
    });
  }
  saveAppointments(all);
}

export function unblockOrCancelSlot(appointmentId: string) {
  const all = loadAppointments().filter((a) => a.id !== appointmentId);
  saveAppointments(all);
}

export function resetSampleAgenda() {
  saveAppointments(DEFAULT_SAMPLE_APPOINTMENTS);
}

export function useAgenda(dateStr: string) {
  const [slots, setSlots] = useState<CalculatedSlot[]>(() =>
    getCalculatedSlots(dateStr)
  );

  useEffect(() => {
    const refresh = () => setSlots(getCalculatedSlots(dateStr));
    refresh();
    window.addEventListener("agenda:updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("agenda:updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, [dateStr]);

  return slots;
}

export function useAllAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>(() =>
    loadAppointments()
  );

  useEffect(() => {
    const refresh = () => setAppointments(loadAppointments());
    refresh();
    window.addEventListener("agenda:updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("agenda:updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return appointments;
}

export function formatAppointmentWhatsAppMessage(params: {
  clientName: string;
  clientPhone: string;
  service: string;
  date: string;
  startTime: string;
  endTime: string;
  paymentMethod?: string;
  price?: number;
}) {
  const [y, m, d] = params.date.split("-");
  const formattedDate = d && m && y ? `${d}/${m}/${y}` : params.date;
  const priceFormatted = params.price
    ? ` • R$ ${params.price.toFixed(2).replace(".", ",")}`
    : "";

  return (
    `Olá Umbelina! Acabei de garantir minha vaga e agendar meu atendimento:\n\n` +
    `👤 *Paciente:* ${params.clientName}\n` +
    `📱 *WhatsApp:* ${params.clientPhone}\n` +
    `💆‍♀️ *Procedimento:* ${params.service}${priceFormatted}\n` +
    `🗓️ *Data:* ${formattedDate}\n` +
    `⏰ *Horário:* ${params.startTime} às ${params.endTime} (60 min)\n` +
    `💳 *Pagamento:* ${params.paymentMethod || "Pix Confirmado"}\n\n` +
    `Por favor, confirme meu horário na clínica! ♡`
  );
}

function getNextDateStr(daysAhead: number) {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  // Se cair em domingo (0), avança para segunda
  if (d.getDay() === 0) d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}
