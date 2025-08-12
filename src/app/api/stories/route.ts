import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { getQuotaSnapshot, assertWithinLimit } from "@/lib/quota";

export async function GET() {
  const { profile } = await requireAuthedProfile();
  const sb = getAdminSupabase();
  const { data, error } = await sb.from("anchor_stories").select("id,title,tags").eq("user_id", profile.id).order("created_at",{ascending:false});
  if (error) return Response.json([]);
  return Response.json(data ?? []);
}

export async function POST(req: Request) {
  const { profile, clerkUserId } = await requireAuthedProfile();
  const snap = await getQuotaSnapshot(clerkUserId);
  try { assertWithinLimit("stories", snap); } catch (e) { if (e instanceof Response) return e; throw e; }
  const body = await req.json();
  const sb = getAdminSupabase();
  const { data, error } = await sb.from("anchor_stories").insert({
    user_id: profile.id,
    title: body.title,
    summary: body.summary,
    detail: body.detail ?? null,
    tags: body.tags ?? [],
    metrics: body.metrics ?? null,
    strength: body.strength ?? 3
  }).select("*").single();
  if (error) return new Response(error.message, { status: 400 });
  return Response.json(data);
} 