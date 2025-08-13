"use client";

import { useState, useEffect } from "react";
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
  status: 'pending' | 'requested' | 'in_progress' | 'completed' | 'declined';
  request_date: string;
  due_date?: string;
  notes?: string;
  school_requirements?: any;
  recommenders: Recommender;
}

interface SchoolRequirements {
  count: number;
  format: string;
  school_name: string;
}

export default function RecommendationsManager({ appId }: { appId: string }) {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [recommenders, setRecommenders] = useState<Recommender[]>([]);
  const [schoolRequirements, setSchoolRequirements] = useState<SchoolRequirements | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedRecommender, setSelectedRecommender] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    loadData();
  }, [appId]);

  async function loadData() {
    try {
      // Load recommenders
      const recommendersRes = await fetch("/api/recommenders");
      if (recommendersRes.ok) {
        const recommendersData = await recommendersRes.json();
        setRecommenders(recommendersData);
      }

      // Load assignments and school requirements
      const assignmentsRes = await fetch(`/api/applications/${appId}/recommendations`);
      if (assignmentsRes.ok) {
        const data = await assignmentsRes.json();
        setAssignments(data.assignments);
        setSchoolRequirements(data.schoolRequirements);
      }
    } catch (error) {
      console.error("Failed to load recommendations data:", error);
      toast.error("Failed to load recommendations data");
    } finally {
      setLoading(false);
    }
  }

  async function addAssignment() {
    if (!selectedRecommender) {
      toast.error("Please select a recommender");
      return;
    }

    try {
      const response = await fetch(`/api/applications/${appId}/recommendations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recommender_id: selectedRecommender,
          due_date: dueDate || null,
          notes: notes || null
        })
      });

      if (response.ok) {
        const newAssignment = await response.json();
        setAssignments(prev => [...prev, newAssignment]);
        setShowAddForm(false);
        setSelectedRecommender("");
        setDueDate("");
        setNotes("");
        toast.success("Recommender assigned successfully");
      } else {
        throw new Error("Failed to assign recommender");
      }
    } catch (error) {
      console.error("Failed to assign recommender:", error);
      toast.error("Failed to assign recommender");
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'requested': return 'bg-yellow-100 text-yellow-800';
      case 'declined': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  function getStatusText(status: string) {
    switch (status) {
      case 'pending': return 'Pending';
      case 'requested': return 'Requested';
      case 'in_progress': return 'In Progress';
      case 'completed': return 'Completed';
      case 'declined': return 'Declined';
      default: return status;
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-xl font-semibold">Recommendations</h2>
        {schoolRequirements && (
          <div className="mt-2 text-sm text-muted-foreground">
            {schoolRequirements.school_name} requires {schoolRequirements.count} recommendation{schoolRequirements.count > 1 ? 's' : ''} ({schoolRequirements.format})
          </div>
        )}
      </div>

      {/* Current Assignments */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Current Assignments</h3>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Recommender
          </button>
        </div>

        {assignments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No recommenders assigned yet
          </div>
        ) : (
          <div className="space-y-4">
            {assignments.map((assignment) => (
              <div key={assignment.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-medium">{assignment.recommenders.name}</h4>
                    <div className="text-sm text-muted-foreground">
                      {assignment.recommenders.title && `${assignment.recommenders.title} at `}
                      {assignment.recommenders.organization}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {assignment.recommenders.relationship}
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.status)}`}>
                    {getStatusText(assignment.status)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Requested:</span> {new Date(assignment.request_date).toLocaleDateString()}
                  </div>
                  {assignment.due_date && (
                    <div>
                      <span className="font-medium">Due:</span> {new Date(assignment.due_date).toLocaleDateString()}
                    </div>
                  )}
                </div>
                
                {assignment.notes && (
                  <div className="mt-3 text-sm">
                    <span className="font-medium">Notes:</span> {assignment.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Assignment Form */}
      {showAddForm && (
        <div className="border rounded-lg p-6 bg-gray-50">
          <h3 className="text-lg font-medium mb-4">Assign Recommender</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Recommender</label>
              <select
                value={selectedRecommender}
                onChange={(e) => setSelectedRecommender(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose a recommender...</option>
                {recommenders.map((recommender) => (
                  <option key={recommender.id} value={recommender.id}>
                    {recommender.name} - {recommender.relationship || 'No relationship specified'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Due Date (Optional)</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Notes (Optional)</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special instructions or notes..."
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={addAssignment}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Assign Recommender
              </button>
              <button
                onClick={() => {
                  setShowAddForm(false);
                  setSelectedRecommender("");
                  setDueDate("");
                  setNotes("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Recommender CTA */}
      {recommenders.length === 0 && (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <div className="text-lg font-medium mb-2">No recommenders yet</div>
          <div className="text-sm text-muted-foreground mb-4">
            Add recommenders to your master list first
          </div>
          <button
            onClick={() => window.location.href = '/dashboard/recommendations'}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Manage Recommenders
          </button>
        </div>
      )}
    </div>
  );
} 