import { getSchoolData } from "@/lib/schools";

export async function GET(
  _: Request,
  { params }: { params: { schoolId: string } }
) {
  try {
    const school = await getSchoolData(params.schoolId);
    
    if (!school) {
      return new Response("School not found", { status: 404 });
    }
    
    return Response.json(school);
  } catch (error) {
    console.error("School API error:", error);
    return new Response("Failed to fetch school data", { status: 500 });
  }
} 