// import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getProfileId, admin } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
    const { title, content } = body;

    // Validate input
    if (title !== undefined && typeof title !== 'string') {
      return NextResponse.json({ error: "Invalid title" }, { status: 400 });
    }

    if (content !== undefined && typeof content !== 'string') {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }

    const supabase = admin();

    // First, verify ownership
    const { data: existingEssay, error: fetchError } = await supabase
      .from('essays')
      .select('id')
      .eq('id', params.id)
      .eq('profile_id', profileId)
      .single();

    if (fetchError || !existingEssay) {
      return NextResponse.json({ error: "Essay not found or access denied" }, { status: 404 });
    }

    // Update the essay
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    updateData.updated_at = new Date().toISOString();

    const { data: updatedEssay, error: updateError } = await supabase
      .from('essays')
      .update(updateData)
      .eq('id', params.id)
      .eq('profile_id', profileId)
      .select('id, title, content, updated_at')
      .single();

    if (updateError) {
      console.error('Error updating essay:', updateError);
      return NextResponse.json({ error: "Failed to update essay" }, { status: 500 });
    }

    return NextResponse.json(updatedEssay);
  } catch (error) {
    console.error('Error in essay save route:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
} 