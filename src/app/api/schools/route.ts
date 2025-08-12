import { listSchools } from "@/lib/apps";

export async function GET() {
  return Response.json(await listSchools());
} 