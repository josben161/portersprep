"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { toast } from "react-hot-toast";
import ApplicationWorkspace from "./ApplicationWorkspace";
import ApplicationProgress from "@/components/ApplicationProgress";

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

export default function ApplicationPage() {
  const params = useParams();
  const appId = params.id as string;
  
  const [application, setApplication] = useState<Application | null>(null);
  const [activeTab, setActiveTab] = useState<'workspace' | 'progress'>('workspace');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplicationData();
  }, [appId]);

  async function loadApplicationData() {
    try {
      const appRes = await fetch(`/api/applications/${appId}`);
      if (!appRes.ok) throw new Error("Failed to load application");
      const appData = await appRes.json();
      setApplication(appData);
    } catch (error) {
      console.error("Failed to load application data:", error);
      toast.error("Failed to load application data");
    } finally {
      setLoading(false);
    }
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

  return (
    <div className="mx-auto max-w-6xl p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">{application.schools?.name || 'Application'}</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
              <span>Round {application.round}</span>
              <span>•</span>
              <span>Status: {application.status}</span>
            </div>
          </div>
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
            Application Workspace
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
        <ApplicationWorkspace appId={appId} />
      ) : (
        <div className="max-w-4xl">
          <ApplicationProgress
            questions={[]}
            answers={[]}
            application={{
              ...application,
              round: application.round.toString()
            }}
          />
        </div>
      )}
    </div>
  );
} 