import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    console.error("Missing Supabase environment variables for server client:", {
      url: !!url,
      key: !!key,
    });
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }
  
  const cookieStore = cookies();
  return createServerClient(
    url,
    key,
    { cookies: { get: (k: string) => cookieStore.get(k)?.value } },
  );
}

// Admin client for scripts/server-only tasks (never ship to client)
export const supabaseAdmin = (() => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !key) {
    console.error("Missing Supabase environment variables for admin client:", {
      url: !!url,
      key: !!key,
    });
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  
  return createClient(url, key, {
    db: { schema: "Admitarchitect" },
    auth: { persistSession: false },
  });
})();

// Legacy functions for backward compatibility
export async function getOrCreateProfileByClerkId(
  clerkUserId: string,
  email?: string | null,
  name?: string | null,
) {
  try {
    console.log(`DB: Getting or creating profile for clerk_user_id: ${clerkUserId}`);
    const sb = getAdminSupabase();

    // First try to get existing profile
    const { data: existing, error: lookupError } = await sb
      .from("profiles")
      .select("*")
      .eq("clerk_user_id", clerkUserId)
      .single();
    
    if (lookupError) {
      console.error("DB: Error looking up profile:", lookupError);
      throw lookupError;
    }
    
    if (existing) {
      console.log(`DB: Found existing profile for clerk_user_id: ${clerkUserId}`);
      return existing;
    }

    // If no profile exists, create one with service role (should bypass RLS)
    console.log(`DB: Creating new profile for clerk_user_id: ${clerkUserId}`);
    const { data, error } = await sb
      .from("profiles")
      .insert({
        clerk_user_id: clerkUserId,
        email: email ?? "",
        name: name ?? undefined,
      })
      .select("*")
      .single();

    if (error) {
      console.error("DB: Error creating profile:", error);
      throw error;
    }

    console.log(`DB: Successfully created profile for clerk_user_id: ${clerkUserId}`);
    return data;
  } catch (error) {
    console.error("DB: Error in getOrCreateProfileByClerkId:", error);
    throw error;
  }
}

export async function getProfileByClerkId(clerkUserId: string) {
  const sb = getAdminSupabase();
  const { data } = await sb
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", clerkUserId)
    .single();
  return data ?? null;
}

export async function updateProfile(
  clerkUserId: string,
  updates: Partial<{ name: string; email: string }>,
) {
  const sb = getAdminSupabase();
  const { data, error } = await sb
    .from("profiles")
    .update(updates)
    .eq("clerk_user_id", clerkUserId)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function listAssessments(profileId: string, limit = 20) {
  const sb = getAdminSupabase();

  // Validate profileId is a proper UUID
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(profileId)) {
    console.error("Invalid profileId format:", profileId);
    return [];
  }

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
  const { data, error } = await sb
    .from("assessments")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
}

export async function createAssessment(
  profileId: string,
  inputs: any,
  result: any,
) {
  const sb = getAdminSupabase();

  // Validate profileId is a proper UUID
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(profileId)) {
    console.error("Invalid profileId format:", profileId);
    throw new Error("Invalid user profile");
  }

  const { data, error } = await sb
    .from("assessments")
    .insert({ user_id: profileId, inputs, result })
    .select("id")
    .single();
  if (error) throw error;
  return data.id as string;
}

// Note: Documents, coach_threads, and messages tables don't exist in the new schema
// These functions have been removed to prevent 500 errors

// Legacy functions for backward compatibility
export async function admin() {
  return getAdminSupabase();
}

export async function getProfileId(clerkUserId: string) {
  const profile = await getProfileByClerkId(clerkUserId);
  return profile?.id ?? null;
}
