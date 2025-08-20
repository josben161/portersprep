import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return Response.json({ 
        authenticated: false, 
        message: "No user found - not authenticated" 
      });
    }
    
    return Response.json({ 
      authenticated: true,
      user: {
        id: user.id,
        email: user.emailAddresses?.[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username
      }
    });
  } catch (error) {
    console.error("Auth debug error:", error);
    return Response.json({ 
      authenticated: false, 
      error: error instanceof Error ? error.message : "Unknown error" 
    });
  }
}
