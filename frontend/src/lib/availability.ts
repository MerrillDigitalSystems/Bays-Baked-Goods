export const BUSINESS_TIME_ZONE = "America/Denver";

export type AvailabilityStatus = "available" | "hidden" | "scheduled" | "expired";

export type AvailabilityFields = {
  available: boolean;
  availabilityStart?: string;
  availabilityEnd?: string;
};

const LOCAL_DATE_TIME = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/;
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function isValidLocalDateTime(value: string): boolean {
  const match = LOCAL_DATE_TIME.exec(value);
  if (!match) return false;
  const [, year, month, day, hour, minute] = match;
  const y = Number(year);
  const m = Number(month);
  const d = Number(day);
  const h = Number(hour);
  const min = Number(minute);
  if (m < 1 || m > 12 || h > 23 || min > 59) return false;
  const check = new Date(Date.UTC(y, m - 1, d));
  return check.getUTCFullYear() === y && check.getUTCMonth() === m - 1 && check.getUTCDate() === d;
}

export function currentBusinessLocalDateTime(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BUSINESS_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(now);
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

export function getAvailabilityStatus(
  product: AvailabilityFields,
  now = new Date()
): AvailabilityStatus {
  if (!product.available) return "hidden";
  const localNow = currentBusinessLocalDateTime(now);
  if (product.availabilityStart && product.availabilityStart > localNow) return "scheduled";
  if (product.availabilityEnd && product.availabilityEnd <= localNow) return "expired";
  return "available";
}

export function isCurrentlyAvailable(product: AvailabilityFields, now = new Date()): boolean {
  return getAvailabilityStatus(product, now) === "available";
}

export function formatLocalDateTime(value: string): string {
  const match = LOCAL_DATE_TIME.exec(value);
  if (!match) return value;
  const [, year, month, day, rawHour, minute] = match;
  const hour = Number(rawHour);
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 || 12;
  return `${MONTHS[Number(month) - 1]} ${Number(day)}, ${year} at ${displayHour}:${minute} ${suffix}`;
}

export function formatOrderingWindow(product: AvailabilityFields): string | null {
  if (product.availabilityEnd) return `Order by ${formatLocalDateTime(product.availabilityEnd)}`;
  if (product.availabilityStart) return `Ordering opened ${formatLocalDateTime(product.availabilityStart)}`;
  return null;
}
