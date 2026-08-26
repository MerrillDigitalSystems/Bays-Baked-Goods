import Link from "next/link";
import { requireAdmin } from "@/lib/admin-auth";
import { getCustomItems } from "@/lib/content";
import { CustomItemsForm } from "@/components/admin/CustomItemsForm";

export default async function EditCustomItemsPage() {
  await requireAdmin();
  const items = await getCustomItems();

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link href="/admin" className="text-sm text-black/55 hover:text-black">
        ‹ Back to all items
      </Link>
      <h1 className="mt-3 font-serif text-3xl italic text-black">
        &ldquo;Make Your Own&rdquo; pricing
      </h1>
      <p className="mb-8 mt-2 text-sm text-black/60">
        The custom-order price ranges shown on the menu and custom-orders pages. Prices here are
        text (like &ldquo;$13-$15&rdquo;) since customs are quoted individually.
      </p>
      <CustomItemsForm initialItems={items} />
    </div>
  );
}
