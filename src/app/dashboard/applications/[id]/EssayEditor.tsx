"use client";

import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";
import AnalysisResults from "@/components/AnalysisResults";

interface Question {
  id: string;
  prompt: string;
  archetype: string;
  word_limit: number | null;
  metadata: any;
}

interface Answer {
  id: string;
  question_id: string;
  word_count: number;
  rubric: any;
}

interface EssayEditorProps {
  appId: string;
  question: Question;
  answer: Answer | null;
  onSave: () => void;
}

export default function EssayEditor({
  appId,
  question,
  answer,
}: EssayEditorProps) {
  const [content, setContent] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const saveTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadContent();
  }, [answer?.id]);

  useEffect(() => {
    // Auto-save on content change
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
    }

    if (content.trim()) {
      saveTimer.current = setTimeout(() => {
        saveContent();
      }, 1000);
    }

    return () => {
      if (saveTimer.current) {
        clearTimeout(saveTimer.current);
      }
    };
  }, [content]);

  function countWords(text: string): number {
    return text
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;
  }

  async function loadContent() {
    if (!answer?.id) {
      setContent("");
      setWordCount(0);
      return;
    }

    try {
      const res = await fetch(`/api/answers/${answer.id}/content`);
      if (res.ok) {
        const text = await res.text();
        setContent(text);
        setWordCount(countWords(text));
      }
    } catch (error) {
      console.error("Failed to load content:", error);
    }
  }

  async function saveContent() {
    if (!answer?.id || !content.trim()) return;

    setSaving(true);
    try {
      const res = await fetch(`/api/answers/${answer.id}/content`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: content }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setWordCount(countWords(content));
      toast.success("Saved");
    } catch (error) {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function runAnalysis() {
    if (!answer?.id || !content.trim()) {
      toast.error("Please write some content first");
      return;
    }

    setAnalyzing(true);
    try {
      const res = await fetch(`/api/answers/${answer.id}/analyze`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Analysis failed");

      const data = await res.json();
      setAnalysis(data);
      toast.success("Analysis complete!");
    } catch (error) {
      toast.error("Analysis failed");
    } finally {
      setAnalyzing(false);
    }
  }

  const isOverLimit = question.word_limit && wordCount > question.word_limit;
  const isNearLimit =
    question.word_limit && wordCount > question.word_limit * 0.9;

  return (
    <div className="space-y-4">
      {/* Question Header */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-medium">
              {question.metadata?.title || "Essay"}
            </h3>
            <div className="mt-1 text-sm text-muted-foreground">
              {question.word_limit
                ? `${question.word_limit} words`
                : "No word limit"}
            </div>
          </div>
          <div className="text-right">
            <div
              className={`text-sm font-medium ${
                isOverLimit
                  ? "text-red-600"
                  : isNearLimit
                    ? "text-amber-600"
                    : "text-muted-foreground"
              }`}
            >
              {wordCount} words
            </div>
            {question.word_limit && (
              <div className="text-xs text-muted-foreground">
                {Math.max(0, question.word_limit - wordCount)} remaining
              </div>
            )}
          </div>
        </div>
        <div className="mt-3 p-3 bg-muted/30 rounded-md">
          <div className="text-sm font-medium mb-1">Prompt:</div>
          <div className="text-sm leading-relaxed">{question.prompt}</div>
        </div>
      </div>

      {/* Editor */}
      <div className="rounded-lg border bg-card">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="text-sm font-medium">Your Response</div>
          <div className="flex items-center gap-2">
            {saving && (
              <div className="text-xs text-muted-foreground">Saving...</div>
            )}
            <button
              onClick={runAnalysis}
              disabled={analyzing || !content.trim()}
              className="rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground hover:opacity-95 disabled:pointer-events-none disabled:opacity-50"
            >
              {analyzing ? "Analyzing..." : "AI Analysis"}
            </button>
          </div>
        </div>
        <div className="p-4">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing your essay here..."
            className="w-full h-96 resize-none border-0 focus:outline-none focus:ring-0 text-sm leading-relaxed"
            style={{ fontFamily: "inherit" }}
          />
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <AnalysisResults
          analysis={analysis}
          onClose={() => setAnalysis(null)}
        />
      )}
    </div>
  );
}
