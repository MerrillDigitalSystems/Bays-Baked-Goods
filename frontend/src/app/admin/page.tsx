import Image from "next/image";
import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getSiteContent, productSummary } from "@/lib/content";
import { LogoutButton } from "@/components/admin/LogoutButton";

export default async function AdminDashboard() {
  await requireAdmin();
  const { products, customItems, updatedAt } = await getSiteContent();

  return (
    <div className="mx-auto w-full max-w-3xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-black/55">
            Bay&apos;s admin
          </p>
          <h1 className="mt-2 font-serif text-3xl italic text-black sm:text-4xl">
            Hi Bailey 👋
          </h1>
          <p className="mt-2 text-sm text-black/60">
            Tap an item to change its price, photo, or wording. Changes go live right away.
          </p>
        </div>
        <LogoutButton />
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-full bg-[#1a1a1a] px-7 py-3.5 text-base font-medium text-white shadow-xl transition hover:bg-black"
        >
          + Add a menu item
        </Link>
        <Link
          href="/admin/custom"
          className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/70 px-7 py-3.5 text-base font-medium text-black transition hover:border-black/25"
        >
          Edit &ldquo;Make Your Own&rdquo; pricing
        </Link>
      </div>

      <ul className="mt-8 space-y-3">
        {products.map((p) => {
          const summary = productSummary(p);
          return (
            <li key={p.id}>
              <Link
                href={`/admin/products/${p.id}`}
                className="flex items-center gap-4 rounded-2xl border border-black/8 bg-white/80 p-3 shadow-[0_8px_30px_rgba(0,0,0,0.05)] transition hover:border-black/20"
              >
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-[#ebe8e0]">
                  {p.imageSrc ? (
                    <Image
                      src={p.imageSrc}
                      alt=""
                      fill
                      sizes="4rem"
                      className="object-cover"
                      style={
                        p.imageObjectPosition
                          ? { objectPosition: p.imageObjectPosition }
                          : undefined
                      }
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[0.6rem] uppercase tracking-wide text-black/40">
                      No photo
                    </div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-black">{p.title}</p>
                  <p className="mt-0.5 truncate text-sm text-black/60">
                    {summary.size ? `${summary.size} · ` : ""}
                    {summary.price}
                  </p>
                </div>
                {!p.available ? (
                  <span className="shrink-0 rounded-full bg-black/8 px-3 py-1 text-xs font-medium text-black/60">
                    Hidden
                  </span>
                ) : null}
                <span aria-hidden className="shrink-0 pr-1 text-black/30">
                  ›
                </span>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="mt-8 text-xs text-black/45">
        {customItems.length} &ldquo;Make Your Own&rdquo; rows ·{" "}
        {updatedAt === "seed"
          ? "No edits saved yet - the site shows the original menu."
          : `Last saved ${new Date(updatedAt).toLocaleString("en-US")}`}
      </p>
      <p className="mt-2 text-xs text-black/45">
        Tip: save this page to your phone&apos;s home screen for one-tap access.
      </p>
    </div>
  );
}
