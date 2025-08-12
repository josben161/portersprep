import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function POST(req: Request) {
  const { profile } = await requireAuthedProfile();
  const { recommender_id, application_id } = await req.json();
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("recommender_assignments")
    .insert({ user_id: profile.id, recommender_id, application_id, status: "invited" })
    .select("*")
    .single();
  if (error) return new Response((error as any).message ?? "Insert error", { status: 400 });
  return Response.json(data);
}

export async function PATCH(req: Request) {
  const { profile } = await requireAuthedProfile();
  const { id, status, form_url, notes } = await req.json();
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("recommender_assignments")
    .update({ status, form_url, notes })
    .eq("id", id)
    .eq("user_id", profile.id)
    .select("*")
    .single();
  if (error) return new Response((error as any).message ?? "Update error", { status: 400 });
  return Response.json(data);
} 