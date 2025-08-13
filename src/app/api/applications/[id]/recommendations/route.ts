import { NextRequest } from "next/server";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { requireAuthedProfile } from "@/lib/authz";
import { getSchoolData } from "@/lib/schools";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const { profile } = await requireAuthedProfile();
    const sb = getAdminSupabase();
    
    // Verify application ownership
    const { data: app } = await sb
      .from("applications")
      .select("id, school_id")
      .eq("id", params.id)
      .eq("user_id", profile.id)
      .single();
      
    if (!app) {
      return new Response("Application not found", { status: 404 });
    }
    
    // Get recommender assignments with recommender details using proper join
    const { data: assignments, error } = await sb
      .from("recommender_assignments")
      .select(`
        id,
        status,
        request_date,
        due_date,
        notes,
        school_requirements,
        recommender_id,
        recommenders!recommender_assignments_recommender_id_fkey (
          id,
          name,
          title,
          organization,
          email,
          relationship
        )
      `)
      .eq("application_id", params.id)
      .order("created_at");
      
    if (error) {
      console.error("Assignments fetch error:", error);
      return Response.json([]);
    }
    
    // Get school requirements
    const schoolData = await getSchoolData(app.school_id);
    
    return Response.json({
      assignments: assignments || [],
      schoolRequirements: schoolData?.lor || null
    });
  } catch (error) {
    console.error("Recommendations API error:", error);
    return Response.json([]);
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { profile } = await requireAuthedProfile();
    const { recommender_id, due_date, notes } = await req.json();
    
    if (!recommender_id) {
      return new Response("Recommender ID is required", { status: 400 });
    }
    
    const sb = getAdminSupabase();
    
    // Verify application ownership
    const { data: app } = await sb
      .from("applications")
      .select("id, school_id")
      .eq("id", params.id)
      .eq("user_id", profile.id)
      .single();
      
    if (!app) {
      return new Response("Application not found", { status: 404 });
    }
    
    // Verify recommender ownership
    const { data: recommender } = await sb
      .from("recommenders")
      .select("id")
      .eq("id", recommender_id)
      .eq("user_id", profile.id)
      .single();
      
    if (!recommender) {
      return new Response("Recommender not found", { status: 404 });
    }
    
    // Get school requirements
    const schoolData = await getSchoolData(app.school_id);
    const schoolRequirements = schoolData?.lor ? {
      count: schoolData.lor.count,
      format: schoolData.lor.format,
      school_name: schoolData.name
    } : null;
    
    // Create assignment
    const { data, error } = await sb
      .from("recommender_assignments")
      .insert({
        application_id: params.id,
        recommender_id,
        due_date,
        notes,
        school_requirements: schoolRequirements
      })
      .select(`
        id,
        status,
        request_date,
        due_date,
        notes,
        school_requirements,
        recommender_id,
        recommenders!recommender_assignments_recommender_id_fkey (
          id,
          name,
          title,
          organization,
          email,
          relationship
        )
      `)
      .single();
      
    if (error) {
      console.error("Assignment create error:", error);
      return new Response("Failed to create assignment", { status: 500 });
    }
    
    return Response.json(data);
  } catch (error) {
    console.error("Recommendations API error:", error);
    return new Response("Internal server error", { status: 500 });
  }
} 