import { getAdminSupabase } from "./supabaseAdmin";

export function admin() {
  return getAdminSupabase();
}

export async function getProfileId(clerkUserId: string): Promise<string | null> {
  const supabase = admin();
  
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('clerk_user_id', clerkUserId)
    .single();

  if (error) {
    console.error('Error fetching profile ID:', error);
    return null;
  }

  return data?.id || null;
} 