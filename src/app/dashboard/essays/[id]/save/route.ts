import { requireAuthedProfile } from "@/lib/authz";
import { NextRequest, NextResponse } from "next/server";
import { getDocument, updateDocumentMeta } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const { profile } = await requireAuthedProfile();

    const body = await request.json();
    const { title, content } = body;

    // Validate input
    if (title !== undefined && typeof title !== "string") {
      return NextResponse.json({ error: "Invalid title" }, { status: 400 });
    }

    if (content !== undefined && typeof content !== "string") {
      return NextResponse.json({ error: "Invalid content" }, { status: 400 });
    }

    // First, verify ownership
    const document = await getDocument(params.id);
    if (!document || document.user_id !== profile.id) {
      return NextResponse.json(
        { error: "Document not found or access denied" },
        { status: 404 },
      );
    }

    // Update the document
    const updateData: any = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) {
      // Count words for content
      const wordCount = content
        .trim()
        .split(/\s+/)
        .filter((word: string) => word.length > 0).length;
      updateData.word_count = wordCount;
    }
    updateData.updated_at = new Date().toISOString();

    await updateDocumentMeta(params.id, updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in document save route:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
