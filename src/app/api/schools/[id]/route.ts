import { getSchoolData } from "@/lib/schools";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const school = await getSchoolData(params.id);

    if (!school) {
      return new Response("School not found", { status: 404 });
    }

    return Response.json(school);
  } catch (error) {
    console.error("School API error:", error);
    return new Response("Failed to fetch school data", { status: 500 });
  }
}
