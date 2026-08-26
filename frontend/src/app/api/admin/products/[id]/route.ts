import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/admin-auth";
import { deleteProduct, updateProduct, ValidationError } from "@/lib/admin-products";

type Params = { params: Promise<{ id: string }> };

/** Update a menu item. */
export async function PUT(request: Request, { params }: Params) {
  if (!(await isAdminRequest())) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }
  const { id } = await params;
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const product = await updateProduct(id, body);
    revalidatePath("/", "layout");
    revalidatePath("/sitemap.xml");
    return Response.json({ product });
  } catch (err) {
    if (err instanceof ValidationError) {
      return Response.json({ error: err.message }, { status: 400 });
    }
    console.error("update product failed:", err);
    return Response.json({ error: "Something went wrong saving - try again." }, { status: 500 });
  }
}

/** Delete a menu item. */
export async function DELETE(_request: Request, { params }: Params) {
  if (!(await isAdminRequest())) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }
  const { id } = await params;
  try {
    await deleteProduct(id);
    revalidatePath("/", "layout");
    revalidatePath("/sitemap.xml");
    return Response.json({ ok: true });
  } catch (err) {
    if (err instanceof ValidationError) {
      return Response.json({ error: err.message }, { status: 400 });
    }
    console.error("delete product failed:", err);
    return Response.json({ error: "Something went wrong - try again." }, { status: 500 });
  }
}
