import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/admin-auth";
import { createProduct, ValidationError } from "@/lib/admin-products";

/** Create a menu item. */
export async function POST(request: Request) {
  if (!(await isAdminRequest())) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const product = await createProduct(body);
    revalidatePath("/", "layout");
    revalidatePath("/sitemap.xml");
    return Response.json({ product });
  } catch (err) {
    if (err instanceof ValidationError) {
      return Response.json({ error: err.message }, { status: 400 });
    }
    console.error("create product failed:", err);
    return Response.json({ error: "Something went wrong saving - try again." }, { status: 500 });
  }
}
