import { auth, currentUser } from "@clerk/nextjs/server";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function requireAuthedProfile() {
  const { userId } = auth();
  if (!userId) throw new Response("Unauthorized", { status: 401 });
  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress ?? "";
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.firstName || "";

  const sb = getAdminSupabase();
  // Ensure profile exists
  const { data: existing } = await sb.from("profiles").select("*").eq("clerk_user_id", userId).maybeSingle();
  if (!existing) {
    const { data: created, error } = await sb.from("profiles").insert({
      clerk_user_id: userId, email, name, subscription_tier: "free"
    }).select("*").single();
    if (error) throw new Error(error.message);
    return { clerkUserId: userId, profile: created, email, name };
  }
  return { clerkUserId: userId, profile: existing, email, name };
} 