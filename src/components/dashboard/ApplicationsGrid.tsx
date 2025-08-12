"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { FitChip } from "./FitChip";

interface Application {
  id: string;
  status: string;
  school: {
    id: string;
    name: string;
  };
}

export default function ApplicationsGrid() {
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadApps() {
      try {
        const r = await fetch("/api/applications");
        if (r.ok) {
          const data = await r.json();
          setApps(data);
        }
      } catch (error) {
        console.error("Failed to load applications:", error);
      } finally {
        setLoading(false);
      }
    }
    loadApps();
  }, []);

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
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Create Application →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {apps.map((app) => (
            <Link
              key={app.id}
              href={`/dashboard/applications/${app.id}`}
              className="block p-4 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-900/30 transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {app.school.name}
                </div>
                <FitChip status={app.status} />
              </div>
              <div className="text-xs text-muted-foreground">
                Manage recs
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
} 