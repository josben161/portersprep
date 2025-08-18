import { requireAuthedProfile } from "@/lib/authz";

export async function GET() {
  const { profile } = await requireAuthedProfile();
  return Response.json({ ok: true, profileId: profile.id });
}
