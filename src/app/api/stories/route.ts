import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateProfileByClerkId } from "@/lib/db";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { getQuotaSnapshot, assertWithinLimit } from "@/lib/quota";

export async function GET() {
  const { userId } = auth(); if (!userId) return new Response("Unauthorized", {status:401});
  const u = await currentUser();
  const p = await getOrCreateProfileByClerkId(userId, u?.emailAddresses?.[0]?.emailAddress, u?.firstName ?? undefined);
  const sb = getAdminSupabase();
  const { data } = await sb.from("anchor_stories").select("*").eq("user_id", p.id).order("updated_at", { ascending: false });
  return Response.json(data ?? []);
}

export async function POST(req: Request) {
  const { userId } = auth(); if (!userId) return new Response("Unauthorized", {status:401});
  const u = await currentUser();
  const p = await getOrCreateProfileByClerkId(userId, u?.emailAddresses?.[0]?.emailAddress, u?.firstName ?? undefined);
  const snap = await getQuotaSnapshot(userId);
  try { assertWithinLimit("stories", snap); } catch (e) { if (e instanceof Response) return e; throw e; }
  const body = await req.json();
  const sb = getAdminSupabase();
  const { data, error } = await sb.from("anchor_stories").insert({
    user_id: p.id,
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