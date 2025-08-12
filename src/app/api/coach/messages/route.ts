import { auth, currentUser } from "@clerk/nextjs/server";
import { addMessage, getOrCreateThread, getOrCreateProfileByClerkId, listMessages } from "@/lib/db";

export async function GET() {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  const u = await currentUser();
  const profile = await getOrCreateProfileByClerkId(userId, u?.emailAddresses?.[0]?.emailAddress, u?.firstName ?? undefined);
  const threadId = await getOrCreateThread(profile.id);
  const msgs = await listMessages(threadId);
  return Response.json(msgs);
}

export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });
  const u = await currentUser();
  const profile = await getOrCreateProfileByClerkId(userId, u?.emailAddresses?.[0]?.emailAddress, u?.firstName ?? undefined);
  const { text } = await req.json();
  if (!text || typeof text !== "string") return new Response("Bad Request", { status: 400 });
  const threadId = await getOrCreateThread(profile.id);
  await addMessage(threadId, "user", text);
  return new Response("ok");
} 