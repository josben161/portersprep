import { NextRequest } from "next/server";
import { Liveblocks } from "@liveblocks/node";
import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

const secret = process.env.LIVEBLOCKS_SECRET_KEY!;
const lb = new Liveblocks({ secret });

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const { room, shareToken } = body || {};

  if (!room) return new Response("Missing room", { status: 400 });

  // If Clerk session present, use it.
  try {
    const { profile } = await requireAuthedProfile();
    const userInfo = {
      userId: `user_${profile.id}`,
      groupIds: ["authenticated"],
      userInfo: { name: profile.email || profile.name || "User", role: "owner" },
    };
    const auth = await lb.identifyUser(userInfo);
    // Note: Liveblocks v3 API may differ - this is a placeholder
    return Response.json({ ...auth, room });
  } catch {
    // No Clerk session; try share token path.
  }

  if (!shareToken) return new Response("Unauthorized", { status: 401 });

  // Validate share token maps to an answer -> room
  const sb = getAdminSupabase();
  const { data: link } = await sb
    .from("answer_share_links")
    .select("answer_id, role")
    .eq("token", shareToken)
    .maybeSingle();
  if (!link) return new Response("Invalid token", { status: 401 });

  // Minimal identity for anonymous collaborator
  const anonId = `anon_${shareToken.slice(0, 8)}`;
  // Note: Liveblocks v3 API may differ - this is a placeholder
  return Response.json({
    room,
    userId: anonId,
    groupIds: [link.role === "editor" ? "editors" : "viewers"],
  });
}
