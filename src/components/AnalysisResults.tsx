"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Target,
  MessageSquare,
  Lightbulb,
  AlertTriangle,
} from "lucide-react";

interface AnalysisData {
  rubric?: {
    school_focus?: {
      hits: string[];
      misses: string[];
      score: number;
    };
    narrative?: {
      cohesion: number;
      gaps: string[];
      notes: string[];
    };
  };
  sentences?: Array<{
    idx: number;
    text: string;
    tags: string[];
    needs_evidence: boolean;
    suggestions: Array<{
      type: string;
      text: string;
    }>;
  }>;
}

interface AnalysisResultsProps {
  analysis: AnalysisData;
  onClose?: () => void;
}

export default function AnalysisResults({
  analysis,
  onClose,
}: AnalysisResultsProps) {
  const [expandedSections, setExpandedSections] = useState({
    schoolFocus: true,
    narrative: true,
    sentences: false,
  });

  function toggleSection(section: keyof typeof expandedSections) {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  }

  function getScoreColor(score: number): string {
    if (score >= 4) return "text-green-600";
    if (score >= 3) return "text-amber-600";
    return "text-red-600";
  }

  function getScoreBackground(score: number): string {
    if (score >= 4) return "bg-green-100";
    if (score >= 3) return "bg-amber-100";
    return "bg-red-100";
  }

  function getScoreLabel(score: number): string {
    if (score >= 4) return "Excellent";
    if (score >= 3) return "Good";
    if (score >= 2) return "Fair";
    return "Needs Work";
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">AI Analysis Results</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ×
          </button>
        )}
      </div>

      {/* School Focus Section */}
      {analysis.rubric?.school_focus && (
        <div className="rounded-lg border bg-card">
          <button
            onClick={() => toggleSection("schoolFocus")}
            className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <div className="font-medium">School Focus</div>
                <div className="text-sm text-muted-foreground">
                  How well your essay aligns with the school&apos;s values
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(analysis.rubric.school_focus.score)} ${getScoreColor(analysis.rubric.school_focus.score)}`}
              >
                {analysis.rubric.school_focus.score}/5 -{" "}
                {getScoreLabel(analysis.rubric.school_focus.score)}
              </div>
              {expandedSections.schoolFocus ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          </button>

          {expandedSections.schoolFocus && (
            <div className="px-4 pb-4 space-y-4">
              {/* Score Visualization */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Score</span>
                    <span>{analysis.rubric.school_focus.score}/5</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        analysis.rubric.school_focus.score >= 4
                          ? "bg-green-500"
                          : analysis.rubric.school_focus.score >= 3
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                      style={{
                        width: `${(analysis.rubric.school_focus.score / 5) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Hits and Misses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                    <div className="font-medium text-green-700">Strengths</div>
                  </div>
                  <ul className="space-y-2">
                    {analysis.rubric.school_focus.hits?.map((hit, i) => (
                      <li
                        key={i}
                        className="text-sm text-green-700 bg-green-50 p-2 rounded"
                      >
                        • {hit}
                      </li>
                    ))}
                    {(!analysis.rubric.school_focus.hits ||
                      analysis.rubric.school_focus.hits.length === 0) && (
                      <li className="text-sm text-muted-foreground italic">
                        No specific strengths identified
                      </li>
                    )}
                  </ul>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="h-4 w-4 text-red-600" />
                    <div className="font-medium text-red-700">
                      Areas to Improve
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {analysis.rubric.school_focus.misses?.map((miss, i) => (
                      <li
                        key={i}
                        className="text-sm text-red-700 bg-red-50 p-2 rounded"
                      >
                        • {miss}
                      </li>
                    ))}
                    {(!analysis.rubric.school_focus.misses ||
                      analysis.rubric.school_focus.misses.length === 0) && (
                      <li className="text-sm text-muted-foreground italic">
                        No major areas for improvement
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Narrative Cohesion Section */}
      {analysis.rubric?.narrative && (
        <div className="rounded-lg border bg-card">
          <button
            onClick={() => toggleSection("narrative")}
            className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <MessageSquare className="h-5 w-5 text-purple-600" />
              <div>
                <div className="font-medium">Narrative Cohesion</div>
                <div className="text-sm text-muted-foreground">
                  How well your story flows and connects
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreBackground(analysis.rubric.narrative.cohesion)} ${getScoreColor(analysis.rubric.narrative.cohesion)}`}
              >
                {analysis.rubric.narrative.cohesion}/5 -{" "}
                {getScoreLabel(analysis.rubric.narrative.cohesion)}
              </div>
              {expandedSections.narrative ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          </button>

          {expandedSections.narrative && (
            <div className="px-4 pb-4 space-y-4">
              {/* Score Visualization */}
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Cohesion</span>
                    <span>{analysis.rubric.narrative.cohesion}/5</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        analysis.rubric.narrative.cohesion >= 4
                          ? "bg-green-500"
                          : analysis.rubric.narrative.cohesion >= 3
                            ? "bg-amber-500"
                            : "bg-red-500"
                      }`}
                      style={{
                        width: `${(analysis.rubric.narrative.cohesion / 5) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Gaps and Notes */}
              {analysis.rubric.narrative.gaps?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-amber-600" />
                    <div className="font-medium text-amber-700">
                      Narrative Gaps
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {analysis.rubric.narrative.gaps.map((gap, i) => (
                      <li
                        key={i}
                        className="text-sm text-amber-700 bg-amber-50 p-2 rounded"
                      >
                        • {gap}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {analysis.rubric.narrative.notes?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Lightbulb className="h-4 w-4 text-blue-600" />
                    <div className="font-medium text-blue-700">Suggestions</div>
                  </div>
                  <ul className="space-y-2">
                    {analysis.rubric.narrative.notes.map((note, i) => (
                      <li
                        key={i}
                        className="text-sm text-blue-700 bg-blue-50 p-2 rounded"
                      >
                        • {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Sentence Enhancements Section */}
      {analysis.sentences && analysis.sentences.length > 0 && (
        <div className="rounded-lg border bg-card">
          <button
            onClick={() => toggleSection("sentences")}
            className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Lightbulb className="h-5 w-5 text-green-600" />
              <div>
                <div className="font-medium">Sentence Enhancements</div>
                <div className="text-sm text-muted-foreground">
                  Specific suggestions to improve your writing
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700">
                {analysis.sentences.length} suggestions
              </div>
              {expandedSections.sentences ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </div>
          </button>

          {expandedSections.sentences && (
            <div className="px-4 pb-4 space-y-3">
              {analysis.sentences.slice(0, 5).map((sentence, i) => (
                <div key={i} className="p-3 bg-muted/30 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-sm font-medium">
                      Sentence {sentence.idx + 1}
                    </div>
                    <div className="flex gap-1">
                      {sentence.tags?.map((tag, j) => (
                        <span
                          key={j}
                          className="px-2 py-1 bg-primary/10 text-primary text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                      {sentence.needs_evidence && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                          Needs Evidence
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm italic text-muted-foreground mb-2">
                    &quot;{sentence.text}&quot;
                  </div>
                  {sentence.suggestions?.length > 0 && (
                    <div>
                      <div className="text-xs font-medium text-muted-foreground mb-1">
                        Suggestions:
                      </div>
                      <ul className="space-y-1">
                        {sentence.suggestions
                          .slice(0, 2)
                          .map((suggestion, j) => (
                            <li
                              key={j}
                              className="text-xs text-muted-foreground bg-background p-2 rounded"
                            >
                              • {suggestion.text}
                            </li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 p-4">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="h-5 w-5 text-blue-600" />
          <div className="font-medium text-blue-900">Next Steps</div>
        </div>
        <div className="text-sm text-blue-800 space-y-1">
          <div>• Review the areas for improvement above</div>
          <div>• Consider the sentence-level suggestions</div>
          <div>• Revise your essay and run another analysis</div>
        </div>
      </div>
    </div>
  );
}
