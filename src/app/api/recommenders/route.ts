import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET() {
  const { profile } = await requireAuthedProfile();
  const sb = getAdminSupabase();

  const { data: recs } = await sb
    .from("recommenders")
    .select("id,name,email,relationship")
    .eq("user_id", profile.id)
    .order("created_at", { ascending: false });

  // aggregate assignment counts
  const { data: agg } = await sb
    .from("recommender_assignments")
    .select("recommender_id,status");
  const counts: Record<string, { assigned:number; completed:number }> = {};
  (agg ?? []).forEach(r => {
    if (!counts[r.recommender_id]) counts[r.recommender_id] = { assigned:0, completed:0 };
    counts[r.recommender_id].assigned += 1;
    if (r.status === "submitted") counts[r.recommender_id].completed += 1;
  });

  return Response.json((recs ?? []).map(r => ({
    ...r,
    assigned: counts[r.id]?.assigned ?? 0,
    completed: counts[r.id]?.completed ?? 0
  })));
}

export async function POST(req: Request) {
  const { profile } = await requireAuthedProfile();
  const body = await req.json(); // { name, email?, relationship? }
  if (!body?.name) return new Response("Name required", { status: 400 });

  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("recommenders")
    .insert({ user_id: profile.id, name: body.name, email: body.email ?? null, relationship: body.relationship ?? null })
    .select("*").single();
  if (error) return new Response(error.message, { status: 400 });
  return Response.json(data);
} 