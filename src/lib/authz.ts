import { auth, currentUser } from "@clerk/nextjs/server";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function requireAuthedProfile() {
  try {
    const user = await currentUser();
    if (!user) {
      console.error("Auth error: No current user found");
      throw new Error("unauthorized");
    }

    console.log(`Auth: Looking up profile for clerk_user_id: ${user.id}`);
    const sb = getAdminSupabase();
    const { data: existing, error: lookupError } = await sb
      .from("profiles")
      .select("id, clerk_user_id, email, name, subscription_tier")
      .eq("clerk_user_id", user.id)
      .maybeSingle();

    if (lookupError) {
      console.error("Auth error: Failed to lookup profile:", lookupError);
      throw lookupError;
    }

    if (existing) {
      console.log(`Auth: Found existing profile for user ${user.id}`);
      return { profile: existing };
    }

    const email = user.emailAddresses?.[0]?.emailAddress ?? "";
    const name =
      user.firstName || user.lastName
        ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
        : user.username ?? "New User";

    console.log(`Auth: Creating new profile for user ${user.id} with email: ${email}`);
    const { data: created, error } = await sb
      .from("profiles")
      .insert({ clerk_user_id: user.id, email, name })
      .select()
      .single();

    if (error) {
      console.error("Auth error: Failed to create profile:", error);
      throw error;
    }
    
    console.log(`Auth: Successfully created profile for user ${user.id}`);
    return { profile: created };
  } catch (error) {
    console.error("Auth error in requireAuthedProfile:", error);
    throw error;
  }
}

export async function requireAuth() {
  const { userId } = auth();
  if (!userId) throw new Response("Unauthorized", { status: 401 });
  return { userId };
}
