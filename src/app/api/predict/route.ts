import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET() {
  const { profile } = await requireAuthedProfile();
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("v_latest_prediction_secure")
    .select("*")
    .eq("user_id", profile.id)
    .single();
  if (error && (error as any).code !== "PGRST116") {
    return new Response((error as any).message ?? "Query error", { status: 400 });
  }
  return Response.json(data ?? null);
} 