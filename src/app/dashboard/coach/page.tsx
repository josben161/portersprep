"use client";
import { useState } from "react";
import Link from "next/link";

export default function CoachPage() {
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);

  async function askQuestion() {
    if (!question.trim()) return;
    
    setLoading(true);
    try {
      const r = await fetch("/api/coach/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim() })
      });
      
      if (r.ok) {
        const data = await r.json();
        setResponse(data.response);
      } else {
        setResponse("Sorry, I couldn't process your question right now. Please try again.");
      }
    } catch (error) {
      setResponse("Sorry, there was an error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">AI Coach</h1>
          <p className="text-sm text-muted-foreground">Ask anything about your MBA application journey.</p>
        </div>
        <Link href="/dashboard" className="btn btn-outline text-xs">Back to Dashboard</Link>
      </div>

      <div className="rounded-md border p-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Your Question</label>
            <textarea
              className="w-full rounded-md border p-3 text-sm min-h-[100px]"
              placeholder="Ask about essay strategies, school selection, timeline planning, or anything else..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              disabled={loading}
            />
          </div>
          
          <button
            className="btn btn-primary"
            onClick={askQuestion}
            disabled={loading || !question.trim()}
          >
            {loading ? "Thinking..." : "Ask Coach"}
          </button>
        </div>
      </div>

      {response && (
        <div className="rounded-md border p-4">
          <div className="text-sm font-medium mb-2">Coach's Response</div>
          <div className="text-sm whitespace-pre-wrap">{response}</div>
        </div>
      )}

      <div className="rounded-md border p-4">
        <div className="text-sm font-medium mb-3">Suggested Questions</div>
        <div className="grid gap-2 text-sm">
          {[
            "How should I structure my career goals essay?",
            "What makes a strong letter of recommendation?",
            "How do I choose between different MBA programs?",
            "What's the ideal timeline for my application?",
            "How can I improve my GMAT score?",
            "What should I include in my resume for MBA applications?"
          ].map((suggestion, index) => (
            <button
              key={index}
              className="text-left p-2 rounded hover:bg-muted transition-colors"
              onClick={() => setQuestion(suggestion)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 