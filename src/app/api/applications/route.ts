import { NextRequest } from "next/server";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { requireAuthedProfile } from "@/lib/authz";
import { getSchoolData } from "@/lib/schools";

export async function GET() {
  try {
    const { profile } = await requireAuthedProfile();
    const sb = getAdminSupabase();
    
    // Get applications with basic data (removed created_at since it doesn't exist)
    const { data: apps, error } = await sb
      .from("applications")
      .select("id, status, school_id, round")
      .eq("user_id", profile.id)
      .order("id", { ascending: false }); // Use id instead of created_at for ordering
      
    if (error) {
      console.error("Applications fetch error:", error);
      return Response.json([]);
    }

    // Enrich with school data from JSON files
    const enrichedApps = await Promise.all(
      (apps || []).map(async (app) => {
        try {
          const schoolData = await getSchoolData(app.school_id);
          return {
            ...app,
            school: schoolData ? {
              name: schoolData.name,
              id: schoolData.id
            } : null
          };
        } catch (error) {
          console.error(`Failed to load school data for ${app.school_id}:`, error);
          return {
            ...app,
            school: null
          };
        }
      })
    );
    
    return Response.json(enrichedApps);
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
    
    console.log("=== APPLICATION CREATION DEBUG ===");
    console.log("Full request body:", body);
    console.log("Extracted values:", { school_id, round, deadline, user_id: profile.id });
    console.log("School ID type:", typeof school_id);
    console.log("School ID value:", school_id);
    console.log("School ID length:", school_id?.length);
    console.log("==================================");
    
    if (!school_id) return new Response("school_id required", { status: 400 });

    // Validate that school_id is a string (not a UUID)
    if (typeof school_id !== 'string') {
      console.error("School ID is not a string:", typeof school_id, school_id);
      return new Response("school_id must be a string", { status: 400 });
    }

    // Additional validation for school_id format
    if (!school_id.trim()) {
      console.error("School ID is empty or whitespace");
      return new Response("school_id cannot be empty", { status: 400 });
    }

    const sb = getAdminSupabase();
    const { data, error } = await sb
      .from("applications")
      .insert({
        user_id: profile.id, 
        school_id: school_id.trim(), // Trim whitespace
        round: round ?? null, 
        status: "planning"
        // Removed deadline for now to avoid column error
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
      } else if (error.code === '22P02') {
        return new Response("Invalid school_id format. Please try again.", { status: 400 });
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