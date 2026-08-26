import { cookies } from "next/headers";
import {
  ADMIN_COOKIE,
  adminEnabled,
  checkPassword,
  createSessionToken,
  loginRateLimited,
  sessionCookieOptions,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!adminEnabled()) {
    return Response.json(
      { error: "Admin is not set up on this server (ADMIN_PASSWORD unset or too short)." },
      { status: 503 }
    );
  }

  const ip =
    request.headers.get("cf-connecting-ip") ??
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";
  if (loginRateLimited(ip)) {
    return Response.json(
      { error: "Too many attempts - wait 15 minutes and try again." },
      { status: 429 }
    );
  }

  let password = "";
  try {
    const body = (await request.json()) as { password?: unknown };
    if (typeof body.password === "string") password = body.password;
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!checkPassword(password)) {
    return Response.json({ error: "Wrong password" }, { status: 401 });
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE, createSessionToken(), sessionCookieOptions());
  return Response.json({ ok: true });
}
