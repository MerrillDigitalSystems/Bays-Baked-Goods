import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Single-password admin auth for Bailey's phone.
 *
 * - `ADMIN_PASSWORD` env var enables the admin; unset = admin fully disabled.
 * - Session is a signed `exp.hmac` token in an httpOnly cookie. The HMAC key
 *   is derived from the password, so changing the password on the Pi logs
 *   every device out  -  no separate secret to manage.
 * - Login attempts are rate limited in memory per IP.
 */

export const ADMIN_COOKIE = "bays_admin";
const SESSION_DAYS = 30;

function adminPassword(): string | null {
  const pw = process.env.ADMIN_PASSWORD;
  return pw && pw.length >= 8 ? pw : null;
}

export function adminEnabled(): boolean {
  return adminPassword() !== null;
}

function signingKey(): Buffer {
  // Derived from the password; the fixed context string just namespaces the key.
  return createHmac("sha256", "bays-admin-session-v1").update(adminPassword() ?? "").digest();
}

function sign(payload: string): string {
  return createHmac("sha256", signingKey()).update(payload).digest("hex");
}

export function createSessionToken(): string {
  const exp = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  return `${exp}.${sign(String(exp))}`;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token || !adminEnabled()) return false;
  const dot = token.indexOf(".");
  if (dot === -1) return false;
  const exp = token.slice(0, dot);
  const mac = token.slice(dot + 1);
  if (!/^\d+$/.test(exp) || Number(exp) < Date.now()) return false;
  const expected = sign(exp);
  const a = Buffer.from(mac, "utf8");
  const b = Buffer.from(expected, "utf8");
  return a.length === b.length && timingSafeEqual(a, b);
}

export function sessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}

/** True when the current request carries a valid admin session cookie. */
export async function isAdminRequest(): Promise<boolean> {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

/** Server-page guard: bounce to the login screen without a session. */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdminRequest())) redirect("/admin/login");
}

export function checkPassword(candidate: string): boolean {
  const pw = adminPassword();
  if (!pw) return false;
  const a = Buffer.from(candidate, "utf8");
  const b = Buffer.from(pw, "utf8");
  // Compare fixed-length digests so length differences don't leak timing.
  const da = createHmac("sha256", "bays-admin-pw-v1").update(a).digest();
  const db = createHmac("sha256", "bays-admin-pw-v1").update(b).digest();
  return timingSafeEqual(da, db);
}

/* Login rate limit: 10 attempts / 15 minutes per IP (in-memory; resets on restart). */
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const attempts = new Map<string, { count: number; resetAt: number }>();

export function loginRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = attempts.get(ip);
  if (!entry || entry.resetAt < now) {
    attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  entry.count += 1;
  return entry.count > MAX_ATTEMPTS;
}
