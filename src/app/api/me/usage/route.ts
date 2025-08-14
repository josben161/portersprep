import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET() {
  const { profile } = await requireAuthedProfile();
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("v_usage_counts_secure")
    .select("*")
    .eq("user_id", profile.id)
    .single();
  if (error) return new Response(error.message, { status: 400 });
  return Response.json(data);
}
