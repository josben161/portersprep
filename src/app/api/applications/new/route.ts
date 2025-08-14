import { auth, currentUser } from "@clerk/nextjs/server";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { getQuotaSnapshot, assertWithinLimit } from "@/lib/quota";

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  const u = await currentUser();
  const snap = await getQuotaSnapshot(userId);
  try {
    assertWithinLimit("schools", snap);
  } catch (e) {
    if (e instanceof Response) return e;
    throw e;
  }

  const body = await req.json(); // { school_id, round }
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("applications")
    .insert({
      user_id: snap.profile_id,
      school_id: body.school_id,
      round: body.round ?? "R1",
      status: "active",
    })
    .select("*")
    .single();
  if (error) return new Response(error.message, { status: 400 });
  return Response.json(data);
}
