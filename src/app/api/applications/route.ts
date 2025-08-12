import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET() {
  const { profile } = await requireAuthedProfile();
  const sb = getAdminSupabase();

  // Try to select applications with school join if available
  const { data, error } = await sb
    .from("applications")
    .select("id, status, progress, deadline, school_id, schools(name, id, deadline)")
    .eq("user_id", profile.id)
    .order("created_at",{ ascending:false });

  if (error) {
    // Fallback: minimal shape
    const { data: apps } = await sb.from("applications").select("id, school_id").eq("user_id", profile.id);
    return Response.json((apps ?? []).map(a => ({ id: a.id, school: { id: a.school_id, name: "School" }, progress:{essays:0,total:0} })));
  }

  const mapped = (data ?? []).map((a:any)=>({
    id: a.id,
    school: a.schools ? { id: a.schools.id, name: a.schools.name, deadline: a.schools.deadline ?? a.deadline ?? null } : { id: a.school_id, name: "School", deadline: a.deadline ?? null },
    status: a.status ?? "active",
    progress: a.progress ?? { essays: 0, total: 0, recs: 0, recsTotal: 0 }
  }));
  return Response.json(mapped);
}

export async function POST(req: Request) {
  const { profile } = await requireAuthedProfile();
  const body = await req.json();
  const sb = getAdminSupabase();
  
  const { data, error } = await sb
    .from("applications")
    .insert({
      user_id: profile.id,
      school_id: body.schoolId,
      status: "active",
      progress: { essays: 0, total: 0, recs: 0, recsTotal: 0 }
    })
    .select()
    .single();

  if (error) return new Response(error.message, { status: 400 });
  return Response.json(data);
} 