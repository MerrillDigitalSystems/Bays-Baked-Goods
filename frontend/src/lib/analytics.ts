/** GA4 Measurement ID  -  set NEXT_PUBLIC_GA_MEASUREMENT_ID in env. */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: string, params?: Record<string, string | number | undefined>) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", name, params ?? {});
}

export function trackBeginCheckout(value?: number) {
  trackEvent("begin_checkout", value != null ? { value, currency: "USD" } : {});
}
