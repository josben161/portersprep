import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function getOrCreateProfileByClerkId(clerkUserId: string, email?: string | null, name?: string | null) {
  const sb = getAdminSupabase();
  const { data: existing } = await sb.from("profiles").select("*").eq("clerk_user_id", clerkUserId).single();
  if (existing) return existing;
  const { data, error } = await sb.from("profiles").insert({
    clerk_user_id: clerkUserId,
    email: email ?? "",
    name: name ?? undefined
  }).select("*").single();
  if (error) throw error;
  return data;
}

export async function getProfileByClerkId(clerkUserId: string) {
  const sb = getAdminSupabase();
  const { data } = await sb.from("profiles").select("*").eq("clerk_user_id", clerkUserId).single();
  return data ?? null;
}

export async function listAssessments(profileId: string, limit = 20) {
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("assessments")
    .select("id, created_at, result")
    .eq("user_id", profileId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function getAssessment(id: string) {
  const sb = getAdminSupabase();
  const { data, error } = await sb.from("assessments").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function createAssessment(profileId: string, inputs: any, result: any) {
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("assessments")
    .insert({ user_id: profileId, inputs, result })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function listDocuments(profileId: string, limit = 50) {
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("documents")
    .select("id, title, word_count, status, updated_at")
    .eq("user_id", profileId)
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function createDocument(profileId: string, title = "Untitled") {
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("documents")
    .insert({ user_id: profileId, title })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

export async function getDocument(id: string) {
  const sb = getAdminSupabase();
  const { data, error } = await sb.from("documents").select("*").eq("id", id).single();
  if (error) throw error;
  return data;
}

export async function updateDocumentMeta(id: string, fields: Partial<{ title: string; word_count: number; status: string; liveblocks_room_id: string; }>) {
  const sb = getAdminSupabase();
  const { error } = await sb.from("documents").update(fields).eq("id", id);
  if (error) throw error;
}

export async function appendDocumentVersion(documentId: string, summary?: string) {
  const sb = getAdminSupabase();
  // get latest version
  const { data: latest } = await sb
    .from("document_versions")
    .select("version")
    .eq("document_id", documentId)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();
  const next = (latest?.version ?? 0) + 1;
  const { error } = await sb.from("document_versions").insert({ document_id: documentId, version: next, summary });
  if (error) throw error;
  return next;
}

export async function getOrCreateThread(profileId: string) {
  const sb = getAdminSupabase();
  const { data: threads } = await sb
    .from("coach_threads")
    .select("id")
    .eq("user_id", profileId)
    .order("last_message_at", { ascending: false })
    .limit(1);
  if (threads && threads.length) return threads[0].id as string;
  const { data, error } = await sb.from("coach_threads").insert({ user_id: profileId }).select("id").single();
  if (error) throw error;
  return data.id as string;
}

export async function listMessages(threadId: string, limit = 100) {
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("messages")
    .select("id, sender, text, created_at")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true })
    .limit(limit);
  if (error) throw error;
  return data ?? [];
}

export async function addMessage(threadId: string, sender: "user" | "coach", text: string) {
  const sb = getAdminSupabase();
  const { error } = await sb.from("messages").insert({ thread_id: threadId, sender, text });
  if (error) throw error;
}

// Legacy functions for backward compatibility
export async function admin() {
  return getAdminSupabase();
}

export async function getProfileId(clerkUserId: string) {
  const profile = await getProfileByClerkId(clerkUserId);
  return profile?.id ?? null;
} 