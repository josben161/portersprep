import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const sb = getAdminSupabase();
    
    // Query to get all tables in the public schema
    const { data: tables, error } = await sb
      .rpc('get_tables_info');
    
    if (error) {
      console.error("Tables check error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
    
    return Response.json({ 
      tables: tables || [],
      message: "Tables check completed"
    });
  } catch (error) {
    console.error("Tables check failed:", error);
    return Response.json({ error: "Tables check failed" }, { status: 500 });
  }
}
