"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import ProgressRing from "@/components/ui/ProgressRing";
import StoryVariantsPanel from "@/components/StoryVariantsPanel";

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

export default function IDEPage() {
  const params = useParams();
  const appId = params.id as string;
  
  const [application, setApplication] = useState<Application | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");
  const [tab, setTab] = useState<'draft' | 'outline' | 'analysis'>('draft');
  const [loading, setLoading] = useState(true);
  const [showAdapt, setShowAdapt] = useState(false);
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

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

  const selected = getQuestionById(selectedQuestionId || "");
  const selectedAnswer = getAnswerForQuestion(selectedQuestionId || "");
  const wc = content.split(/\s+/).filter(word => word.length > 0).length;

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl p-6">
        <div className="text-center">
          <div className="text-lg font-medium">Loading IDE...</div>
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

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{application.schools.name} - IDE</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span>Round {application.round}</span>
              <span>•</span>
              <span>Status: {application.status}</span>
            </div>
          </div>
        </div>
      </div>

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

        {/* Main Editor Area */}
        <div className="lg:col-span-2">
          {selected ? (
            <div className="space-y-4">
              {/* Tab Navigation */}
              <div className="flex space-x-1 bg-muted p-1 rounded-lg">
                <button
                  onClick={() => setTab('draft')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                    tab === 'draft'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Draft
                </button>
                <button
                  onClick={() => setTab('outline')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                    tab === 'outline'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Outline
                </button>
                <button
                  onClick={() => setTab('analysis')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition ${
                    tab === 'analysis'
                      ? 'bg-background text-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Analysis
                </button>
              </div>

              {/* Draft Tab */}
              {tab === 'draft' && (
                <div>
                  {/* Toolbar */}
                  <div className="mb-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ProgressRing value={Math.min(100, selected?.word_limit ? (wc/selected.word_limit)*100 : Math.min(100, wc/400)*100)} />
                      <span className="text-xs text-muted-foreground">Drafting…</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={()=>setShowAdapt(true)} className="rounded-md border px-3 py-1.5 text-sm">Adapt & Insert</button>
                    </div>
                  </div>

                  {/* Textarea */}
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start writing your essay..."
                    className="w-full h-96 rounded-lg border p-4 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  
                  <div className="mt-2 text-xs text-muted-foreground">
                    {wc} words {selected.word_limit && `• ${selected.word_limit - wc} remaining`}
                  </div>
                </div>
              )}

              {/* Outline Tab */}
              {tab === 'outline' && (
                <div className="rounded-lg border p-4">
                  <div className="text-sm text-muted-foreground">Outline view coming soon...</div>
                </div>
              )}

              {/* Analysis Tab */}
              {tab === 'analysis' && (
                <div className="rounded-lg border p-4">
                  <div className="text-sm text-muted-foreground">Analysis view coming soon...</div>
                </div>
              )}
            </div>
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

        {/* Right Sidebar */}
        <div className="lg:col-span-1">
          {selectedStoryId && (
            <StoryVariantsPanel storyId={selectedStoryId} applicationId={appId} />
          )}
        </div>
      </div>

      {/* Adapt Modal */}
      {showAdapt && (
        <AdaptModal 
          appId={appId} 
          onClose={() => setShowAdapt(false)} 
          onInsert={(txt) => {
            setContent(c => (c ? c + "\n\n" : "") + txt);
            setSelectedStoryId("story-id"); // This would be set to the actual story ID
          }} 
        />
      )}
    </div>
  );
}

// Adapt Modal Component
function AdaptModal({ appId, onClose, onInsert }:{ appId:string; onClose:()=>void; onInsert:(text:string)=>void }){
  const [stories, setStories] = useState<any[]>([]);
  const [storyId, setStoryId] = useState<string>("");
  const [tone, setTone] = useState<string>("balanced");
  const [focus, setFocus] = useState<string>("leadership,analytics,community");
  const [wl, setWl] = useState<string>("");

  useEffect(()=>{ fetch("/api/stories").then(r=>r.json()).then(setStories); },[]);

  async function adapt(){
    if(!storyId) return;
    const payload = {
      storyId, applicationId: appId,
      tone, focusTags: focus.split(",").map(s=>s.trim()).filter(Boolean),
      wordLimit: wl ? Number(wl) : null
    };
    const r = await fetch("/api/stories/adapt", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload) });
    if(!r.ok) return alert("Failed to adapt");
    const { variant } = await r.json();
    onInsert(variant.adapted_text);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4">
      <div className="w-full max-w-lg rounded-lg border bg-card p-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">Adapt story for this school</div>
          <button onClick={onClose} className="rounded-md border px-2 py-1 text-xs">Close</button>
        </div>
        <div className="mt-3 space-y-3">
          <div>
            <div className="text-xs text-muted-foreground">Select story</div>
            <select className="mt-1 w-full rounded-md border px-2 py-2 text-sm" value={storyId} onChange={e=>setStoryId(e.target.value)}>
              <option value="">— Choose —</option>
              {stories.map((s:any)=> <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-muted-foreground">Tone</div>
              <input className="mt-1 w-full rounded-md border px-2 py-2 text-sm" value={tone} onChange={e=>setTone(e.target.value)} placeholder="analytical / community / values"/>
            </div>
            <div>
              <div className="text-xs text-muted-foreground">Word limit (optional)</div>
              <input className="mt-1 w-full rounded-md border px-2 py-2 text-sm" value={wl} onChange={e=>setWl(e.target.value)} placeholder="e.g., 350"/>
            </div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Focus tags (comma separated)</div>
            <input className="mt-1 w-full rounded-md border px-2 py-2 text-sm" value={focus} onChange={e=>setFocus(e.target.value)} />
          </div>
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md border px-3 py-1.5 text-sm">Cancel</button>
          <button onClick={adapt} className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground">Adapt & Insert</button>
        </div>
      </div>
    </div>
  );
} 