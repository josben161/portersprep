import { requireAuth } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET() {
  await requireAuth(); // RLS on view does scoping
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("v_application_progress_secure")
    .select("*");
  if (error) return new Response(error.message, { status: 400 });
  return Response.json(data ?? []);
}
