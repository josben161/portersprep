import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabaseAdmin';
import { requireAuthedProfile } from '@/lib/authz';

export async function POST(request: NextRequest) {
  try {
    const { profile } = await requireAuthedProfile();
    const { message, context } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const supabase = getAdminSupabase();

    // For now, return a simple response
    // TODO: Integrate with OpenAI in the next phase
    const response = `Thank you for your message: "${message}". I'm The Admit Coach, and I'm here to help you with your college application process. 

I can help you with:
- Essay writing and brainstorming
- Application strategy and timeline
- School selection guidance
- Profile completion
- Recommendation management
- Interview preparation

What would you like to work on today?`;

    // Store the conversation
    const { data: conversation, error: conversationError } = await supabase
      .from('coach_conversations')
      .insert({
        user_id: profile.id,
        message,
        response,
        context: context || {}
      })
      .select()
      .single();

    if (conversationError) {
      console.error('Error storing conversation:', conversationError);
    }

    return NextResponse.json({
      message: response,
      conversationId: conversation?.id
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