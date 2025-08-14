import { auth, currentUser } from "@clerk/nextjs/server";
import { getOrCreateProfileByClerkId } from "@/lib/db";
import { getApplication } from "@/lib/apps";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const u = await currentUser();
  const profile = await getOrCreateProfileByClerkId(
    userId,
    u?.emailAddresses?.[0]?.emailAddress,
    u?.firstName ?? undefined,
  );

  try {
    const app = await getApplication(params.id);
    if (app.user_id !== profile.id) {
      return new Response("Forbidden", { status: 403 });
    }

    // Get all answers for this application
    const sb = getAdminSupabase();
    const { data: answers } = await sb
      .from("application_answers")
      .select("id, question_id, word_count, rubric, created_at, updated_at")
      .eq("application_id", params.id)
      .order("created_at", { ascending: true });

    return Response.json(answers || []);
  } catch (error) {
    return new Response("Not found", { status: 404 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const u = await currentUser();
  const profile = await getOrCreateProfileByClerkId(
    userId,
    u?.emailAddresses?.[0]?.emailAddress,
    u?.firstName ?? undefined,
  );

  try {
    const app = await getApplication(params.id);
    if (app.user_id !== profile.id) {
      return new Response("Forbidden", { status: 403 });
    }

    const { question_id, content, word_limit } = await req.json();

    if (!question_id || !content) {
      return new Response("Missing question_id or content", { status: 400 });
    }

    const sb = getAdminSupabase();

    // Check if answer already exists
    const { data: existing } = await sb
      .from("application_answers")
      .select("id")
      .eq("application_id", params.id)
      .eq("question_id", question_id)
      .maybeSingle();

    let answer;
    if (existing) {
      // Update existing answer
      const { data, error } = await sb
        .from("application_answers")
        .update({
          content,
          word_count: content
            .trim()
            .split(/\s+/)
            .filter((word: string) => word.length > 0).length,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select("id, question_id, content, word_count")
        .single();

      if (error) throw error;
      answer = data;
    } else {
      // Create new answer
      const { data, error } = await sb
        .from("application_answers")
        .insert({
          application_id: params.id,
          question_id,
          content,
          word_count: content
            .trim()
            .split(/\s+/)
            .filter((word: string) => word.length > 0).length,
        })
        .select("id, question_id, content, word_count")
        .single();

      if (error) throw error;
      answer = data;
    }

    return Response.json(answer);
  } catch (error) {
    console.error("Answer save error:", error);
    return new Response("Failed to save answer", { status: 500 });
  }
}
