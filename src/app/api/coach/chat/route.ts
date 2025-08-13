import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabaseAdmin';
import { requireAuthedProfile } from '@/lib/authz';
import { generateCoachResponse, handleFunctionCall } from '@/lib/openai';
import { gatherUserContext } from '@/lib/coach-context';

export async function POST(request: NextRequest) {
  try {
    const { profile } = await requireAuthedProfile();
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const supabase = getAdminSupabase();

    // Gather user context
    const userContext = await gatherUserContext(profile.id);

    let response: string;
    let functionCall: any = null;

    // Generate AI response
    const messages = [
      { role: 'user' as const, content: message }
    ];

    try {
      const aiResponse = await generateCoachResponse(messages, userContext);
      
      if (aiResponse.message?.function_call) {
        // Handle function call
        functionCall = aiResponse.message.function_call;
        response = await handleFunctionCall(functionCall);
      } else {
        response = aiResponse.message?.content || 'I apologize, but I encountered an error. Please try again.';
      }
    } catch (error) {
      console.error('OpenAI error:', error);
      // Fallback response
      response = `I'm here to help you with your college application process. I can assist with essay writing, application strategy, school selection, and more. What specific area would you like to work on?`;
    }

    // Store the conversation
    const { data: conversation, error: conversationError } = await supabase
      .from('coach_conversations')
      .insert({
        user_id: profile.id,
        message,
        response,
        context: {
          ...context,
          userContext: userContext,
          functionCall: functionCall
        }
      })
      .select()
      .single();

    if (conversationError) {
      console.error('Error storing conversation:', conversationError);
    }

    // Store insights in memory if function was called
    if (functionCall) {
      try {
        await supabase
          .from('coach_memory')
          .insert({
            user_id: profile.id,
            memory_type: 'insight',
            content: {
              function: functionCall.name,
              arguments: functionCall.arguments,
              timestamp: new Date().toISOString()
            }
          });
      } catch (error) {
        console.error('Error storing memory:', error);
      }
    }

    return NextResponse.json({
      message: response,
      conversationId: conversation?.id,
      functionCall: functionCall
    });

  } catch (error) {
    console.error('Coach chat error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { profile } = await requireAuthedProfile();
    const supabase = getAdminSupabase();

    // Get recent conversations
    const { data: conversations, error } = await supabase
      .from('coach_conversations')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching conversations:', error);
      return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
    }

    return NextResponse.json({ conversations: conversations || [] });

  } catch (error) {
    console.error('Coach conversations error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 