import { NextRequest } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new Response("Unauthorized", { status: 401 });
    }

    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress ?? "";
    const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || user?.firstName || "";

    const sb = getAdminSupabase();
    
    // Check if profile already exists
    const { data: existing } = await sb
      .from("profiles")
      .select("id")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (existing) {
      return Response.json({ 
        success: true, 
        profile: existing,
        message: "Profile already exists" 
      });
    }

    // Create new profile with RLS bypass
    const { data: profile, error } = await sb
      .from("profiles")
      .insert({
        clerk_user_id: userId,
        email,
        name,
        subscription_tier: "free"
      })
      .select("*")
      .single();

    if (error) {
      console.error("Profile creation error:", error);
      return new Response(`Failed to create profile: ${error.message}`, { status: 500 });
    }

    return Response.json({ 
      success: true, 
      profile,
      message: "Profile created successfully" 
    });

  } catch (error) {
    console.error("Profile creation error:", error);
    return new Response(`Profile creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 });
  }
} 