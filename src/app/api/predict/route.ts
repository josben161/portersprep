import { requireAuthedProfile } from "@/lib/authz";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const { profile } = await requireAuthedProfile();
    const sb = getAdminSupabase();
    
    // Query the latest assessment directly from the assessments table
    const { data, error } = await sb
      .from("assessments")
      .select("id, inputs, result, created_at")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
      
    if (error) {
      console.error("Predict fetch error:", error);
      // Return null if no prediction found (not an error)
      if (error.code === "PGRST116") {
        return Response.json(null);
      }
      return new Response(`Failed to fetch prediction: ${error.message}`, { status: 500 });
    }
    
    return Response.json(data);
  } catch (error) {
    console.error("Predict API error:", error);
    return new Response("Failed to fetch prediction", { status: 500 });
  }
} 