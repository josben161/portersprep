import { auth, currentUser } from "@clerk/nextjs/server";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function requireAuthedProfile() {
  const user = await currentUser();
  if (!user) throw new Error("unauthorized");

  const sb = getAdminSupabase();
  const { data: existing } = await sb
    .from("profiles")
    .select("id, clerk_user_id, email, name, subscription_tier")
    .eq("clerk_user_id", user.id)
    .maybeSingle();

  if (existing) return { profile: existing };

  const email = user.emailAddresses?.[0]?.emailAddress ?? "";
  const name =
    user.firstName || user.lastName
      ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim()
      : user.username ?? "New User";

  const { data: created, error } = await sb
    .from("profiles")
    .insert({ clerk_user_id: user.id, email, name })
    .select()
    .single();

  if (error) throw error;
  return { profile: created };
}

export async function requireAuth() {
  const { userId } = auth();
  if (!userId) throw new Response("Unauthorized", { status: 401 });
  return { userId };
}
