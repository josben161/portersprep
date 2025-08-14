"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "react-hot-toast";

interface Recommender {
  id: string;
  name: string;
  title?: string;
  organization?: string;
  email?: string;
  relationship?: string;
  years_known?: number;
}

interface Assignment {
  id: string;
  status: "pending" | "requested" | "in_progress" | "completed" | "declined";
  request_date: string;
  due_date?: string;
  notes?: string;
  school_requirements?: any;
  recommenders: Recommender;
  applications: {
    id: string;
    schools: {
      name: string;
    };
  };
}

interface Application {
  id: string;
  school_id: string;
  status: string;
  schools: {
    name: string;
  };
}

export default function RecommendationsPage() {
  const [recommenders, setRecommenders] = useState<Recommender[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newRecommender, setNewRecommender] = useState({
    name: "",
    title: "",
    organization: "",
    email: "",
    relationship: "",
    years_known: "",
  });

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      // Load recommenders
      const recsRes = await fetch("/api/recommenders");
      if (recsRes.ok) {
        const recsData = await recsRes.json();
        setRecommenders(recsData);
      }

      // Load applications
      const appsRes = await fetch("/api/applications");
      if (appsRes.ok) {
        const appsData = await appsRes.json();
        setApplications(appsData);

        // Load all assignments across applications
        const assignmentsData = [];
        for (const app of appsData) {
          const assignmentsRes = await fetch(
            `/api/applications/${app.id}/recommendations`,
          );
          if (assignmentsRes.ok) {
            const data = await assignmentsRes.json();
            assignmentsData.push(
              ...data.assignments.map((a: any) => ({
                ...a,
                applications: app,
              })),
            );
          }
        }
        setAssignments(assignmentsData);
      }
    } catch (error) {
      console.error("Failed to load recommendations data:", error);
      toast.error("Failed to load recommendations data");
    } finally {
      setLoading(false);
    }
  }

  async function addRecommender() {
    if (!newRecommender.name) {
      toast.error("Name is required");
      return;
    }

    try {
      const response = await fetch("/api/recommenders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newRecommender,
          years_known: newRecommender.years_known
            ? parseInt(newRecommender.years_known)
            : null,
        }),
      });

      if (response.ok) {
        const newRec = await response.json();
        setRecommenders((prev) => [...prev, newRec]);
        setShowAddForm(false);
        setNewRecommender({
          name: "",
          title: "",
          organization: "",
          email: "",
          relationship: "",
          years_known: "",
        });
        toast.success("Recommender added successfully");
      } else {
        throw new Error("Failed to add recommender");
      }
    } catch (error) {
      console.error("Failed to add recommender:", error);
      toast.error("Failed to add recommender");
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "requested":
        return "bg-yellow-100 text-yellow-800";
      case "declined":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case "pending":
        return "Pending";
      case "requested":
        return "Requested";
      case "in_progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "declined":
        return "Declined";
      default:
        return status;
    }
  }

  const stats = {
    total: recommenders.length,
    assigned: assignments.length,
    completed: assignments.filter((a) => a.status === "completed").length,
    pending: assignments.filter(
      (a) => a.status === "pending" || a.status === "requested",
    ).length,
  };

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Recommendations</h1>
          <p className="text-sm text-muted-foreground">
            Manage your recommenders and track assignments across all
            applications.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            Add Recommender
          </button>
          <Link
            href="/dashboard"
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold">{stats.total}</div>
          <div className="text-sm text-muted-foreground">
            Total Recommenders
          </div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold">{stats.assigned}</div>
          <div className="text-sm text-muted-foreground">Total Assignments</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {stats.completed}
          </div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
        <div className="border rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.pending}
          </div>
          <div className="text-sm text-muted-foreground">Pending</div>
        </div>
      </div>

      {/* Add Recommender Form */}
      {showAddForm && (
        <div className="border rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-medium mb-4">Add New Recommender</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name *</label>
              <input
                type="text"
                value={newRecommender.name}
                onChange={(e) =>
                  setNewRecommender((prev) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={newRecommender.title}
                onChange={(e) =>
                  setNewRecommender((prev) => ({
                    ...prev,
                    title: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Senior Manager"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Organization
              </label>
              <input
                type="text"
                value={newRecommender.organization}
                onChange={(e) =>
                  setNewRecommender((prev) => ({
                    ...prev,
                    organization: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., McKinsey & Company"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={newRecommender.email}
                onChange={(e) =>
                  setNewRecommender((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="email@company.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Relationship
              </label>
              <input
                type="text"
                value={newRecommender.relationship}
                onChange={(e) =>
                  setNewRecommender((prev) => ({
                    ...prev,
                    relationship: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Direct Manager"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Years Known
              </label>
              <input
                type="number"
                value={newRecommender.years_known}
                onChange={(e) =>
                  setNewRecommender((prev) => ({
                    ...prev,
                    years_known: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="2"
                min="0"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 mt-6">
            <button
              onClick={addRecommender}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Recommender
            </button>
            <button
              onClick={() => {
                setShowAddForm(false);
                setNewRecommender({
                  name: "",
                  title: "",
                  organization: "",
                  email: "",
                  relationship: "",
                  years_known: "",
                });
              }}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Recommenders List */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Your Recommenders</h2>

        {recommenders.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
            <div className="text-lg font-medium mb-2">No recommenders yet</div>
            <div className="text-sm text-muted-foreground mb-4">
              Add your first recommender to get started
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Add Recommender
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recommenders.map((recommender) => (
              <div key={recommender.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium">{recommender.name}</h3>
                    {recommender.title && (
                      <div className="text-sm text-muted-foreground">
                        {recommender.title}
                      </div>
                    )}
                    {recommender.organization && (
                      <div className="text-sm text-muted-foreground">
                        {recommender.organization}
                      </div>
                    )}
                    {recommender.relationship && (
                      <div className="text-sm text-muted-foreground">
                        {recommender.relationship}
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {recommender.email && (
                    <div className="text-sm">
                      <span className="font-medium">Email:</span>{" "}
                      {recommender.email}
                    </div>
                  )}
                  {recommender.years_known && (
                    <div className="text-sm">
                      <span className="font-medium">Years Known:</span>{" "}
                      {recommender.years_known}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t">
                  <Link
                    href={`/dashboard/applications`}
                    className="text-sm text-blue-600 hover:text-blue-700"
                  >
                    Assign to Applications →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Assignments */}
      {assignments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Recent Assignments</h2>
          <div className="space-y-3">
            {assignments.slice(0, 5).map((assignment) => (
              <div key={assignment.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="font-medium">
                      {assignment.recommenders.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {assignment.applications.schools.name}
                    </div>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}
                  >
                    {getStatusText(assignment.status)}
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  Requested:{" "}
                  {new Date(assignment.request_date).toLocaleDateString()}
                  {assignment.due_date && (
                    <span>
                      {" "}
                      • Due:{" "}
                      {new Date(assignment.due_date).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
