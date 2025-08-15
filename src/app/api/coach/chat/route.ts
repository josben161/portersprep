import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { requireAuthedProfile } from "@/lib/authz";
import { callGateway } from "@/lib/ai";

export async function POST(request: NextRequest) {
  const traceId = `chat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    const { profile } = await requireAuthedProfile();
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // Check if Supabase is available
    const isSupabaseAvailable =
      typeof window === "undefined" &&
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !!process.env.SUPABASE_SERVICE_ROLE_KEY;

    let supabase = null;
    if (isSupabaseAvailable) {
      try {
        supabase = getAdminSupabase();
      } catch (error) {
        console.error("Failed to initialize Supabase:", error);
      }
    }

    let response: string;
    let functionCall: any = null;

    // Generate AI response using the gateway
    try {
      console.log("Generating coach response...");
      const { content } = await callGateway("coach", {
        userId: profile.id,
        params: {
          message,
          context,
        },
      });

      response =
        content ||
        "I apologize, but I encountered an error processing your request.";
      console.log("AI Response received:", response);
    } catch (error) {
      console.error(`OpenAI error [${traceId}]:`, error);
      // Check if it's a gateway error with traceId
      if (error && typeof error === "object" && "traceId" in error) {
        return NextResponse.json(
          { error: "AI service error", traceId: error.traceId },
          { status: 500 },
        );
      }
      // Fallback response
      response = `I'm here to help you with your college application process. I can assist with essay writing, application strategy, school selection, and more. What specific area would you like to work on?`;
    }

    // Store the conversation only if Supabase is available
    let conversation = null;
    if (supabase) {
      try {
        const { data, error: conversationError } = await supabase
          .from("coach_conversations")
          .insert({
            user_id: profile.id,
            message,
            response,
            context: {
              ...context,
              functionCall: functionCall,
            },
          })
          .select()
          .single();

        if (conversationError) {
          console.error("Error storing conversation:", conversationError);
        } else {
          conversation = data;
        }
      } catch (error) {
        console.error("Error storing conversation:", error);
      }
    }

    return NextResponse.json({
      message: response,
      conversationId: conversation?.id,
      functionCall: functionCall,
    });
  } catch (error) {
    console.error(`Coach chat error [${traceId}]:`, error);
    return NextResponse.json(
      { error: "Internal server error", traceId },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { profile } = await requireAuthedProfile();

    // Check if Supabase is available
    const isSupabaseAvailable =
      typeof window === "undefined" &&
      !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
      !!process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!isSupabaseAvailable) {
      return NextResponse.json({ conversations: [] });
    }

    let supabase = null;
    try {
      supabase = getAdminSupabase();
    } catch (error) {
      console.error("Failed to initialize Supabase:", error);
      return NextResponse.json({ conversations: [] });
    }

    // Get recent conversations
    const { data: conversations, error } = await supabase
      .from("coach_conversations")
      .select("*")
      .eq("user_id", profile.id)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching conversations:", error);
      return NextResponse.json({ conversations: [] });
    }

    return NextResponse.json({ conversations: conversations || [] });
  } catch (error) {
    console.error("Coach conversations error:", error);
    return NextResponse.json({ conversations: [] });
  }
}
