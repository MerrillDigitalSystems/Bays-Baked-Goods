import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-auth";
import { listPhotoLibrary } from "@/lib/admin-products";
import { getSiteContent, formatCents } from "@/lib/content";
import { ProductForm } from "@/components/admin/ProductForm";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  await requireAdmin();
  const { id } = await params;
  const { products } = await getSiteContent();
  const product = products.find((p) => p.id === id);
  if (!product) notFound();
  const photoLibrary = await listPhotoLibrary();

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Link href="/admin" className="text-sm text-black/55 hover:text-black">
        ‹ Back to all items
      </Link>
      <h1 className="mt-3 font-serif text-3xl italic text-black">{product.title}</h1>
      <p className="mb-8 mt-2 text-sm text-black/60">
        Changes go live on the website as soon as you save.
      </p>
      <ProductForm
        mode="edit"
        photoLibrary={photoLibrary}
        product={{
          id: product.id,
          title: product.title,
          description: product.description,
          imageSrc: product.imageSrc,
          imageObjectPosition: product.imageObjectPosition,
          allergens: product.allergens,
          available: product.available,
          variants: product.variants.map((v) => ({
            shortLabel: v.shortLabel,
            priceDollars: formatCents(v.unitAmountCents).replace("$", ""),
          })),
        }}
      />
    </div>
  );
}
