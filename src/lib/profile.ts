import { getAdminSupabase } from "./supabaseAdmin";

export async function ensureProfile({
  clerkUserId,
  email,
  name,
}: {
  clerkUserId: string;
  email: string;
  name?: string;
}) {
  try {
    console.log(`Profile: Ensuring profile exists for clerk_user_id: ${clerkUserId}`);
    const supabase = getAdminSupabase();
    const { data, error: lookupError } = await supabase
      .from("profiles")
      .select("id")
      .eq("clerk_user_id", clerkUserId)
      .single();
    
    if (lookupError) {
      console.error("Profile: Error looking up profile:", lookupError);
      throw lookupError;
    }
    
    if (!data) {
      console.log(`Profile: Creating new profile for clerk_user_id: ${clerkUserId}`);
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({ clerk_user_id: clerkUserId, email, name });
      
      if (insertError) {
        console.error("Profile: Error creating profile:", insertError);
        throw insertError;
      }
      console.log(`Profile: Successfully created profile for clerk_user_id: ${clerkUserId}`);
    } else {
      console.log(`Profile: Found existing profile for clerk_user_id: ${clerkUserId}`);
    }
  } catch (error) {
    console.error("Profile: Error in ensureProfile:", error);
    throw error;
  }
}

export async function getTierByClerkId(
  clerkUserId: string,
): Promise<"free" | "plus" | "pro"> {
  const supabase = getAdminSupabase();
  const { data } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("clerk_user_id", clerkUserId)
    .single();
  return (data?.subscription_tier as any) ?? "free";
}
