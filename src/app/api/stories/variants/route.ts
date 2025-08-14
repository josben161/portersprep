import { auth, currentUser } from "@clerk/nextjs/server";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { getOrCreateProfileByClerkId } from "@/lib/db";

export async function GET(req: Request) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  const u = await currentUser();
  const p = await getOrCreateProfileByClerkId(
    userId,
    u?.emailAddresses?.[0]?.emailAddress,
    u?.firstName ?? undefined,
  );

  const { searchParams } = new URL(req.url);
  const storyId = searchParams.get("storyId");
  const applicationId = searchParams.get("applicationId");
  if (!storyId || !applicationId)
    return new Response("Bad Request", { status: 400 });

  const sb = getAdminSupabase();
  const { data: story } = await sb
    .from("anchor_stories")
    .select("*")
    .eq("id", storyId)
    .eq("user_id", p.id)
    .single();
  if (!story) return new Response("Not found", { status: 404 });

  const { data: variants } = await sb
    .from("story_variants")
    .select("*")
    .eq("story_id", storyId)
    .in(
      "application_id",
      (
        await sb.from("applications").select("id").eq("user_id", p.id)
      ).data?.map((x: any) => x.id) ?? [],
    );

  return Response.json({ story, variants: variants ?? [] });
}
