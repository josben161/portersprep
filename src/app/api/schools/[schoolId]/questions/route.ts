import { listSchoolQuestions } from "@/lib/apps";

export async function GET(_: Request, { params }: { params: { schoolId: string } }) {
  return Response.json(await listSchoolQuestions(params.schoolId));
} 