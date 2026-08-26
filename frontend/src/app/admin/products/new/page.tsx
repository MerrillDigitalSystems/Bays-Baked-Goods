import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { listPhotoLibrary } from "@/lib/admin-products";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function NewProductPage() {
  await requireAdmin();
  const photoLibrary = await listPhotoLibrary();

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link href="/admin" className="text-sm text-black/55 hover:text-black">
        ‹ Back to all items
      </Link>
      <h1 className="mt-3 font-serif text-3xl italic text-black">New menu item</h1>
      <p className="mb-8 mt-2 text-sm text-black/60">
        It shows up on the menu and order pages as soon as you save.
      </p>
      <ProductForm mode="create" photoLibrary={photoLibrary} />
    </div>
  );
}
