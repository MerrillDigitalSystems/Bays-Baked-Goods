import type { CartProduct } from "@/components/OrderCart";
import { formatOrderingWindow } from "@/lib/availability";
import { variantPriceDisplay, type StoredProduct } from "@/lib/content";

export function toCartProducts(products: StoredProduct[]): CartProduct[] {
  return products.map((product) => ({
    id: product.id,
    title: product.title,
    description: product.description,
    imageSrc: product.imageSrc,
    imageObjectPosition: product.imageObjectPosition,
    groupId: product.groupId,
    orderingWindow: formatOrderingWindow(product),
    variants: product.variants.map((variant) => ({
      sku: variant.sku,
      shortLabel: variant.shortLabel,
      priceDisplay: variantPriceDisplay(variant),
    })),
  }));
}
