"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle, Clock, AlertCircle, TrendingUp } from "lucide-react";

interface Application {
  id: string;
  status: string;
  progress?: number;
  school: {
    id: string;
    name: string;
  };
}

interface Essay {
  id: string;
  application_id: string;
  status: string;
}

function StatusChip({ status }: { status: string }) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "planning":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200";
      case "in_progress":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-200";
      case "submitted":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-200";
      case "accepted":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-200";
      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-200";
      default:
        return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-200";
    }
  };

  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${getStatusColor(status)}`}>
      {status.replace('_', ' ')}
    </span>
  );
}

function ProgressBar({ progress }: { progress: number }) {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(progress)}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

export default function ApplicationsGrid() {
  const [apps, setApps] = useState<Application[]>([]);
  const [essays, setEssays] = useState<Essay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApps() {
      try {
        const r = await fetch("/api/applications");
        if (r.ok) {
          const data = await r.json();
          setApps(data);
          
          // Load essays for progress calculation
          const essaysData = [];
          for (const app of data) {
            const essaysRes = await fetch(`/api/applications/${app.id}/answers`);
            if (essaysRes.ok) {
              const appEssays = await essaysRes.json();
              essaysData.push(...appEssays.map((e: any) => ({
                ...e,
                application_id: app.id
              })));
            }
          }
          setEssays(essaysData);
        }
      } catch (error) {
        console.error("Failed to load applications:", error);
      } finally {
        setLoading(false);
      }
    }
    loadApps();
  }, []);

  function getApplicationProgress(appId: string) {
    const appEssays = essays.filter(e => e.application_id === appId);
    if (appEssays.length === 0) return 0;
    
    const completed = appEssays.filter(e => e.status === 'completed').length;
    return Math.round((completed / appEssays.length) * 100);
  }

  function getApplicationInsight(app: Application) {
    const progress = getApplicationProgress(app.id);
    const appEssays = essays.filter(e => e.application_id === app.id);
    const completedEssays = appEssays.filter(e => e.status === 'completed').length;
    const totalEssays = appEssays.length;

    if (app.status === 'planning') {
      return {
        icon: <Clock className="w-4 h-4 text-blue-600" />,
        text: "Ready to start",
        color: "text-blue-600"
      };
    }

    if (progress === 0 && totalEssays > 0) {
      return {
        icon: <AlertCircle className="w-4 h-4 text-yellow-600" />,
        text: `${totalEssays} essay${totalEssays > 1 ? 's' : ''} to start`,
        color: "text-yellow-600"
      };
    }

    if (progress === 100) {
      return {
        icon: <CheckCircle className="w-4 h-4 text-green-600" />,
        text: "All essays complete",
        color: "text-green-600"
      };
    }

    return {
      icon: <TrendingUp className="w-4 h-4 text-amber-600" />,
      text: `${completedEssays}/${totalEssays} essays done`,
      color: "text-amber-600"
    };
  }

  if (loading) {
    return (
      <section className="card p-4">
        <div className="text-xs text-muted-foreground mb-3">Applications</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs text-muted-foreground">Applications</div>
          <h3 className="text-base font-semibold">My Applications</h3>
        </div>
        <Link 
          href="/dashboard/applications/new"
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-2 text-xs transition-colors"
        >
          Add Application
        </Link>
      </div>

      {apps.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div className="text-sm font-medium mb-1">No applications yet</div>
          <div className="text-xs text-muted-foreground mb-3">
            Start your first application to get organized
          </div>
          <Link 
            href="/dashboard/applications/new"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-2 text-xs transition-colors"
          >
            Add Application
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apps.map((app) => {
            const progress = getApplicationProgress(app.id);
            const insight = getApplicationInsight(app);
            
            return (
              <Link 
                key={app.id} 
                href={`/dashboard/applications/${app.id}`}
                className="block border rounded-lg p-4 hover:border-blue-300 hover:shadow-sm transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{app.school.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <StatusChip status={app.status} />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    {insight.icon}
                    <span className={`text-sm font-medium ${insight.color}`}>
                      {insight.text}
                    </span>
                  </div>
                  
                  {progress > 0 && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <ProgressBar progress={progress} />
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
} 