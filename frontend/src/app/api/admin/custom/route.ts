import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/admin-auth";
import { updateCustomItems, ValidationError } from "@/lib/admin-products";

/** Replace the "Make Your Own" pricing table. */
export async function PUT(request: Request) {
  if (!(await isAdminRequest())) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }
  try {
    const body = (await request.json()) as { items?: unknown };
    const items = await updateCustomItems(body.items);
    revalidatePath("/", "layout");
    return Response.json({ items });
  } catch (err) {
    if (err instanceof ValidationError) {
      return Response.json({ error: err.message }, { status: 400 });
    }
    console.error("update custom items failed:", err);
    return Response.json({ error: "Something went wrong saving - try again." }, { status: 500 });
  }
}
