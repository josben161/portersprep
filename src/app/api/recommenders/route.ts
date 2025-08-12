import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET() {
  const { profile } = await requireAuthedProfile();
  const sb = getAdminSupabase();

  // Attempt to read recommenders if table exists
  const { data, error } = await sb.from("recommenders")
    .select("id,name,email,assigned,completed")
    .eq("user_id", profile.id);

  if (error) {
    // Graceful fallback: empty
    return Response.json([]);
  }
  return Response.json(data ?? []);
} 