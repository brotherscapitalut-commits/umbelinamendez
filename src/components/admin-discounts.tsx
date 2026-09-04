import { useState } from "react";
import {
  type DiscountRule,
  saveDiscountRules,
  useDiscountRules,
} from "@/lib/discount-store";

export function AdminDiscounts() {
  const rules = useDiscountRules();
  const [editing, setEditing] = useState(false);
  const [localRules, setLocalRules] = useState<DiscountRule[]>([]);

  const startEditing = () => {
    setLocalRules([...rules]);
    setEditing(true);
  };

  const addRule = () => {
    setLocalRules([
      ...localRules,
      {
        id: `rule-${Math.random().toString(36).slice(2, 8)}`,
        minItems: 2,
        discountPercent: 10,
      },
    ]);
  };

  const removeRule = (id: string) => {
    setLocalRules(localRules.filter((r) => r.id !== id));
  };

  const updateRule = (id: string, field: keyof DiscountRule, value: any) => {
    setLocalRules(
      localRules.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const save = () => {
    saveDiscountRules(localRules);
    setEditing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-serif text-[#2D2322] font-semibold">
            Descontos Progressivos
          </h2>
          <p className="text-xs text-[#6E5A56] mt-1">
            Configure descontos automáticos baseados na quantidade de serviços no carrinho.
          </p>
        </div>
        {!editing ? (
          <button
            onClick={startEditing}
            className="rounded-full bg-white border border-[#E8D8D0] px-4 py-2 text-xs font-semibold text-[#8C4E43] hover:bg-[#F9F4F0] transition shadow-sm"
          >
            Editar Regras
          </button>
        ) : (
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(false)}
              className="rounded-full bg-white border border-[#E8D8D0] px-4 py-2 text-xs font-semibold text-[#6E5A56] hover:bg-[#F9F4F0] transition shadow-sm"
            >
              Cancelar
            </button>
            <button
              onClick={save}
              className="rounded-full bg-[#8C4E43] px-4 py-2 text-xs font-semibold text-white hover:bg-[#8C4E43]/90 transition shadow-sm"
            >
              Salvar Alterações
            </button>
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-[#E8D8D0] bg-white overflow-hidden shadow-sm">
        {(!editing ? rules : localRules).length === 0 ? (
          <div className="p-8 text-center text-xs text-[#6E5A56]">
            Nenhuma regra de desconto progressivo cadastrada.
          </div>
        ) : (
          <div className="divide-y divide-[#E8D8D0]">
            {(!editing ? rules : localRules)
              .sort((a, b) => a.minItems - b.minItems)
              .map((rule) => (
                <div
                  key={rule.id}
                  className="p-4 flex items-center justify-between gap-4"
                >
                  {editing ? (
                    <div className="flex items-center gap-4 flex-1">
                      <div className="flex-1">
                        <label className="block text-[10px] uppercase tracking-wider text-[#6E5A56] font-semibold mb-1">
                          A partir de (itens)
                        </label>
                        <input
                          type="number"
                          value={rule.minItems}
                          onChange={(e) =>
                            updateRule(rule.id, "minItems", Number(e.target.value))
                          }
                          className="w-full rounded-lg border border-[#E8D8D0] bg-[#FDFBF9] px-3 py-2 text-xs text-[#2D2322] outline-none focus:border-[#8C4E43] transition"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="block text-[10px] uppercase tracking-wider text-[#6E5A56] font-semibold mb-1">
                          Desconto (%)
                        </label>
                        <input
                          type="number"
                          value={rule.discountPercent}
                          onChange={(e) =>
                            updateRule(
                              rule.id,
                              "discountPercent",
                              Number(e.target.value)
                            )
                          }
                          className="w-full rounded-lg border border-[#E8D8D0] bg-[#FDFBF9] px-3 py-2 text-xs text-[#2D2322] outline-none focus:border-[#8C4E43] transition"
                        />
                      </div>
                      <button
                        onClick={() => removeRule(rule.id)}
                        className="mt-5 text-red-500 hover:text-red-700 text-xs font-semibold px-2"
                      >
                        Remover
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#F9F4F0] text-[#8C4E43] font-bold text-sm">
                        {rule.minItems}x
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-[#2D2322]">
                          A partir de {rule.minItems} serviços
                        </div>
                        <div className="text-xs text-[#6E5A56]">
                          Desconto de {rule.discountPercent}% no valor total
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
        {editing && (
          <div className="p-4 border-t border-[#E8D8D0] bg-[#FDFBF9]">
            <button
              onClick={addRule}
              className="w-full rounded-xl border border-dashed border-[#8C4E43]/40 bg-white py-3 text-xs font-semibold text-[#8C4E43] hover:bg-[#8C4E43]/5 hover:border-[#8C4E43] transition"
            >
              + Adicionar Regra
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
