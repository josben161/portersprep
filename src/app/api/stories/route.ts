import { NextRequest } from "next/server";
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

export async function POST(req: NextRequest) {
  const { profile } = await requireAuthedProfile();
  const body = await req.json().catch(()=> ({}));
  const { title, summary, tags } = body || {};
  if (!title) return new Response("Title required", { status: 400 });
  const sb = getAdminSupabase();
  const { data, error } = await sb.from("anchor_stories")
    .insert({ user_id: profile.id, title, summary: summary ?? null, tags: tags ?? [] })
    .select("id").single();
  if (error) return new Response(error.message, { status: 400 });
  return Response.json(data);
}

export async function PUT(req: NextRequest) {
  const { profile } = await requireAuthedProfile();
  const body = await req.json().catch(()=> ({}));
  const { id, title, summary, tags } = body || {};
  if (!id) return new Response("Missing id", { status: 400 });
  const sb = getAdminSupabase();
  const { error } = await sb.from("anchor_stories")
    .update({ title, summary, tags })
    .eq("id", id).eq("user_id", profile.id);
  if (error) return new Response(error.message, { status: 400 });
  return Response.json({ ok: true });
} 