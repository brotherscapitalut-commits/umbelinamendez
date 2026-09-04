import { useEffect, useState } from "react";

export type DiscountRule = {
  id: string;
  minItems: number;
  discountPercent: number; // Ex: 18 (para 18%)
};

const LS_DISCOUNTS = "umbelina.discounts.v1";

const DEFAULT_RULES: DiscountRule[] = [
  { id: "rule-1", minItems: 2, discountPercent: 18 },
  { id: "rule-2", minItems: 3, discountPercent: 25 },
];

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadDiscountRules(): DiscountRule[] {
  if (typeof window === "undefined") return DEFAULT_RULES;
  return safeParse<DiscountRule[]>(
    window.localStorage.getItem(LS_DISCOUNTS),
    DEFAULT_RULES
  );
}

export function saveDiscountRules(rules: DiscountRule[]) {
  if (typeof window === "undefined") return;
  // Sort rules descending by minItems for easier logic
  const sorted = [...rules].sort((a, b) => b.minItems - a.minItems);
  window.localStorage.setItem(LS_DISCOUNTS, JSON.stringify(sorted));
  window.dispatchEvent(new Event("discounts:updated"));
}

export function getApplicableDiscount(itemsCount: number, rules: DiscountRule[] = loadDiscountRules()): DiscountRule | null {
  // Rules are sorted descending by minItems
  const sorted = [...rules].sort((a, b) => b.minItems - a.minItems);
  for (const rule of sorted) {
    if (itemsCount >= rule.minItems) {
      return rule;
    }
  }
  return null;
}

export function useDiscountRules() {
  const [rules, setRules] = useState<DiscountRule[]>([]);

  useEffect(() => {
    setRules(loadDiscountRules());
    const handle = () => setRules(loadDiscountRules());
    window.addEventListener("discounts:updated", handle);
    return () => window.removeEventListener("discounts:updated", handle);
  }, []);

  return rules;
}
