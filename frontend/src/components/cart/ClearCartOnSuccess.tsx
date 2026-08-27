"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart/CartProvider";

/** Mounted on /order/success: the order is paid, so empty the saved cart. */
export function ClearCartOnSuccess() {
  const { clear } = useCart();
  useEffect(() => {
    clear();
  }, [clear]);
  return null;
}
