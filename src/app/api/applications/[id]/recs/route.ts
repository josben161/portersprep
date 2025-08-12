import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET(_: Request, { params }: { params: { id: string }}) {
  const { profile } = await requireAuthedProfile();
  const sb = getAdminSupabase();

  const { data: app } = await sb.from("applications")
    .select("id,user_id").eq("id", params.id).single();
  if (!app || app.user_id !== profile.id) return new Response("Not found", { status: 404 });

  const { data, error } = await sb.from("recommender_assignments")
    .select("id,recommender_id,status,created_at")
    .eq("application_id", params.id)
    .order("created_at",{ascending:false});
  if (error) return new Response(error.message, { status: 400 });
  return Response.json(data ?? []);
} 