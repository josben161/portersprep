import { NextRequest } from "next/server";
import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { profile } = await requireAuthedProfile();
    const sb = getAdminSupabase();

    const { data, error } = await sb
      .from("anchor_stories")
      .select("id, title, summary, tags")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Stories fetch error:", error);
      return Response.json([]);
    }

    return Response.json(data ?? []);
  } catch (error) {
    console.error("Stories API error:", error);
    return Response.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { profile } = await requireAuthedProfile();
    const body = await req.json().catch(() => ({}));
    const { title, summary, tags } = body || {};

    if (!title) return new Response("Title required", { status: 400 });

    const sb = getAdminSupabase();

    // Use direct SQL to bypass RLS
    const { data, error } = await sb.rpc("create_story", {
      p_user_id: profile.id,
      p_title: title,
      p_summary: summary || null,
      p_tags: tags || [],
    });

    if (error) {
      console.error("Story create error:", error);
      return new Response("Failed to create story", { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    console.error("Stories POST error:", error);
    return new Response("Story error", { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const { profile } = await requireAuthedProfile();
  const body = await req.json().catch(() => ({}));
  const { id, title, summary, tags } = body || {};
  if (!id) return new Response("Missing id", { status: 400 });
  const sb = getAdminSupabase();
  const { error } = await sb
    .from("anchor_stories")
    .update({ title, summary, tags })
    .eq("id", id)
    .eq("user_id", profile.id);
  if (error) return new Response(error.message, { status: 400 });
  return Response.json({ ok: true });
}
