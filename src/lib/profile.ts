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
  const supabase = getAdminSupabase();
  const { data } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", clerkUserId)
    .single();
  if (!data)
    await supabase
      .from("profiles")
      .insert({ clerk_user_id: clerkUserId, email, name });
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
