import { listSchoolQuestions } from "@/lib/apps";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    // First, get the school by slug to get the database ID
    const sb = getAdminSupabase();
    const { data: school } = await sb
      .from("schools")
      .select("id")
      .eq("slug", params.id)
      .single();

    if (!school) {
      return new Response("School not found", { status: 404 });
    }

    // Get questions for this school
    const questions = await listSchoolQuestions(school.id);
    return Response.json(questions);
  } catch (error) {
    return new Response("Not found", { status: 404 });
  }
}
