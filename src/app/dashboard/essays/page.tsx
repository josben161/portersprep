// import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import EssayEditor from "./EssayEditor";

// Force dynamic rendering to avoid Liveblocks build issues
export const dynamic = 'force-dynamic';

export default async function EssaysPage() {
  // const { userId } = auth();
  const userId = "dummy-user-id"; // Temporary for build
  
  if (!userId) {
    redirect('/sign-in');
  }

  return <EssayEditor userId={userId} />;
} 