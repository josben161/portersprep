"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

interface Story {
  id: string;
  title: string;
  summary: string;
  tags: string[];
  strength: number;
}

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

interface Application {
  id: string;
  school_id: string;
  status: string;
  round: string;
  schools: {
    name: string;
    slug: string;
  };
}

interface OutlineSection {
  title: string;
  bullets: string[];
}

interface Outline {
  sections: OutlineSection[];
}

export default function DesignTab({ 
  appId, 
  questions, 
  answers, 
  application 
}: { 
  appId: string; 
  questions: Question[]; 
  answers: Answer[]; 
  application: Application; 
}) {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [selectedStoryIds, setSelectedStoryIds] = useState<string[]>([]);
  const [outline, setOutline] = useState<Outline | null>(null);
  const [generatingOutline, setGeneratingOutline] = useState(false);
  const [generatingDraft, setGeneratingDraft] = useState(false);
  const [outlineVersion, setOutlineVersion] = useState<number | null>(null);

  useEffect(() => {
    loadStories();
    if (questions.length > 0 && !selectedQuestionId) {
      setSelectedQuestionId(questions[0].id);
    }
  }, [questions]);

  async function loadStories() {
    try {
      const res = await fetch("/api/stories");
      if (res.ok) {
        const data = await res.json();
        setStories(data);
      }
    } catch (error) {
      toast.error("Failed to load stories");
    }
  }

  function getAnswerForQuestion(questionId: string): Answer | null {
    return answers.find(a => a.question_id === questionId) || null;
  }

  function getQuestionById(questionId: string): Question | null {
    return questions.find(q => q.id === questionId) || null;
  }

  async function generateOutline() {
    if (!selectedQuestionId || selectedStoryIds.length === 0) {
      toast.error("Please select a question and at least one story");
      return;
    }

    const answer = getAnswerForQuestion(selectedQuestionId);
    if (!answer) {
      toast.error("No answer found for this question");
      return;
    }

    const question = getQuestionById(selectedQuestionId);
    if (!question) {
      toast.error("Question not found");
      return;
    }

    setGeneratingOutline(true);
    try {
      const res = await fetch(`/api/answers/${answer.id}/design`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          selectedStoryIds,
          wordLimit: question.word_limit,
          prompt: question.prompt
        })
      });

      if (res.ok) {
        const data = await res.json();
        setOutline(data.outline);
        setOutlineVersion(data.version);
        toast.success(`Outline generated (v${data.version})`);
      } else {
        throw new Error("Failed to generate outline");
      }
    } catch (error) {
      toast.error("Failed to generate outline");
    } finally {
      setGeneratingOutline(false);
    }
  }

  async function generateDraft() {
    if (!outline || !selectedQuestionId) {
      toast.error("Please generate an outline first");
      return;
    }

    const answer = getAnswerForQuestion(selectedQuestionId);
    if (!answer) {
      toast.error("No answer found for this question");
      return;
    }

    const question = getQuestionById(selectedQuestionId);
    if (!question) {
      toast.error("Question not found");
      return;
    }

    setGeneratingDraft(true);
    try {
      const res = await fetch(`/api/answers/${answer.id}/draft`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          outline,
          wordLimit: question.word_limit
        })
      });

      if (res.ok) {
        toast.success("Draft generated and saved to workspace");
        // Optionally redirect to workspace tab or refresh content
      } else {
        throw new Error("Failed to generate draft");
      }
    } catch (error) {
      toast.error("Failed to generate draft");
    } finally {
      setGeneratingDraft(false);
    }
  }

  function toggleStorySelection(storyId: string) {
    setSelectedStoryIds(prev => 
      prev.includes(storyId) 
        ? prev.filter(id => id !== storyId)
        : [...prev, storyId]
    );
  }

  const selectedQuestion = getQuestionById(selectedQuestionId || "");

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4">Essay Design</h2>
        <p className="text-muted-foreground">
          Select stories and generate outlines to plan your essays.
        </p>
      </div>

      {/* Question Selection */}
      <div className="rounded-lg border bg-card p-4">
        <h3 className="font-medium mb-3">Select Essay</h3>
        <div className="grid gap-2">
          {questions.map((question, index) => {
            const answer = getAnswerForQuestion(question.id);
            const isSelected = selectedQuestionId === question.id;
            
            return (
              <button
                key={question.id}
                onClick={() => setSelectedQuestionId(question.id)}
                className={`w-full text-left p-3 rounded-md border transition ${
                  isSelected 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:bg-muted"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">
                      {question.metadata?.title || `Essay ${index + 1}`}
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {question.word_limit ? `${question.word_limit} words` : "No limit"}
                    </div>
                  </div>
                  {answer && answer.word_count > 0 && (
                    <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                      {answer.word_count} words
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {selectedQuestion && (
        <>
          {/* Story Selection */}
          <div className="rounded-lg border bg-card p-4">
            <h3 className="font-medium mb-3">Select Stories</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {stories.map(story => {
                const isSelected = selectedStoryIds.includes(story.id);
                return (
                  <div
                    key={story.id}
                    onClick={() => toggleStorySelection(story.id)}
                    className={`p-3 rounded-md border cursor-pointer transition ${
                      isSelected 
                        ? "border-primary bg-primary/5" 
                        : "border-border hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{story.title}</div>
                        <div className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {story.summary}
                        </div>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {story.tags.map(tag => (
                            <span key={tag} className="text-[10px] bg-secondary px-2 py-0.5 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground ml-2">
                        {story.strength}/5
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            {stories.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-sm">No stories found</div>
                <a href="/dashboard/stories" className="text-primary hover:underline text-sm">
                  Create your first story
                </a>
              </div>
            )}
          </div>

          {/* Outline Generation */}
          <div className="rounded-lg border bg-card p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Essay Outline</h3>
              <button
                onClick={generateOutline}
                disabled={generatingOutline || selectedStoryIds.length === 0}
                className="rounded-md bg-primary px-3 py-1 text-xs text-primary-foreground hover:opacity-95 disabled:pointer-events-none disabled:opacity-50"
              >
                {generatingOutline ? "Generating..." : "Generate Outline"}
              </button>
            </div>
            
            {outline && (
              <div className="space-y-4">
                <div className="text-xs text-muted-foreground">
                  Version {outlineVersion} • {selectedStoryIds.length} stories selected
                </div>
                <div className="space-y-3">
                  {outline.sections.map((section, index) => (
                    <div key={index} className="border-l-2 border-primary/20 pl-4">
                      <div className="font-medium text-sm mb-2">{section.title}</div>
                      <ul className="space-y-1">
                        {section.bullets.map((bullet, bulletIndex) => (
                          <li key={bulletIndex} className="text-sm text-muted-foreground">
                            • {bullet}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                
                <button
                  onClick={generateDraft}
                  disabled={generatingDraft}
                  className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:opacity-95 disabled:pointer-events-none disabled:opacity-50"
                >
                  {generatingDraft ? "Generating Draft..." : "Generate Coaching Draft"}
                </button>
              </div>
            )}
            
            {!outline && (
              <div className="text-center py-8 text-muted-foreground">
                <div className="text-sm">Select stories and generate an outline to get started</div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
} 