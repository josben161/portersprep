export async function chatJson({
  system,
  user,
  model = process.env.OPENAI_MODEL || "gpt-4o-mini",
  temperature = 0.5,
  timeoutMs = 20000,
}: {
  system: string;
  user: string;
  model?: string;
  temperature?: number;
  timeoutMs?: number;
}) {
  try {
    const { content } = await callGateway("coach", {
      userId: "anonymous",
      params: {
        system,
        user,
        model,
        temperature,
      },
    });
    return JSON.parse(content);
  } catch (e) {
    return { error: "ai_timeout_or_error" };
  }
}

export async function callGateway(
  mode: "coach" | "predict" | "resume" | "recommender",
  body: any,
) {
  // Use absolute URL when running server-side
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  const url = `${baseUrl}/api/ai/gateway`;
  
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ? { ...body, mode } : { mode }),
  });
  if (!res.ok) throw new Error(`Gateway error ${res.status}`);
  return res.json();
}
