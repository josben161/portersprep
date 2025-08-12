"use client";

import { CheckCircle, Circle, AlertCircle, Clock, Target, FileText, MessageSquare } from "lucide-react";

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

interface ApplicationProgressProps {
  questions: Question[];
  answers: Answer[];
  application: {
    status: string;
    round: string;
    schools: {
      name: string;
    };
  };
}

export default function ApplicationProgress({ questions, answers, application }: ApplicationProgressProps) {
  // Calculate progress metrics
  const totalQuestions = questions.length;
  const completedAnswers = answers.filter(a => a.word_count > 0).length;
  const progressPercentage = totalQuestions > 0 ? (completedAnswers / totalQuestions) * 100 : 0;
  
  // Calculate word count metrics
  const totalWords = answers.reduce((sum, a) => sum + a.word_count, 0);
  const totalWordLimit = questions.reduce((sum, q) => sum + (q.word_limit || 0), 0);
  
  // Determine overall status
  const getStatusColor = () => {
    if (progressPercentage >= 100) return "text-green-600";
    if (progressPercentage >= 75) return "text-blue-600";
    if (progressPercentage >= 50) return "text-amber-600";
    return "text-red-600";
  };

  const getStatusIcon = () => {
    if (progressPercentage >= 100) return <CheckCircle className="h-5 w-5 text-green-600" />;
    if (progressPercentage >= 75) return <Target className="h-5 w-5 text-blue-600" />;
    if (progressPercentage >= 50) return <Clock className="h-5 w-5 text-amber-600" />;
    return <AlertCircle className="h-5 w-5 text-red-600" />;
  };

  const getStatusText = () => {
    if (progressPercentage >= 100) return "Ready to Submit";
    if (progressPercentage >= 75) return "Almost Complete";
    if (progressPercentage >= 50) return "In Progress";
    return "Just Started";
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Application Progress</h3>
        </div>
        <div className={`flex items-center gap-2 ${getStatusColor()}`}>
          {getStatusIcon()}
          <span className="text-sm font-medium">{getStatusText()}</span>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-medium">Overall Completion</div>
          <div className="text-sm text-muted-foreground">
            {completedAnswers} of {totalQuestions} essays
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-3 mb-3">
          <div 
            className={`h-3 rounded-full transition-all ${
              progressPercentage >= 100 ? 'bg-green-500' :
              progressPercentage >= 75 ? 'bg-blue-500' :
              progressPercentage >= 50 ? 'bg-amber-500' : 'bg-red-500'
            }`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        
        <div className="text-2xl font-bold text-center">
          {Math.round(progressPercentage)}%
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-blue-600" />
            <div className="text-sm font-medium">Word Count</div>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            {totalWords.toLocaleString()}
          </div>
          {totalWordLimit > 0 && (
            <div className="text-xs text-muted-foreground">
              of {totalWordLimit.toLocaleString()} limit
            </div>
          )}
        </div>

        <div className="rounded-lg border bg-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="h-4 w-4 text-green-600" />
            <div className="text-sm font-medium">Essays Complete</div>
          </div>
          <div className="text-2xl font-bold text-green-600">
            {completedAnswers}
          </div>
          <div className="text-xs text-muted-foreground">
            of {totalQuestions} total
          </div>
        </div>
      </div>

      {/* Essay-by-Essay Progress */}
      <div className="rounded-lg border bg-card">
        <div className="p-4 border-b">
          <h4 className="font-medium">Essay Progress</h4>
        </div>
        <div className="p-4 space-y-3">
          {questions.map((question, index) => {
            const answer = answers.find(a => a.question_id === question.id);
            const isCompleted = answer && answer.word_count > 0;
            const hasAnalysis = answer && answer.rubric;
            
            return (
              <div key={question.id} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-muted-foreground" />
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-sm">
                      {question.metadata?.title || `Essay ${index + 1}`}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {question.word_limit ? `${question.word_limit} words` : "No limit"}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {isCompleted && (
                    <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      {answer?.word_count} words
                    </div>
                  )}
                  {hasAnalysis && (
                    <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                      Analyzed
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Submission Readiness */}
      {progressPercentage >= 100 && (
        <div className="rounded-lg border bg-green-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div className="font-medium text-green-900">Ready for Submission</div>
          </div>
          <div className="text-sm text-green-800">
            All essays are complete! Review your work one final time before submitting to {application.schools.name}.
          </div>
        </div>
      )}

      {/* Next Steps */}
      {progressPercentage < 100 && (
        <div className="rounded-lg border bg-blue-50 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-5 w-5 text-blue-600" />
            <div className="font-medium text-blue-900">Next Steps</div>
          </div>
          <div className="text-sm text-blue-800 space-y-1">
            <div>• {totalQuestions - completedAnswers} essay{totalQuestions - completedAnswers !== 1 ? 's' : ''} remaining</div>
            <div>• Focus on completing incomplete essays first</div>
            <div>• Run AI analysis on completed essays for feedback</div>
          </div>
        </div>
      )}
    </div>
  );
} 