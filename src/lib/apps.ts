import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function listSchools() {
  const sb = getAdminSupabase();
  const { data } = await sb
    .from("schools")
    .select("id,name,slug,website,brief")
    .order("name");
  return data ?? [];
}

export async function listSchoolQuestions(schoolId: string) {
  const sb = getAdminSupabase();
  const { data } = await sb
    .from("school_questions")
    .select("id, prompt, archetype, word_limit, metadata")
    .eq("school_id", schoolId)
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function upsertSchool(input: {
  name: string;
  slug: string;
  website?: string;
  brief?: any;
}) {
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("schools")
    .upsert({
      name: input.name,
      slug: input.slug,
      website: input.website,
      brief: input.brief,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function addSchoolQuestion(
  schoolId: string,
  q: {
    prompt: string;
    archetype: string;
    word_limit?: number | null;
    metadata?: any;
  },
) {
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("school_questions")
    .insert({
      school_id: schoolId,
      prompt: q.prompt,
      archetype: q.archetype,
      word_limit: q.word_limit ?? null,
      metadata: q.metadata ?? null,
    })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function createApplication(
  userId: string,
  schoolId: string,
  round?: string | null,
) {
  const sb = getAdminSupabase();

  // Validate UUIDs
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(userId)) {
    console.error("Invalid userId format:", userId);
    throw new Error("Invalid user profile");
  }
  if (!uuidRegex.test(schoolId)) {
    console.error("Invalid schoolId format:", schoolId);
    throw new Error("Invalid school");
  }

  const { data, error } = await sb
    .from("applications")
    .insert({ user_id: userId, school_id: schoolId, round: round ?? null })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function listApplications(userId: string) {
  const sb = getAdminSupabase();

  // Validate UUID
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(userId)) {
    console.error("Invalid userId format:", userId);
    return [];
  }

  const { data } = await sb
    .from("applications")
    .select(
      "id, school_id, status, round, deadlines, created_at, updated_at, schools(name,slug)",
    )
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  return data ?? [];
}

export async function getApplication(id: string) {
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("applications")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function ensureAnswer(
  appId: string,
  question: { id: string; archetype: string },
) {
  const sb = getAdminSupabase();
  const { data } = await sb
    .from("application_answers")
    .select("id")
    .eq("application_id", appId)
    .eq("question_id", question.id)
    .maybeSingle();
  if (data?.id) return data.id as string;
  const { data: created, error } = await sb
    .from("application_answers")
    .insert({
      application_id: appId,
      question_id: question.id,
      archetype: question.archetype,
    })
    .select("id")
    .single();
  if (error) throw error;
  return created.id as string;
}

export async function getAnswer(id: string) {
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("application_answers")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function updateAnswerMeta(
  id: string,
  fields: Partial<{
    title: string;
    word_count: number;
    rubric: any;
    parent_answer_id: string;
    lineage: any;
    content_s3_key: string;
  }>,
) {
  const sb = getAdminSupabase();
  const { error } = await sb
    .from("application_answers")
    .update(fields)
    .eq("id", id);
  if (error) throw error;
}

export async function storeAnalysis(
  answerId: string,
  model: string,
  rubric: any,
  sentences: any[],
) {
  const sb = getAdminSupabase();
  const { error } = await sb
    .from("answer_analyses")
    .insert({ answer_id: answerId, model, rubric, sentences });
  if (error) throw error;
}

export async function listAnalyses(answerId: string, limit = 5) {
  const sb = getAdminSupabase();
  const { data } = await sb
    .from("answer_analyses")
    .select("id, model, rubric, sentences, created_at")
    .eq("answer_id", answerId)
    .order("created_at", { ascending: false })
    .limit(limit);
  return data ?? [];
}
