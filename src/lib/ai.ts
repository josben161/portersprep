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
  const ctrl = new AbortController();
  const to = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY!}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature,
      }),
      signal: ctrl.signal,
    });
    const j = await res.json();
    const txt = j.choices?.[0]?.message?.content ?? "{}";
    return JSON.parse(txt);
  } catch (e) {
    return { error: "ai_timeout_or_error" };
  } finally {
    clearTimeout(to);
  }
}
