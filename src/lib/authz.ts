import { auth, currentUser } from "@clerk/nextjs/server";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function requireAuthedProfile() {
  const { userId } = auth();
  if (!userId) throw new Response("Unauthorized", { status: 401 });
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress ?? "";
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.firstName || "";

  const sb = getAdminSupabase();
  
  // First try to get existing profile
  const { data: existing } = await sb.from("profiles").select("*").eq("clerk_user_id", userId).maybeSingle();
  
  if (existing) {
    return { clerkUserId: userId, profile: existing, email, name };
  }
  
  // If no profile exists, try to create one with RLS bypass
  try {
    const { data: profile, error } = await sb.from("profiles").insert({
      clerk_user_id: userId, 
      email, 
      name, 
      subscription_tier: "free"
    }).select("*").single();
    
    if (error) {
      console.error("Profile creation error:", error);
      // If RLS blocks creation, return a minimal profile object
      return { 
        clerkUserId: userId, 
        profile: { id: userId, clerk_user_id: userId, email, name, subscription_tier: "free" }, 
        email, 
        name 
      };
    }
    
    return { clerkUserId: userId, profile, email, name };
  } catch (err) {
    console.error("Profile creation exception:", err);
    // Return minimal profile object as fallback
    return { 
      clerkUserId: userId, 
      profile: { id: userId, clerk_user_id: userId, email, name, subscription_tier: "free" }, 
      email, 
      name 
    };
  }
}

export async function requireAuth() {
  const { userId } = auth();
  if (!userId) throw new Response("Unauthorized", { status: 401 });
  return { userId };
} 