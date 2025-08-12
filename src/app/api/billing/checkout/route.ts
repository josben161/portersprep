import { requireAuthedProfile } from "@/lib/authz";

export async function POST(req: Request){
  await requireAuthedProfile();
  return new Response("Not Implemented", { status: 501 });
} 