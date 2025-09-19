import { auth, currentUser } from "@clerk/nextjs/server";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function requireAuthedProfile() {
  try {
    console.log("Auth: Starting requireAuthedProfile");
    
    // First try to get user from auth() - this works with backend verification
    const { userId } = auth();
    if (!userId) {
      console.error("Auth error: No userId from auth()");
      throw new Error("unauthorized");
    }

    console.log(`Auth: Got userId from auth(): ${userId}`);
    
    // Try to get full user details
    let user;
    try {
      user = await currentUser();
      console.log("Auth: currentUser result:", user ? `User ID: ${user.id}` : "No user");
    } catch (error) {
      console.warn("Auth: currentUser failed, using userId from auth():", error);
      // If currentUser fails, we can still proceed with just the userId
    }

    const sb = getAdminSupabase();
    console.log("Auth: Got admin supabase client (service role)");
    
    // Use service role client to bypass RLS since we're using Clerk auth
    const { data: existing, error: lookupError } = await sb
      .from("profiles")
      .select("id, clerk_user_id, email, name, subscription_tier")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    console.log("Auth: Profile lookup result:", { existing: !!existing, error: lookupError });

    if (lookupError) {
      console.error("Auth error: Failed to lookup profile:", lookupError);
      throw lookupError;
    }

    if (existing) {
      console.log(`Auth: Found existing profile for user ${userId}`);
      return { profile: existing };
    }

    // If we have user details, use them; otherwise create with minimal info
    const email = user?.emailAddresses?.[0]?.emailAddress ?? "";
    const name = user 
      ? (user.firstName || user.lastName
          ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
          : user.username ?? "New User")
      : "New User";

    console.log(`Auth: Creating new profile for user ${userId} with email: ${email}`);
    const { data: created, error } = await sb
      .from("profiles")
      .insert({ clerk_user_id: userId, email, name })
      .select()
      .single();

    console.log("Auth: Profile creation result:", { created: !!created, error });

    if (error) {
      console.error("Auth error: Failed to create profile:", error);
      throw error;
    }
    
    console.log(`Auth: Successfully created profile for user ${userId}`);
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
