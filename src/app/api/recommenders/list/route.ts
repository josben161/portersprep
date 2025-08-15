import { NextRequest, NextResponse } from "next/server";
import { getContext } from "@/lib/context";
import { z } from "zod";

const ListSchema = z.object({
  applicationId: z.string().uuid(),
  userId: z.string().uuid().or(z.string().min(3)),
});

export async function GET(req: NextRequest) {
  const params = Object.fromEntries(req.nextUrl.searchParams.entries());
  const parsed = ListSchema.safeParse(params);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const { applicationId: appId, userId } = parsed.data;
  const ctx = await getContext(userId, {
    applications: { applicationId: appId },
    recommendations: { applicationId: appId },
  });
  return NextResponse.json({
    applicationId: appId,
    recommenders: ctx.recommendations ?? [],
  });
}
