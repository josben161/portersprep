import { NextRequest, NextResponse } from "next/server";
import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { requireAuthedProfile } from "@/lib/authz";
import { generateCoachResponse, handleFunctionCall } from "@/lib/openai";
import { aiContextManager } from "@/lib/ai-context-manager";

export async function POST(request: NextRequest) {
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

    // Gather user context using the central AI context manager
    const userContext = await aiContextManager.getUserContext(profile.id);

    let response: string;
    let functionCall: any = null;

    // Generate AI response
    const messages = [{ role: "user" as const, content: message }];

    try {
      console.log("Generating coach response...");
      const aiResponse = await generateCoachResponse(messages, userContext);
      console.log("AI Response received:", aiResponse);

      // Check if response has function_call (OpenAI Choice type)
      if (
        aiResponse &&
        "message" in aiResponse &&
        aiResponse.message &&
        "function_call" in aiResponse.message &&
        aiResponse.message.function_call
      ) {
        // Handle function call with user ID for memory storage
        functionCall = aiResponse.message.function_call;
        response = await handleFunctionCall(functionCall, profile.id);
      } else if (aiResponse && "message" in aiResponse && aiResponse.message && "content" in aiResponse.message) {
        // Handle regular response
        response =
          aiResponse.message.content ||
          "I apologize, but I encountered an error processing your request.";
      } else {
        console.error("Unexpected AI response format:", aiResponse);
        response =
          "I apologize, but I encountered an error processing your request.";
      }
    } catch (error) {
      console.error("OpenAI error:", error);
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
              userContext: userContext,
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

    // Store insights in memory if function was called and Supabase is available
    if (functionCall && supabase) {
      try {
        await aiContextManager.storeMemory(profile.id, {
          memory_type: "insight",
          content: {
            function: functionCall.name,
            arguments: functionCall.arguments,
            timestamp: new Date().toISOString(),
          },
          context: { source: "planner_chat" },
        });
      } catch (error) {
        console.error("Error storing memory:", error);
      }
    }

    return NextResponse.json({
      message: response,
      conversationId: conversation?.id,
      functionCall: functionCall,
    });
  } catch (error) {
    console.error("Coach chat error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
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
