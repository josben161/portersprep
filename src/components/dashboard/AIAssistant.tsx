"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ChevronRight, Clock, CheckCircle, AlertCircle, Target, TrendingUp, Award, AlertTriangle, User, Info } from "lucide-react";
import { AIInsightsEngine, type AIInsight } from "@/lib/aiInsights";

interface Application {
  id: string;
  school_id: string;
  status: string;
  round: number;
  schools: {
    name: string;
  };
}

interface Essay {
  id: string;
  application_id: string;
  status: string;
  word_count?: number;
  word_limit?: number;
}

interface Assignment {
  id: string;
  status: 'pending' | 'requested' | 'in_progress' | 'completed' | 'declined';
  due_date?: string;
  applications: {
    id: string;
    schools: {
      name: string;
    };
  };
}



export default function AIAssistant() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [essays, setEssays] = useState<Essay[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Load applications
      const appsRes = await fetch("/api/applications");
      if (appsRes.ok) {
        const appsData = await appsRes.json();
        setApplications(appsData);
      }

      // Load essays across all applications
      const essaysData = [];
      if (appsRes.ok) {
        const apps = await appsRes.json();
        for (const app of apps) {
          const essaysRes = await fetch(`/api/applications/${app.id}/answers`);
          if (essaysRes.ok) {
            const appEssays = await essaysRes.json();
            essaysData.push(...appEssays.map((e: any) => ({
              ...e,
              application_id: app.id
            })));
          }
        }
      }
      setEssays(essaysData);

      // Load recommendations
      const assignmentsData = [];
      if (appsRes.ok) {
        const apps = await appsRes.json();
        for (const app of apps) {
          const assignmentsRes = await fetch(`/api/applications/${app.id}/recommendations`);
          if (assignmentsRes.ok) {
            const data = await assignmentsRes.json();
            assignmentsData.push(...data.assignments.map((a: any) => ({
              ...a,
              applications: app
            })));
          }
        }
      }
      setAssignments(assignmentsData);

      // Load profile data
      const profileRes = await fetch("/api/profile");
      const profileData = profileRes.ok ? await profileRes.json() : {};

      // Generate AI insights using the engine
      const insightsEngine = new AIInsightsEngine(
        applications,
        essaysData,
        assignmentsData,
        profileData
      );
      const generatedInsights = await insightsEngine.generateAIInsights();
      setInsights(generatedInsights);
    } catch (error) {
      console.error("Failed to load data for AI assistant:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleActionClick(href: string) {
    router.push(href);
  }

  function getUrgencyColor(urgency: string) {
    switch (urgency) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-green-500 bg-green-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  }

  function getIconComponent(iconName: string) {
    switch (iconName) {
      case 'trending-up': return <TrendingUp className="w-4 h-4" />;
      case 'target': return <Target className="w-4 h-4" />;
      case 'clock': return <Clock className="w-4 h-4" />;
      case 'check-circle': return <CheckCircle className="w-4 h-4" />;
      case 'alert-circle': return <AlertCircle className="w-4 h-4" />;
      case 'alert-triangle': return <AlertTriangle className="w-4 h-4" />;
      case 'award': return <Award className="w-4 h-4" />;
      case 'user': return <User className="w-4 h-4" />;
      case 'info': return <Info className="w-4 h-4" />;
      default: return <Sparkles className="w-4 h-4" />;
    }
  }

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
        <div className="animate-pulse">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-blue-200 rounded-full"></div>
            <div className="h-6 bg-blue-200 rounded w-1/3"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-blue-200 rounded w-2/3"></div>
            <div className="h-4 bg-blue-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  const topInsight = insights[0];
  const remainingInsights = insights.slice(1);

  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">AI Assistant</h3>
            <p className="text-sm text-gray-600">Your personalized MBA application guide</p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
        >
          {expanded ? 'Show less' : 'Show more'}
          <ChevronRight className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* Primary Insight */}
      {topInsight && (
        <div className={`border-l-4 p-4 rounded-r-lg mb-4 ${getUrgencyColor(topInsight.urgency)}`}>
                     <div className="flex items-start gap-3">
             <div className="text-blue-600 mt-0.5">
               {getIconComponent(topInsight.icon)}
             </div>
            <div className="flex-1">
              <h4 className="font-medium text-gray-900 mb-1">{topInsight.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{topInsight.description}</p>
              {topInsight.action && (
                <button
                  onClick={() => handleActionClick(topInsight.action!.href)}
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {topInsight.action.label}
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Additional Insights (when expanded) */}
      {expanded && remainingInsights.length > 0 && (
        <div className="space-y-3">
          {remainingInsights.map((insight, index) => (
            <div key={index} className={`border-l-4 p-3 rounded-r-lg ${getUrgencyColor(insight.urgency)}`}>
                             <div className="flex items-start gap-3">
                 <div className="text-blue-600 mt-0.5">
                   {getIconComponent(insight.icon)}
                 </div>
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900 text-sm mb-1">{insight.title}</h4>
                  <p className="text-xs text-gray-600 mb-2">{insight.description}</p>
                  {insight.action && (
                    <button
                      onClick={() => handleActionClick(insight.action!.href)}
                      className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      {insight.action.label}
                      <ChevronRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Progress Summary */}
      {!expanded && insights.length > 1 && (
        <div className="text-center pt-3 border-t border-blue-200">
          <p className="text-xs text-gray-600">
            +{insights.length - 1} more insight{insights.length > 2 ? 's' : ''} available
          </p>
        </div>
      )}
    </div>
  );
} 