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
      return new Response("Failed to create application", { status: 500 });
    }
    
    return Response.json(data);
  } catch (error) {
    console.error("Applications POST error:", error);
    return new Response("Application error", { status: 500 });
  }
} 