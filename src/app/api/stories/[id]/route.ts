import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateProfileByClerkId } from "@/lib/db";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function PATCH(req: Request, { params }: { params: { id: string }}) {
  const { userId } = auth(); if (!userId) return new Response("Unauthorized", {status:401});
  const u = await currentUser();
  const p = await getOrCreateProfileByClerkId(userId, u?.emailAddresses?.[0]?.emailAddress, u?.firstName ?? undefined);
  const body = await req.json();
  const sb = getAdminSupabase();
  const { error } = await sb.from("anchor_stories").update({
    title: body.title,
    summary: body.summary,
    detail: body.detail,
    tags: body.tags,
    metrics: body.metrics,
    strength: body.strength
  }).eq("id", params.id).eq("user_id", p.id);
  if (error) return new Response(error.message, { status: 400 });
  return new Response("ok");
}

export async function DELETE(_: Request, { params }: { params: { id: string }}) {
  const { userId } = auth(); if (!userId) return new Response("Unauthorized", {status:401});
  const u = await currentUser();
  const p = await getOrCreateProfileByClerkId(userId, u?.emailAddresses?.[0]?.emailAddress, u?.firstName ?? undefined);
  const sb = getAdminSupabase();
  const { error } = await sb.from("anchor_stories").delete().eq("id", params.id).eq("user_id", p.id);
  if (error) return new Response(error.message, { status: 400 });
  return new Response("ok");
} 