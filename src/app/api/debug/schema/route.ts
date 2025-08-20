import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function GET() {
  try {
    const sb = getAdminSupabase();
    
    // Query to get all tables in the public schema
    const { data: tables, error } = await sb
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
    
    if (error) {
      console.error("Schema check error:", error);
      return Response.json({ error: error.message }, { status: 500 });
    }
    
    return Response.json({ 
      tables: tables?.map(t => t.table_name) || [],
      message: "Schema check completed"
    });
  } catch (error) {
    console.error("Schema check failed:", error);
    return Response.json({ error: "Schema check failed" }, { status: 500 });
  }
}
