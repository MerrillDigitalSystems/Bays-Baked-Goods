"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

/**
 * Site-wide cart state, persisted to localStorage so a shopper can browse
 * product pages (or come back tomorrow) without losing their cart. Lines
 * store only sku + quantity - prices always come from the server-provided
 * catalog, so an admin price change can never be bypassed by a stale cart.
 */

export type CatalogMap = Record<string, { label: string; unitAmount: number }>;
export type CartLine = { sku: string; quantity: number };
export type Fulfillment = "pickup" | "delivery";
export type DeliveryAddress = { street: string; city: string; zip: string };

const STORAGE_KEY = "bays-cart-v1";
export const MAX_LINE_QTY = 24;

type StoredCart = {
  lines?: CartLine[];
  fulfillment?: Fulfillment;
  address?: Partial<DeliveryAddress>;
};

type CartContextValue = {
  catalog: CatalogMap;
  lines: CartLine[];
  count: number;
  subtotalCents: number;
  fulfillment: Fulfillment;
  address: DeliveryAddress;
  isOpen: boolean;
  addSku: (sku: string, qty?: number, opts?: { open?: boolean }) => void;
  removeLine: (sku: string) => void;
  setQty: (sku: string, quantity: number) => void;
  clear: () => void;
  setFulfillment: (f: Fulfillment) => void;
  setAddress: (patch: Partial<DeliveryAddress>) => void;
  openCart: () => void;
  closeCart: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}

function clampQty(q: number): number {
  return Math.min(MAX_LINE_QTY, Math.max(1, Math.floor(q)));
}

export function CartProvider({
  catalog,
  children,
}: {
  catalog: CatalogMap;
  children: React.ReactNode;
}) {
  // Start empty on both server and client so hydration matches; the saved
  // cart loads in an effect right after mount.
  const [lines, setLines] = useState<CartLine[]>([]);
  const [fulfillment, setFulfillmentState] = useState<Fulfillment>("pickup");
  const [address, setAddressState] = useState<DeliveryAddress>({ street: "", city: "", zip: "" });
  const [isOpen, setIsOpen] = useState(false);
  const hydrated = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as StoredCart;
        if (Array.isArray(stored.lines)) {
          // Drop skus the catalog no longer sells (item deleted or hidden).
          setLines(
            stored.lines
              .filter(
                (l) =>
                  l &&
                  typeof l.sku === "string" &&
                  l.sku in catalog &&
                  Number.isFinite(l.quantity)
              )
              .map((l) => ({ sku: l.sku, quantity: clampQty(l.quantity) }))
          );
        }
        if (stored.fulfillment === "delivery") setFulfillmentState("delivery");
        if (stored.address) {
          setAddressState({
            street: typeof stored.address.street === "string" ? stored.address.street : "",
            city: typeof stored.address.city === "string" ? stored.address.city : "",
            zip: typeof stored.address.zip === "string" ? stored.address.zip : "",
          });
        }
      }
    } catch {
      // corrupted or blocked storage - start fresh
    }
    hydrated.current = true;
    // Load once per mount; the catalog prop is stable for a page's lifetime.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ lines, fulfillment, address } satisfies StoredCart)
      );
    } catch {
      // storage full or blocked - cart still works for this page view
    }
  }, [lines, fulfillment, address]);

  const addSku = useCallback((sku: string, qty = 1, opts?: { open?: boolean }) => {
    setLines((prev) => {
      const i = prev.findIndex((l) => l.sku === sku);
      if (i === -1) return [...prev, { sku, quantity: clampQty(qty) }];
      const next = [...prev];
      next[i] = { sku, quantity: clampQty(next[i].quantity + qty) };
      return next;
    });
    if (opts?.open) setIsOpen(true);
  }, []);

  const removeLine = useCallback((sku: string) => {
    setLines((prev) => prev.filter((l) => l.sku !== sku));
  }, []);

  const setQty = useCallback((sku: string, quantity: number) => {
    setLines((prev) =>
      prev.map((l) => (l.sku === sku ? { ...l, quantity: clampQty(quantity) } : l))
    );
  }, []);

  const clear = useCallback(() => {
    setLines([]);
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  const setFulfillment = useCallback((f: Fulfillment) => setFulfillmentState(f), []);
  const setAddress = useCallback((patch: Partial<DeliveryAddress>) => {
    setAddressState((prev) => ({ ...prev, ...patch }));
  }, []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);

  const subtotalCents = useMemo(
    () => lines.reduce((sum, l) => sum + (catalog[l.sku]?.unitAmount ?? 0) * l.quantity, 0),
    [lines, catalog]
  );
  const count = useMemo(() => lines.reduce((sum, l) => sum + l.quantity, 0), [lines]);

  const value = useMemo<CartContextValue>(
    () => ({
      catalog,
      lines,
      count,
      subtotalCents,
      fulfillment,
      address,
      isOpen,
      addSku,
      removeLine,
      setQty,
      clear,
      setFulfillment,
      setAddress,
      openCart,
      closeCart,
    }),
    [catalog, lines, count, subtotalCents, fulfillment, address, isOpen, addSku, removeLine, setQty, clear, setFulfillment, setAddress, openCart, closeCart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
