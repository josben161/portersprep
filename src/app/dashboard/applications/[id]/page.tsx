"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import EssayEditor from "./EssayEditor";
import ApplicationProgress from "@/components/ApplicationProgress";
import DesignTab from "./DesignTab";

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

export default function ApplicationWorkspace() {
  const params = useParams();
  const appId = params.id as string;
  
  const [application, setApplication] = useState<Application | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'workspace' | 'progress' | 'design'>('workspace');
  const [loading, setLoading] = useState(true);

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

      // Load questions
      const questionsRes = await fetch(`/api/schools/${appData.schools.slug}/questions`);
      if (!questionsRes.ok) throw new Error("Failed to load questions");
      const questionsData = await questionsRes.json();
      setQuestions(questionsData);

      // Load answers
      const answersRes = await fetch(`/api/applications/${appId}/answers`);
      if (answersRes.ok) {
        const answersData = await answersRes.json();
        setAnswers(answersData);
        
        // Select first question if none selected
        if (questionsData.length > 0 && !selectedQuestionId) {
          setSelectedQuestionId(questionsData[0].id);
        }
      }
    } catch (error) {
      toast.error("Failed to load application data");
    } finally {
      setLoading(false);
    }
  }

  function getAnswerForQuestion(questionId: string): Answer | null {
    return answers.find(a => a.question_id === questionId) || null;
  }

  function getQuestionById(questionId: string): Question | null {
    return questions.find(q => q.id === questionId) || null;
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <div className="text-center">
          <div className="text-lg font-medium">Loading application...</div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <div className="text-center">
          <div className="text-lg font-medium">Application not found</div>
        </div>
      </div>
    );
  }

  const selectedQuestion = getQuestionById(selectedQuestionId || "");
  const selectedAnswer = getAnswerForQuestion(selectedQuestionId || "");

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{application.schools.name}</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span>Round {application.round}</span>
              <span>•</span>
              <span>Status: {application.status}</span>
            </div>
          </div>
          <a 
            href={`/dashboard/applications/${appId}/requirements`}
            className="rounded-md border px-3 py-1 text-sm hover:bg-muted"
          >
            View Requirements
          </a>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex space-x-1 bg-muted p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('workspace')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              activeTab === 'workspace'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Workspace
          </button>
          <button
            onClick={() => setActiveTab('design')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              activeTab === 'design'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Design
          </button>
          <button
            onClick={() => setActiveTab('progress')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
              activeTab === 'progress'
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            Progress
          </button>
        </div>
      </div>

      {activeTab === 'workspace' ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Questions Sidebar */}
          <div className="lg:col-span-1">
            <div className="rounded-lg border bg-card">
              <div className="p-4 border-b">
                <h2 className="font-medium">Essays</h2>
              </div>
              <div className="p-2">
                {questions.map((question, index) => {
                  const answer = getAnswerForQuestion(question.id);
                  const isSelected = selectedQuestionId === question.id;
                  const hasContent = answer && answer.word_count > 0;
                  
                  return (
                    <button
                      key={question.id}
                      onClick={() => setSelectedQuestionId(question.id)}
                      className={`w-full text-left p-3 rounded-md mb-1 transition ${
                        isSelected 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-muted"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">
                            {question.metadata?.title || `Essay ${index + 1}`}
                          </div>
                          <div className="text-xs opacity-70 mt-1">
                            {question.word_limit ? `${question.word_limit} words` : "No limit"}
                          </div>
                        </div>
                        {hasContent && (
                          <div className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full ml-2">
                            {answer.word_count} words
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Essay Editor */}
          <div className="lg:col-span-3">
            {selectedQuestion ? (
              <EssayEditor
                appId={appId}
                question={selectedQuestion}
                answer={selectedAnswer}
                onSave={() => loadApplicationData()}
              />
            ) : (
              <div className="rounded-lg border bg-card p-8 text-center">
                <div className="text-lg font-medium text-muted-foreground mb-2">
                  Select an essay to start writing
                </div>
                <div className="text-sm text-muted-foreground">
                  Choose an essay from the sidebar to begin drafting your response.
                </div>
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'progress' ? (
        <div className="max-w-4xl">
          <ApplicationProgress
            questions={questions}
            answers={answers}
            application={application}
          />
        </div>
      ) : (
        <div className="max-w-4xl">
          <DesignTab
            appId={appId}
            questions={questions}
            answers={answers}
            application={application}
          />
        </div>
      )}
    </div>
  );
} 