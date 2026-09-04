import { useEffect, useState } from "react";
import { type Service } from "./site";
import { getApplicableDiscount } from "./discount-store";

export type CartItem = {
  id: string; // unique cart item id
  serviceSlug: string;
  serviceTitle: string;
  price: number;
};

const LS_CART = "umbelina.cart.v1";

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function loadCartItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  return safeParse<CartItem[]>(window.localStorage.getItem(LS_CART), []);
}

export function saveCartItems(items: CartItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LS_CART, JSON.stringify(items));
  window.dispatchEvent(new Event("cart:updated"));
}

export function addToCart(service: Service, price: number) {
  const items = loadCartItems();
  const newItem: CartItem = {
    id: Math.random().toString(36).substring(7),
    serviceSlug: service.slug,
    serviceTitle: service.title,
    price: price,
  };
  saveCartItems([...items, newItem]);
}

export function removeFromCart(id: string) {
  const items = loadCartItems();
  saveCartItems(items.filter((i) => i.id !== id));
}

export function clearCart() {
  saveCartItems([]);
}

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(loadCartItems());
    const handle = () => setItems(loadCartItems());
    window.addEventListener("cart:updated", handle);
    return () => window.removeEventListener("cart:updated", handle);
  }, []);

  const totalRaw = items.reduce((acc, item) => acc + item.price, 0);
  const rule = getApplicableDiscount(items.length);
  
  let discountAmount = 0;
  if (rule) {
    discountAmount = (totalRaw * rule.discountPercent) / 100;
  }
  
  const totalWithDiscount = totalRaw - discountAmount;

  return {
    items,
    totalRaw,
    totalWithDiscount,
    discountAmount,
    activeRule: rule,
    addToCart,
    removeFromCart,
    clearCart,
  };
}
