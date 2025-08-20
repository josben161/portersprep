import { SupabaseClient } from "@supabase/supabase-js";

export async function profile(db: SupabaseClient<any, any, any>, userId: string) {
  try {
    console.log(`Profile Provider: Loading profile for user ${userId}`);
    const { data, error } = await db
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle();
    if (error) {
      console.error("Profile Provider: Error loading profile:", error);
      throw error;
    }
    console.log(`Profile Provider: Successfully loaded profile for user ${userId}`);
    return data;
  } catch (error) {
    console.error("Profile Provider: Error in profile function:", error);
    throw error;
  }
}
