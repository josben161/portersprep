import { NextRequest } from "next/server";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { requireAuthedProfile } from "@/lib/authz";

export async function GET() {
  try {
    const { profile } = await requireAuthedProfile();
    const sb = getAdminSupabase();
    
    // Simple query that should work - removed deadline from schools selection
    const { data, error } = await sb
      .from("applications")
      .select("id, status, school_id, school:schools(id,name)")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("Applications fetch error:", error);
      return Response.json([]);
    }
    
    return Response.json(data ?? []);
  } catch (error) {
    console.error("Applications API error:", error);
    return Response.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { profile } = await requireAuthedProfile();
    const body = await req.json().catch(() => ({}));
    const { school_id, round, deadline } = body || {};
    
    console.log("Creating application with data:", { school_id, round, deadline, user_id: profile.id });
    
    if (!school_id) return new Response("school_id required", { status: 400 });

    const sb = getAdminSupabase();
    const { data, error } = await sb
      .from("applications")
      .insert({
        user_id: profile.id, 
        school_id, 
        round: round ?? null, 
        status: "planning", 
        deadline: deadline ?? null
      })
      .select("id")
      .single();
      
    if (error) {
      console.error("Application create error:", error);
      
      // Provide more specific error messages
      if (error.code === '42501') {
        return new Response("Database permission error. Please contact support.", { status: 500 });
      } else if (error.code === '42P01') {
        return new Response("Applications table not found. Please contact support.", { status: 500 });
      } else if (error.code === '23503') {
        return new Response("Invalid school_id. Please select a valid school.", { status: 400 });
      } else {
        return new Response(`Failed to create application: ${error.message}`, { status: 500 });
      }
    }
    
    console.log("Application created successfully:", data);
    return Response.json(data);
  } catch (error) {
    console.error("Applications POST error:", error);
    return new Response(`Application error: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
} 