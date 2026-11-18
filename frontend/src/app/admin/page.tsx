import { requireAdmin } from "@/lib/admin-auth";
import { getSiteContent, productSummary } from "@/lib/content";
import { getAvailabilityStatus } from "@/lib/availability";
import { MenuManager } from "@/components/admin/MenuManager";

export default async function AdminDashboard() {
  await requireAdmin();
  const { products, groups, customItems, updatedAt } = await getSiteContent();

  return (
    <MenuManager
      products={products.map((product) => ({
        id: product.id,
        title: product.title,
        price: productSummary(product).price,
        menu: product.menu,
        groupId: product.groupId,
        status: getAvailabilityStatus(product),
      }))}
      groups={groups}
      customItemCount={customItems.length}
      updatedAt={updatedAt}
    />
  );
}
