import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { listPhotoLibrary } from "@/lib/admin-products";
import { getSiteContent } from "@/lib/content";
import { MENU_KINDS, type MenuKind } from "@/lib/menus";
import { ProductForm } from "@/components/admin/ProductForm";

type Props = { searchParams: Promise<{ menu?: string | string[] }> };

export default async function NewProductPage({ searchParams }: Props) {
  await requireAdmin();
  const [{ menu: requestedMenu }, { groups }, photoLibrary] = await Promise.all([
    searchParams,
    getSiteContent(),
    listPhotoLibrary(),
  ]);
  const menu = typeof requestedMenu === "string" && MENU_KINDS.includes(requestedMenu as MenuKind)
    ? (requestedMenu as MenuKind)
    : "signature";

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link href="/admin" className="text-sm text-black/55 hover:text-black">‹ Back to all items</Link>
      <h1 className="mt-3 font-serif text-3xl italic text-black">New menu item</h1>
      <p className="mb-8 mt-2 text-sm text-black/60">
        It shows up on its selected menu as soon as you save, unless you schedule it for later.
      </p>
      <ProductForm mode="create" photoLibrary={photoLibrary} groups={groups} defaultMenu={menu} />
    </div>
  );
}
