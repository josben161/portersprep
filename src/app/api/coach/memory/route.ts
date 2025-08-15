import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { requireAuthedProfile } from "@/lib/authz";

export async function POST(request: NextRequest) {
  const traceId = `memory-post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    const { profile } = await requireAuthedProfile();
    const { memory_type, content } = await request.json();

    if (!memory_type || !content) {
      return NextResponse.json(
        { error: "Memory type and content are required" },
        { status: 400 },
      );
    }

    // Check if Supabase is available
    const isSupabaseAvailable =
      typeof window === "undefined" &&
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !!process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!isSupabaseAvailable) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 503 },
      );
    }

    let supabase = null;
    try {
      supabase = getAdminSupabase();
    } catch (error) {
      console.error("Failed to initialize Supabase:", error);
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 503 },
      );
    }

    const { data: memory, error } = await supabase
      .from("coach_memory")
      .insert({
        user_id: profile.id,
        memory_type,
        content,
      })
      .select()
      .single();

    if (error) {
      console.error(`Error storing memory [${traceId}]:`, error);
      return NextResponse.json(
        { error: "Failed to store memory" },
        { status: 500 },
      );
    }

    return NextResponse.json({ memory });
  } catch (error) {
    console.error(`Coach memory error [${traceId}]:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const traceId = `memory-get-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    const { profile } = await requireAuthedProfile();
    const { searchParams } = new URL(request.url);
    const memoryType = searchParams.get("type");

    // Check if Supabase is available
    const isSupabaseAvailable =
      typeof window === "undefined" &&
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !!process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!isSupabaseAvailable) {
      return NextResponse.json({ memory: [] });
    }

    let supabase = null;
    try {
      supabase = getAdminSupabase();
    } catch (error) {
      console.error("Failed to initialize Supabase:", error);
      return NextResponse.json({ memory: [] });
    }

    let query = supabase
      .from("coach_memory")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false });

    if (memoryType) {
      query = query.eq("memory_type", memoryType);
    }

    const { data: memory, error } = await query.limit(20);

    if (error) {
      console.error(`Error fetching memory [${traceId}]:`, error);
      return NextResponse.json({ memory: [] });
    }

    return NextResponse.json({ memory: memory || [] });
  } catch (error) {
    console.error(`Coach memory error [${traceId}]:`, error);
    return NextResponse.json({ memory: [] });
  }
}
