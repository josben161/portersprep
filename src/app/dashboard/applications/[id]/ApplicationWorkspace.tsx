"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface School {
  id: string;
  name: string;
  essays: Array<{
    type: string;
    title: string;
    prompt: string;
    word_limit: number | null;
  }>;
  lor: { count: number; format: string } | null;
  video_assessment: { provider: string; notes?: string } | null;
}

interface Application {
  id: string;
  school_id: string;
  status: string;
  round: number;
  schools: {
    name: string;
    slug: string;
  };
}

interface Answer {
  id: string;
  question_id: string;
  content: string;
  word_count: number;
  analysis?: any;
}

export default function ApplicationWorkspace({ appId }: { appId: string }) {
  const [application, setApplication] = useState<Application | null>(null);
  const [school, setSchool] = useState<School | null>(null);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<Record<string, boolean>>({});
  const [analyzing, setAnalyzing] = useState<Record<string, boolean>>({});

  useEffect(() => {
    loadApplicationData();
  }, [appId]);

  async function loadApplicationData() {
    try {
      // Load application
      const appRes = await fetch(`/api/applications/${appId}`);
      if (!appRes.ok) throw new Error("Failed to load application");
      const appData = await appRes.json();
      setApplication(appData);

      // Load school data through API
      if (appData.schools?.slug) {
        const schoolRes = await fetch(`/api/schools/${appData.schools.slug}`);
        if (schoolRes.ok) {
          const schoolData = await schoolRes.json();
          setSchool(schoolData);
        }
      }

      // Load existing answers
      const answersRes = await fetch(`/api/applications/${appId}/answers`);
      if (answersRes.ok) {
        const answersData = await answersRes.json();
        const answersMap: Record<string, Answer> = {};
        answersData.forEach((answer: any) => {
          answersMap[answer.question_id] = answer;
        });
        setAnswers(answersMap);
      }
    } catch (error) {
      console.error("Failed to load application data:", error);
      toast.error("Failed to load application data");
    } finally {
      setLoading(false);
    }
  }

  async function saveAnswer(essayIndex: number, content: string) {
    if (!school || !application) return;

    const essay = school.essays[essayIndex];
    const questionId = `essay_${essayIndex}`;
    
    setSaving(prev => ({ ...prev, [questionId]: true }));
    
    try {
      const response = await fetch(`/api/applications/${appId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question_id: questionId,
          content,
          word_limit: essay.word_limit
        })
      });

      if (response.ok) {
        const savedAnswer = await response.json();
        setAnswers(prev => ({
          ...prev,
          [questionId]: savedAnswer
        }));
        toast.success("Saved");
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      console.error("Failed to save answer:", error);
      toast.error("Failed to save");
    } finally {
      setSaving(prev => ({ ...prev, [questionId]: false }));
    }
  }

  async function analyzeAnswer(essayIndex: number) {
    if (!school || !application) return;

    const essay = school.essays[essayIndex];
    const questionId = `essay_${essayIndex}`;
    const answer = answers[questionId];
    
    if (!answer?.content) {
      toast.error("No content to analyze");
      return;
    }

    setAnalyzing(prev => ({ ...prev, [questionId]: true }));
    
    try {
      const response = await fetch(`/api/analysis/essay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: answer.content,
          school_name: school.name,
          essay_title: essay.title,
          essay_prompt: essay.prompt,
          word_limit: essay.word_limit
        })
      });

      if (response.ok) {
        const analysis = await response.json();
        setAnswers(prev => ({
          ...prev,
          [questionId]: { ...prev[questionId], analysis }
        }));
        toast.success("Analysis complete");
      } else {
        throw new Error("Failed to analyze");
      }
    } catch (error) {
      console.error("Failed to analyze answer:", error);
      toast.error("Failed to analyze");
    } finally {
      setAnalyzing(prev => ({ ...prev, [questionId]: false }));
    }
  }

  function countWords(text: string): number {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!application || !school) {
    return (
      <div className="text-center py-8">
        <div className="text-lg font-medium text-muted-foreground">
          Application or school data not found
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-2xl font-semibold">{school.name}</h1>
        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
          <span>Round {application.round}</span>
          <span>•</span>
          <span>Status: {application.status}</span>
          <span>•</span>
          <span>{school.essays.length} essays required</span>
        </div>
      </div>

      {/* Essays */}
      <div className="space-y-8">
        {school.essays.map((essay, index) => {
          const questionId = `essay_${index}`;
          const answer = answers[questionId];
          const content = answer?.content || "";
          const wordCount = countWords(content);
          const isSaving = saving[questionId];
          const isAnalyzing = analyzing[questionId];

          return (
            <div key={index} className="border rounded-lg p-6">
              <div className="mb-4">
                <h3 className="text-lg font-medium mb-2">{essay.title}</h3>
                <p className="text-sm text-muted-foreground mb-3">{essay.prompt}</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">
                    {essay.word_limit ? `${wordCount}/${essay.word_limit} words` : `${wordCount} words`}
                  </span>
                  {essay.word_limit && (
                    <div className={`px-2 py-1 rounded text-xs ${
                      wordCount > essay.word_limit 
                        ? 'bg-red-100 text-red-800' 
                        : wordCount >= essay.word_limit * 0.8 
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {wordCount > essay.word_limit ? 'Over limit' : 
                       wordCount >= essay.word_limit * 0.8 ? 'Good length' : 'Too short'}
                    </div>
                  )}
                </div>
              </div>

              {/* Text Editor */}
              <div className="mb-4">
                <textarea
                  value={content}
                  onChange={(e) => {
                    const newContent = e.target.value;
                    setAnswers(prev => ({
                      ...prev,
                      [questionId]: { 
                        ...prev[questionId], 
                        content: newContent,
                        word_count: countWords(newContent)
                      }
                    }));
                  }}
                  onBlur={() => saveAnswer(index, content)}
                  placeholder="Start writing your essay here..."
                  className="w-full h-48 p-4 border rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => saveAnswer(index, content)}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {isSaving ? "Saving..." : "Save"}
                </button>
                
                <button
                  onClick={() => analyzeAnswer(index)}
                  disabled={isAnalyzing || !content.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze"}
                </button>
              </div>

              {/* Analysis Results */}
              {answer?.analysis && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Analysis Results</h4>
                  <div className="text-sm space-y-2">
                    {answer.analysis.score && (
                      <div>Score: {answer.analysis.score}/10</div>
                    )}
                    {answer.analysis.feedback && (
                      <div>Feedback: {answer.analysis.feedback}</div>
                    )}
                    {answer.analysis.suggestions && (
                      <div>Suggestions: {answer.analysis.suggestions}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Additional Requirements */}
      <div className="border rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Additional Requirements</h3>
        <div className="space-y-3 text-sm">
          {school.lor && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Letters of Recommendation: {school.lor.count} required ({school.lor.format})</span>
            </div>
          )}
          {school.video_assessment && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <span>Video Assessment: {school.video_assessment.provider}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 