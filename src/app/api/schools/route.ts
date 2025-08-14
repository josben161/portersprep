import { listSchoolsData } from "@/lib/schools";

export async function GET() {
  return Response.json(await listSchoolsData());
}
