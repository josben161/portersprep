"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import RecommenderList from "@/components/recommenders/RecommenderList";

type Recommender = {
  id: string;
  name?: string | null;
  email: string;
  relationship?: string | null;
  status: string;
  recommendation_packets?: Array<{ id: string; last_sent_at: string | null }>;
};

export default function AppRecsPage() {
  const params = useParams<{ id: string }>();
  const appId = params.id;
  const [recommenders, setRecommenders] = useState<Recommender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadRecommenders() {
    try {
      setLoading(true);
      setError(null);

      // Get user ID from auth context (you may need to adjust this based on your auth setup)
      const userId = "current-user-id"; // This should come from your auth context

      const response = await fetch(
        `/api/recommenders/list?applicationId=${appId}&userId=${userId}`,
      );

      if (!response.ok) {
        throw new Error(`Failed to load recommenders: ${response.status}`);
      }

      const data = await response.json();
      setRecommenders(data.recommenders || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load recommenders",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRecommenders();
  }, [appId]);

  return (
    <div className="mx-auto max-w-5xl p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Recommenders</h1>
        <Link
          className="btn btn-outline text-xs"
          href={`/dashboard/applications/${appId}/ide`}
        >
          Back to workspace
        </Link>
      </div>

      {loading && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading recommenders...</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/30">
          <p className="text-red-700 dark:text-red-200">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <RecommenderList appId={appId} recommenders={recommenders} />
      )}
    </div>
  );
}
