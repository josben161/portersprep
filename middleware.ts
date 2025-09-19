import type { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getTier } from "./src/lib/tier";
import { checkAndIncrement } from "./src/lib/usage";

const FEATURE_MAP: Record<string, "assessment_runs" | "redline_runs"> = {
  "/api/assessment/run": "assessment_runs",
  "/api/redline": "redline_runs",
};

export async function middleware(req: NextRequest) {
  const feature = FEATURE_MAP[new URL(req.url).pathname];
  if (!feature) return;

  try {
    const { userId } = auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const tier = await getTier(userId);
    const ok = await checkAndIncrement(userId, feature, tier);
    if (!ok) {
      return new Response(JSON.stringify({ error: "quota_exceeded" }), {
        status: 402,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    console.error("Middleware auth error:", error);
    return new Response(JSON.stringify({ error: "authentication_failed" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export const config = { matcher: ["/api/:path*"] };
