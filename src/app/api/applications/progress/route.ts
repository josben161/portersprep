import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET() {
  const { profile } = await requireAuthedProfile();
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("v_application_progress_secure")
    .select("*")
    .eq("user_id", profile.id);
  if (error) return new Response((error as any).message ?? "Query error", { status: 400 });
  return Response.json(data ?? []);
} 