"use client";
import { useEffect, useState } from "react";

export default function CoachPage() {
  const [messages, setMessages] = useState<{id:number; sender:string; text:string; created_at:string}[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function load() {
    const res = await fetch("/api/coach/messages");
    if (res.ok) setMessages(await res.json());
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  async function send() {
    if (!text.trim()) return;
    setLoading(true);
    const res = await fetch("/api/coach/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text }) });
    setLoading(false);
    if (res.ok) { setText(""); load(); } else { alert("Failed to send"); }
  }

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">Coach</h1>
      <div className="mt-6 rounded-lg border p-4">
        <div className="space-y-3">
          {messages.map(m => (
            <div key={m.id} className={`max-w-[80%] rounded-md p-2 text-sm ${m.sender==="user" ? "ml-auto bg-primary text-primary-foreground" : "bg-muted/40"}`}>
              <div>{m.text}</div>
              <div className="mt-1 text-[10px] opacity-70">{new Date(m.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <textarea className="min-h-[44px] flex-1 rounded-md border p-2" value={text} onChange={e=>setText(e.target.value)} placeholder="Type a message..." />
          <button disabled={loading} onClick={send} className="rounded-md bg-primary px-4 py-2 text-primary-foreground">{loading ? "Sending..." : "Send"}</button>
        </div>
      </div>
    </div>
  );
} 