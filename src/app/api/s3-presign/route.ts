import { requireAuthedProfile } from "@/lib/authz";

export async function GET(req: Request) {
  await requireAuthedProfile();
  return new Response("Use POST", { status: 405 });
} 