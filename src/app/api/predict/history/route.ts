import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET() {
  const { profile } = await requireAuthedProfile();
  const sb = getAdminSupabase();
  
  const { data: predictions, error } = await sb
    .from("assessments")
    .select("id, created_at, result")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false })
    .limit(10);
  
  if (error) {
    return new Response(error.message, { status: 400 });
  }
  
  return Response.json(predictions || []);
} 