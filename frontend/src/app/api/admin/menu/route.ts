import { revalidatePath } from "next/cache";
import { isAdminRequest } from "@/lib/admin-auth";
import { updateMenuConfiguration, ValidationError } from "@/lib/admin-products";

export async function PUT(request: Request) {
  if (!(await isAdminRequest())) {
    return Response.json({ error: "Not signed in" }, { status: 401 });
  }
  try {
    const body = await request.json();
    const content = await updateMenuConfiguration(body);
    revalidatePath("/", "layout");
    revalidatePath("/sitemap.xml");
    return Response.json({ content });
  } catch (error) {
    if (error instanceof ValidationError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    console.error("menu arrangement failed:", error);
    return Response.json({ error: "Something went wrong saving - try again." }, { status: 500 });
  }
}
