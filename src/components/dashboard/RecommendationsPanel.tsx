"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface Assignment {
  id: string;
  status: 'pending' | 'requested' | 'in_progress' | 'completed' | 'declined';
  applications: {
    schools: {
      name: string;
    };
  };
}

export default function RecommendationsPanel() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAssignments();
  }, []);

  async function loadAssignments() {
    try {
      // Load applications first
      const appsRes = await fetch("/api/applications");
      if (appsRes.ok) {
        const apps = await appsRes.json();
        
        // Load assignments for each application
        const allAssignments = [];
        for (const app of apps) {
          const assignmentsRes = await fetch(`/api/applications/${app.id}/recommendations`);
          if (assignmentsRes.ok) {
            const data = await assignmentsRes.json();
            allAssignments.push(...data.assignments.map((a: any) => ({
              ...a,
              applications: app
            })));
          }
        }
        setAssignments(allAssignments);
      }
    } catch (error) {
      console.error("Failed to load assignments:", error);
    } finally {
      setLoading(false);
    }
  }

  const stats = {
    total: assignments.length,
    completed: assignments.filter(a => a.status === 'completed').length,
    pending: assignments.filter(a => a.status === 'pending' || a.status === 'requested').length,
    inProgress: assignments.filter(a => a.status === 'in_progress').length
  };

  function getStatusColor(status: string) {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'requested': return 'bg-yellow-100 text-yellow-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  if (loading) {
    return (
      <div className="card p-4">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-3"></div>
          <div className="space-y-2">
            {[1, 2].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-xs text-muted-foreground">Recommendations</div>
          <h3 className="text-base font-semibold">Progress Overview</h3>
        </div>
        <Link href="/dashboard/recommendations" className="btn btn-outline text-xs">Manage All</Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center">
          <div className="text-lg font-bold">{stats.total}</div>
          <div className="text-xs text-muted-foreground">Total</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-green-600">{stats.completed}</div>
          <div className="text-xs text-muted-foreground">Done</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-yellow-600">{stats.pending}</div>
          <div className="text-xs text-muted-foreground">Pending</div>
        </div>
      </div>

      {/* Recent Assignments */}
      {assignments.length === 0 ? (
        <div className="text-center py-4">
          <div className="text-sm text-muted-foreground mb-2">No assignments yet</div>
          <Link href="/dashboard/recommendations" className="text-xs text-blue-600 hover:text-blue-700">
            Add recommenders →
          </Link>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="text-xs text-muted-foreground mb-2">Recent Assignments</div>
          {assignments.slice(0, 3).map((assignment) => (
            <div key={assignment.id} className="flex items-center justify-between text-sm">
              <div className="flex-1 min-w-0">
                <div className="truncate font-medium">{assignment.applications.schools.name}</div>
                <div className="text-xs text-muted-foreground truncate">
                  {assignment.status.replace('_', ' ')}
                </div>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                {assignment.status === 'completed' ? '✓' : assignment.status === 'in_progress' ? '⋯' : '○'}
              </div>
            </div>
          ))}
          {assignments.length > 3 && (
            <div className="text-xs text-muted-foreground text-center pt-2">
              +{assignments.length - 3} more assignments
            </div>
          )}
        </div>
      )}
    </div>
  );
} 