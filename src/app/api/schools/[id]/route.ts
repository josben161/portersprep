import { getSchoolData } from "@/lib/schools";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const s = await getSchoolData(params.id);
  if (!s) return new Response("Not found", { status: 404 });
  return Response.json(s);
} 