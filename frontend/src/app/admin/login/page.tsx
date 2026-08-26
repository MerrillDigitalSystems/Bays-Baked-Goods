import { redirect } from "next/navigation";
import { adminEnabled, isAdminRequest } from "@/lib/admin-auth";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function AdminLoginPage() {
  if (await isAdminRequest()) redirect("/admin");
  const enabled = adminEnabled();

  return (
    <div className="mx-auto mt-8 w-full max-w-sm">
      <div className="rounded-[2rem] border border-black/8 bg-white/70 p-8 shadow-[0_24px_80px_rgba(0,0,0,0.08)]">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-black/55">
          Bay&apos;s Baked Goods
        </p>
        <h1 className="mt-3 font-serif text-3xl italic text-black">Bailey&apos;s kitchen door</h1>
        <p className="mt-3 text-sm leading-relaxed text-black/65">
          Sign in to edit the menu, prices, and photos. Changes go live on the website right
          away.
        </p>
        {enabled ? (
          <LoginForm />
        ) : (
          <p className="mt-6 rounded-xl border border-black/10 bg-[#f5f3ec] px-4 py-3 text-sm text-black/70">
            The admin isn&apos;t set up on this server yet. Ask Merrill Digital Systems to set an
            admin password.
          </p>
        )}
      </div>
    </div>
  );
}
