import { useMemo, useState } from "react";
import {
  useAgenda,
  type CalculatedSlot,
  getCalculatedSlots,
} from "@/lib/agenda-store";

interface AgendaPickerProps {
  selectedDate: string; // "YYYY-MM-DD"
  onSelectDate: (date: string) => void;
  selectedSlot: CalculatedSlot | null;
  onSelectSlot: (slot: CalculatedSlot) => void;
  className?: string;
}

const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

const WEEKDAY_ABBR = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export function AgendaPicker({
  selectedDate,
  onSelectDate,
  selectedSlot,
  onSelectSlot,
  className = "",
}: AgendaPickerProps) {
  // Estado para navegação de mês no calendário
  const [currentYear, setCurrentYear] = useState(() => {
    const [y] = selectedDate ? selectedDate.split("-").map(Number) : [new Date().getFullYear()];
    return y;
  });
  const [currentMonth, setCurrentMonth] = useState(() => {
    const [, m] = selectedDate
      ? selectedDate.split("-").map(Number)
      : [0, new Date().getMonth() + 1];
    return m - 1; // 0-indexed
  });

  const slots = useAgenda(selectedDate);

  // Calcula matriz de dias do mês atual
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    const days: {
      day: number;
      dateStr: string;
      isCurrentMonth: boolean;
      isPast: boolean;
      isSunday: boolean;
    }[] = [];

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    // Dias do mês anterior para preencher a primeira linha
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      const m = currentMonth === 0 ? 12 : currentMonth;
      const y = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({
        day: d,
        dateStr,
        isCurrentMonth: false,
        isPast: true,
        isSunday: false,
      });
    }

    // Dias do mês atual
    for (let d = 1; d <= daysInMonth; d++) {
      const dateObj = new Date(currentYear, currentMonth, d);
      const isSunday = dateObj.getDay() === 0;
      const isPast = dateObj.getTime() < now.getTime();
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(
        d
      ).padStart(2, "0")}`;

      days.push({
        day: d,
        dateStr,
        isCurrentMonth: true,
        isPast,
        isSunday,
      });
    }

    // Dias do próximo mês para completar 35 ou 42 células
    const remaining = 35 - days.length >= 0 ? 35 - days.length : 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const m = currentMonth === 11 ? 1 : currentMonth + 2;
      const y = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({
        day: d,
        dateStr,
        isCurrentMonth: false,
        isPast: false,
        isSunday: false,
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  function prevMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  }

  // Formatação do cabeçalho da data selecionada
  const formattedSelectedDate = useMemo(() => {
    if (!selectedDate) return "";
    const [y, m, d] = selectedDate.split("-").map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, [selectedDate]);

  const [y, m, d] = selectedDate ? selectedDate.split("-").map(Number) : [0, 0, 0];
  const isSundaySelected = selectedDate ? new Date(y, m - 1, d).getDay() === 0 : false;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 1. Mini-Calendário White & Rose Gold */}
      <div className="rounded-3xl border border-[#E8D8D0] bg-white p-5 md:p-6 shadow-sm">
        {/* Topo do Calendário com Mês e Botões */}
        <div className="flex items-center justify-between pb-4 border-b border-[#F2E7E1]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C4E43] font-bold">
              Selecione o Dia
            </span>
            <h4 className="font-serif text-xl md:text-2xl font-bold text-[#2D2322] capitalize">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h4>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={prevMonth}
              className="h-8 w-8 rounded-full border border-[#E8D8D0] bg-[#FDFBF9] grid place-items-center text-xs text-[#2D2322] hover:border-[#8C4E43] transition"
              aria-label="Mês Anterior"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={nextMonth}
              className="h-8 w-8 rounded-full border border-[#E8D8D0] bg-[#FDFBF9] grid place-items-center text-xs text-[#2D2322] hover:border-[#8C4E43] transition"
              aria-label="Próximo Mês"
            >
              ›
            </button>
          </div>
        </div>

        {/* Grade dos Dias da Semana */}
        <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px] uppercase tracking-wider font-bold text-[#6E5A56] pb-1">
          {WEEKDAY_ABBR.map((w, idx) => (
            <div key={w} className={idx === 0 ? "text-stone-400" : ""}>
              {w}
            </div>
          ))}
        </div>

        {/* Células dos Dias */}
        <div className="grid grid-cols-7 gap-1.5 pt-1">
          {calendarDays.map((c) => {
            const isSelected = selectedDate === c.dateStr;
            const isDisabled = !c.isCurrentMonth || c.isPast || c.isSunday;

            return (
              <button
                key={c.dateStr}
                type="button"
                disabled={isDisabled}
                onClick={() => {
                  onSelectDate(c.dateStr);
                }}
                className={`h-9 md:h-10 rounded-xl text-xs font-semibold flex flex-col items-center justify-center transition relative ${
                  isSelected
                    ? "bg-[#8C4E43] text-white shadow-md font-bold scale-105 z-10"
                    : isDisabled
                    ? "text-stone-300 cursor-not-allowed bg-transparent"
                    : "text-[#2D2322] bg-[#FDFBF9] border border-[#E8D8D0]/60 hover:border-[#8C4E43] hover:bg-[#F4EAE4]/60"
                }`}
              >
                <span>{c.day}</span>
                {isSelected && (
                  <span className="h-1 w-1 rounded-full bg-white mt-0.5" />
                )}
              </button>
            );
          })}
        </div>

        <div className="mt-4 pt-3 border-t border-[#F2E7E1] flex flex-wrap items-center justify-between text-[10px] text-[#6E5A56] gap-2">
          <span>🕒 Atendimento: 60 min (+ 20 min higienização)</span>
          <span className="text-[#8C4E43] font-medium">● Domingo Fechado</span>
        </div>
      </div>

      {/* 2. Grade de Horários Disponíveis */}
      <div className="rounded-3xl border border-[#E8D8D0] bg-white p-5 md:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#F2E7E1]">
          <div>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#8C4E43] font-bold">
              Horários em Tempo Real
            </span>
            <h4 className="font-serif text-lg md:text-xl font-bold text-[#2D2322] capitalize">
              {formattedSelectedDate}
            </h4>
          </div>

          <span className="text-xs text-[#6E5A56]">
            {slots.filter((s) => s.isAvailable).length} vaga(s) disponível(is)
          </span>
        </div>

        {isSundaySelected ? (
          <div className="p-8 text-center text-xs text-[#6E5A56] bg-[#FDFBF9] rounded-2xl border border-[#E8D8D0] mt-4">
            A clínica está fechada aos domingos. Por favor, selecione um dia de Segunda a Sábado.
          </div>
        ) : slots.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#6E5A56] bg-[#FDFBF9] rounded-2xl border border-[#E8D8D0] mt-4">
            Nenhum slot configurado para esta data.
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {/* Manhã */}
            <div>
              <div className="text-[10px] uppercase tracking-wider text-[#8C4E43] font-bold mb-2.5 flex items-center gap-1.5">
                <span>☀️</span> Turno da Manhã (08:00 às 12:00)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {slots
                  .filter((s) => s.period === "manha")
                  .map((slot) => (
                    <SlotButton
                      key={slot.startTime}
                      slot={slot}
                      isSelected={selectedSlot?.startTime === slot.startTime}
                      onSelect={() => onSelectSlot(slot)}
                    />
                  ))}
              </div>
            </div>

            {/* Tarde */}
            <div className="pt-2">
              <div className="text-[10px] uppercase tracking-wider text-[#8C4E43] font-bold mb-2.5 flex items-center gap-1.5">
                <span>⛅</span> Turno da Tarde (13:00 às 18:00)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {slots
                  .filter((s) => s.period === "tarde")
                  .map((slot) => (
                    <SlotButton
                      key={slot.startTime}
                      slot={slot}
                      isSelected={selectedSlot?.startTime === slot.startTime}
                      onSelect={() => onSelectSlot(slot)}
                    />
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SlotButton({
  slot,
  isSelected,
  onSelect,
}: {
  slot: CalculatedSlot;
  isSelected: boolean;
  onSelect: () => void;
}) {
  if (!slot.isAvailable) {
    const label =
      slot.status === "bloqueado_admin"
        ? "Indisponível"
        : slot.status === "ocupado"
        ? "Ocupado"
        : "Encerrado";

    return (
      <div
        className="p-3 rounded-2xl border border-stone-200 bg-stone-50 text-stone-400 opacity-60 select-none flex flex-col justify-between"
        title="Horário já reservado ou indisponível"
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs font-bold line-through">
            {slot.startTime}
          </span>
          <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-stone-200 text-stone-600">
            {label}
          </span>
        </div>
        <div className="text-[10px] text-stone-400 mt-1">até {slot.endTime}</div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
        isSelected
          ? "border-2 border-[#8C4E43] bg-[#F4EAE4] shadow-sm scale-102"
          : "border-[#E8D8D0] bg-[#FDFBF9] hover:border-[#8C4E43] hover:bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <span
          className={`font-mono text-xs md:text-sm font-bold ${
            isSelected ? "text-[#8C4E43]" : "text-[#2D2322]"
          }`}
        >
          {slot.startTime}
        </span>
        <span
          className={`text-[9px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded-full ${
            isSelected
              ? "bg-[#8C4E43] text-white"
              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
          }`}
        >
          {isSelected ? "Selecionado ✓" : "Livre"}
        </span>
      </div>

      <div className="text-[10px] text-[#6E5A56] mt-1.5 flex items-center justify-between">
        <span>até {slot.endTime}</span>
        <span className="text-[9px] text-[#8C4E43] font-medium">60 min</span>
      </div>
    </button>
  );
}
