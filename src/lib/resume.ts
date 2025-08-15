// src/lib/resume.ts
export async function assessResume(userId: string, resumeText: string) {
  const res = await fetch("/api/resume/assess", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, resumeText }),
  });
  if (!res.ok) throw new Error(`Resume assess failed: ${res.status}`);
  return res.json() as Promise<{
    content: string;
    usage?: any;
    traceId: string;
  }>;
}
