import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function POST() {
  try {
    const sb = getAdminSupabase();
    
    // Test data
    const testData = {
      user_id: "98e35975-5396-4573-b477-a632d803d18c", // Your actual user ID
      inputs: { test: true, timestamp: new Date().toISOString() },
      result: { schools: [{ school: "Test School", confidence: 0.8 }] }
    };
    
    console.log("Attempting to insert test assessment...");
    
    const { data, error } = await sb
      .from("assessments")
      .insert(testData)
      .select("id, created_at")
      .single();
    
    if (error) {
      console.error("Test insert failed:", error);
      return Response.json({
        success: false,
        error: error.message,
        code: error.code,
        details: error.details
      }, { status: 500 });
    }
    
    console.log("Test insert succeeded:", data);
    
    // Clean up
    await sb.from("assessments").delete().eq("id", data.id);
    
    return Response.json({
      success: true,
      message: "Assessment insert works! RLS is properly disabled.",
      testId: data.id,
      timestamp: data.created_at
    });
    
  } catch (error) {
    console.error("Test predict error:", error);
    return Response.json({
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
} 