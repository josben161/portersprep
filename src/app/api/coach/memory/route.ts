import { NextRequest, NextResponse } from 'next/server';
import { getAdminSupabase } from '@/lib/supabaseAdmin';
import { requireAuthedProfile } from '@/lib/authz';

export async function POST(request: NextRequest) {
  try {
    const { profile } = await requireAuthedProfile();
    const { memory_type, content } = await request.json();

    if (!memory_type || !content) {
      return NextResponse.json({ error: 'Memory type and content are required' }, { status: 400 });
    }

    const supabase = getAdminSupabase();

    const { data: memory, error } = await supabase
      .from('coach_memory')
      .insert({
        user_id: profile.id,
        memory_type,
        content
      })
      .select()
      .single();

    if (error) {
      console.error('Error storing memory:', error);
      return NextResponse.json({ error: 'Failed to store memory' }, { status: 500 });
    }

    return NextResponse.json({ memory });

  } catch (error) {
    console.error('Coach memory error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { profile } = await requireAuthedProfile();
    const { searchParams } = new URL(request.url);
    const memoryType = searchParams.get('type');

    const supabase = getAdminSupabase();

    let query = supabase
      .from('coach_memory')
      .select('*')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false });

    if (memoryType) {
      query = query.eq('memory_type', memoryType);
    }

    const { data: memory, error } = await query.limit(20);

    if (error) {
      console.error('Error fetching memory:', error);
      return NextResponse.json({ error: 'Failed to fetch memory' }, { status: 500 });
    }

    return NextResponse.json({ memory: memory || [] });

  } catch (error) {
    console.error('Coach memory error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 