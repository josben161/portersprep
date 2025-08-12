import { NextRequest } from "next/server";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET(_: NextRequest, { params }: { params: { token: string }}) {
  const sb = getAdminSupabase();
  const { data: link } = await sb.from("answer_share_links")
    .select("answer_id, role, expires_at")
    .eq("token", params.token).maybeSingle();
  if (!link) return new Response("Invalid link", { status: 404 });
  if (link.expires_at && new Date(link.expires_at) < new Date()) return new Response("Expired", { status: 410 });

  const { data: ans } = await sb.from("application_answers")
    .select("id, title, prompt, word_limit, body, liveblocks_room_id")
    .eq("id", link.answer_id).single();
  if (!ans) return new Response("Not found", { status: 404 });

  // Ensure room exists
  if (!ans.liveblocks_room_id) {
    const roomId = `answer_${ans.id}`;
    await sb.from("application_answers").update({ liveblocks_room_id: roomId }).eq("id", ans.id);
    ans.liveblocks_room_id = roomId;
  }

  return Response.json({ role: link.role, answer: ans });
}

export async function POST(req: NextRequest, { params }: { params: { token: string }}) {
  const sb = getAdminSupabase();
  const body = await req.json().catch(()=> ({}));
  const { content } = body || {};
  if (typeof content !== "string") return new Response("Missing content", { status: 400 });

  const { data: link } = await sb.from("answer_share_links")
    .select("answer_id, role, expires_at")
    .eq("token", params.token).maybeSingle();
  if (!link) return new Response("Invalid link", { status: 404 });
  if (link.role !== "editor") return new Response("Forbidden", { status: 403 });
  if (link.expires_at && new Date(link.expires_at) < new Date()) return new Response("Expired", { status: 410 });

  const { error } = await sb.from("application_answers")
    .update({ body: content })
    .eq("id", link.answer_id);
  if (error) return new Response(error.message, { status: 400 });

  return Response.json({ ok: true });
} 