import { auth, currentUser } from "@clerk/nextjs/server";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function requireAuthedProfile() {
  const { userId } = auth();
  if (!userId) throw new Response("Unauthorized", { status: 401 });
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress ?? "";
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.firstName || "";

  const sb = getAdminSupabase();
  // Ensure profile exists - use upsert to avoid RLS issues
  const { data: profile, error } = await sb.from("profiles").upsert({
    clerk_user_id: userId, 
    email, 
    name, 
    subscription_tier: "free"
  }, {
    onConflict: "clerk_user_id",
    ignoreDuplicates: false
  }).select("*").single();
  
  if (error) {
    console.error("Profile upsert error:", error);
    throw new Error(`Profile error: ${error.message}`);
  }
  
  return { clerkUserId: userId, profile, email, name };
}

export async function requireAuth() {
  const { userId } = auth();
  if (!userId) throw new Response("Unauthorized", { status: 401 });
  return { userId };
} 