import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const sb = getAdminSupabase();

    // Test basic connection
    const { data, error } = await sb
      .from("assessments")
      .select("count")
      .limit(1);

    if (error) {
      console.error("Admin client test error:", error);
      return Response.json(
        {
          success: false,
          error: error.message,
          code: error.code,
          details: error.details,
        },
        { status: 500 },
      );
    }

    // Test insert capability
    const testData = {
      user_id: "00000000-0000-0000-0000-000000000000", // Test UUID
      inputs: { test: true },
      result: { test: true },
    };

    const { data: insertData, error: insertError } = await sb
      .from("assessments")
      .insert(testData)
      .select("id")
      .single();

    if (insertError) {
      console.error("Admin client insert test error:", insertError);
      return Response.json(
        {
          success: false,
          insertError: insertError.message,
          code: insertError.code,
          details: insertError.details,
        },
        { status: 500 },
      );
    }

    // Clean up test data
    await sb.from("assessments").delete().eq("id", insertData.id);

    return Response.json({
      success: true,
      message: "Admin client is working correctly",
      testInsertId: insertData.id,
    });
  } catch (error) {
    console.error("Test admin API error:", error);
    return Response.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
