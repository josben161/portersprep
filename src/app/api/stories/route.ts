import { NextRequest } from "next/server";
import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { profile } = await requireAuthedProfile();
    const sb = getAdminSupabase();
    const { data, error } = await sb
      .from("anchor_stories")
      .select("id,title,summary,competency_tags,impact_score,updated_at")
      .eq("user_id", profile.id)
      .order("updated_at", { ascending: false });
    if (error) throw error;
    return Response.json({ stories: data ?? [] });
  } catch (e: any) {
    return new Response(`Stories API error: ${e?.message || "unknown"}`, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { profile } = await requireAuthedProfile();
  const body = await req.json();
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("anchor_stories")
    .insert({
      user_id: profile.id,
      title: body.title,
      summary: body.summary ?? null,
      competency_tags: body.competency_tags ?? [],
      impact_score: body.impact_score ?? null,
    })
    .select()
    .single();
  if (error) return new Response(error.message, { status: 400 });
  return Response.json({ story: data });
}

export async function PUT(req: NextRequest) {
  const { profile } = await requireAuthedProfile();
  const body = await req.json();
  if (!body.id) return new Response("id required", { status: 400 });
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("anchor_stories")
    .update({
      title: body.title,
      summary: body.summary ?? null,
      competency_tags: body.competency_tags ?? [],
      impact_score: body.impact_score ?? null,
    })
    .eq("id", body.id)
    .select()
    .single();
  if (error) return new Response(error.message, { status: 400 });
  return Response.json({ story: data });
}
