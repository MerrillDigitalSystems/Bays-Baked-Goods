"use client";

import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={logout}
      className="shrink-0 rounded-full border border-black/10 bg-white/70 px-4 py-2 text-sm text-black/70 transition hover:border-black/25 hover:text-black"
    >
      Sign out
    </button>
  );
}
