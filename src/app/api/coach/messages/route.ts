// import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getProfileId, admin } from "@/lib/db";

export async function GET() {
  try {
    // const { userId } = auth();
    const userId = "dummy-user-id"; // Temporary for build

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profileId = await getProfileId(userId);
    if (!profileId) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const supabase = admin();

    const { data: messages, error } = await supabase
      .from('messages')
      .select('id, text, from, created_at')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: true })
      .limit(100);

    if (error) {
      console.error('Error fetching messages:', error);
      return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
    }

    return NextResponse.json({ messages: messages || [] });
  } catch (error) {
    console.error('Error in messages GET route:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // const { userId } = auth();
    const userId = "dummy-user-id"; // Temporary for build

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profileId = await getProfileId(userId);
    if (!profileId) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string' || text.trim().length === 0) {
      return NextResponse.json({ error: "Message text is required" }, { status: 400 });
    }

    if (text.length > 2000) {
      return NextResponse.json({ error: "Message too long (max 2000 characters)" }, { status: 400 });
    }

    const supabase = admin();

    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        profile_id: profileId,
        text: text.trim(),
        from: 'user',
      })
      .select('id, text, from, created_at')
      .single();

    if (error) {
      console.error('Error creating message:', error);
      return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error in messages POST route:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 