import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { getSchoolData } from "@/lib/schools";
import { requireAuthedProfile } from "@/lib/authz";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { profile } = await requireAuthedProfile();
  const sb = getAdminSupabase();
  const { data: app } = await sb
    .from("applications")
    .select("id, user_id, school_id")
    .eq("id", params.id)
    .single();
  if (!app || app.user_id !== profile.id)
    return new Response("Not found", { status: 404 });

  const school = await getSchoolData(app.school_id);
  if (!school) return new Response("School not found", { status: 404 });
  return Response.json(school);
}
