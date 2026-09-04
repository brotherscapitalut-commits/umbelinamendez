import { useCart } from "@/lib/cart-store";
import { useDiscountRules } from "@/lib/discount-store";
import { formatPriceBRL } from "@/lib/leads-store";
import { Link } from "@tanstack/react-router";

export function CartFloatingBar() {
  const { items, totalRaw, totalWithDiscount, discountAmount, activeRule } = useCart();
  const rules = useDiscountRules().sort((a, b) => a.minItems - b.minItems);

  if (items.length === 0) return null;

  // Encontrar o limite máximo para a barra de progresso
  const maxItems = rules.length > 0 ? rules[rules.length - 1].minItems : 3;
  
  // Calcular o progresso de 0 a 100%
  const progressPercent = Math.min((items.length / maxItems) * 100, 100);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-6 bg-[#EBEBEB] border-t border-gray-300 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] md:pb-4 rounded-t-3xl md:rounded-none">
      <div className="max-w-xl mx-auto">
        
        {/* Top: Progress info */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-gray-800">Desconto progressivo</span>
          <span className="text-xs font-semibold text-gray-500 underline cursor-pointer hover:text-gray-700">Saiba mais</span>
        </div>

        {/* Progress Bar Container */}
        <div className="relative mb-6 mt-4">
          {/* Fundo da barra */}
          <div className="absolute top-1/2 left-0 right-0 h-1.5 -translate-y-1/2 bg-white rounded-full"></div>
          
          {/* Barra verde preenchida */}
          <div 
            className="absolute top-1/2 left-0 h-1.5 -translate-y-1/2 bg-[#127F70] rounded-full transition-all duration-500 ease-in-out"
            style={{ width: `${progressPercent}%` }}
          ></div>

          {/* Dots/Milestones */}
          <div className="relative flex justify-between items-center">
            {/* Ponto inicial */}
            <div className={`w-5 h-5 rounded-full z-10 transition-colors ${items.length > 0 ? 'bg-[#127F70]' : 'bg-white'}`}></div>
            
            {/* Regras */}
            {rules.map((rule) => {
              const isActive = items.length >= rule.minItems;
              return (
                <div key={rule.id} className="relative flex flex-col items-center">
                  <div className={`w-auto px-3 py-1 text-[11px] font-bold rounded-full mb-1 bg-white whitespace-nowrap shadow-sm border border-gray-100 ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
                    %{rule.discountPercent} off
                  </div>
                </div>
              );
            })}

            {/* Ponto Final (Estrela) */}
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm z-10">
              <span className="text-yellow-400 text-lg">★</span>
            </div>
          </div>
        </div>

        {/* Bottom: Cart info and Button */}
        <div className="flex items-end justify-between mt-2">
          <div className="flex flex-col">
            {activeRule && (
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-sm text-gray-500 line-through font-medium">{formatPriceBRL(totalRaw)}</span>
                <span className="text-xs font-bold bg-[#DFF0EE] text-[#127F70] px-2 py-0.5 rounded-md">
                  {formatPriceBRL(discountAmount)} off
                </span>
              </div>
            )}
            <span className="text-2xl font-bold text-gray-900 leading-none">
              {formatPriceBRL(totalWithDiscount)}
            </span>
          </div>

          <Link 
            to="/agendamento"
            className="bg-[#127F70] hover:bg-[#0E665A] transition-colors text-white font-bold py-3 px-6 rounded-xl shadow-md active:scale-95"
          >
            Meu carrinho ({items.length})
          </Link>
        </div>

      </div>
    </div>
  );
}
