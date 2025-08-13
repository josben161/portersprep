import { NextRequest } from "next/server";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { requireAuthedProfile } from "@/lib/authz";

export async function GET() {
  try {
    const { profile } = await requireAuthedProfile();
    const sb = getAdminSupabase();
    
    const { data: recommenders, error } = await sb
      .from("recommenders")
      .select("*")
      .eq("user_id", profile.id)
      .order("name");
      
    if (error) {
      console.error("Recommenders fetch error:", error);
      return Response.json([]);
    }
    
    return Response.json(recommenders || []);
  } catch (error) {
    console.error("Recommenders API error:", error);
    return Response.json([]);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { profile } = await requireAuthedProfile();
    const { name, title, organization, email, phone, relationship, years_known } = await req.json();
    
    if (!name) {
      return new Response("Name is required", { status: 400 });
    }
    
    const sb = getAdminSupabase();
    const { data, error } = await sb
      .from("recommenders")
      .insert({
        user_id: profile.id,
        name,
        title,
        organization,
        email,
        phone,
        relationship,
        years_known
      })
      .select("*")
      .single();
      
    if (error) {
      console.error("Recommender create error:", error);
      return new Response("Failed to create recommender", { status: 500 });
    }
    
    return Response.json(data);
  } catch (error) {
    console.error("Recommender creation error:", error);
    return new Response("Failed to create recommender", { status: 500 });
  }
} 