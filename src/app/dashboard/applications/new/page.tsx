"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

interface School {
  id: string;
  name: string;
}

export default function NewApplication() {
  const router = useRouter();
  const [schools, setSchools] = useState<School[]>([]);
  const [selectedSchool, setSelectedSchool] = useState("");
  const [selectedRound, setSelectedRound] = useState("R1");
  const [loading, setLoading] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(true);

  useEffect(() => {
    async function loadSchools() {
      try {
        const res = await fetch("/api/schools");
        if (res.ok) {
          const data = await res.json();
          setSchools(data);
        } else {
          toast.error("Failed to load schools");
        }
      } catch (error) {
        toast.error("Failed to load schools");
      } finally {
        setLoadingSchools(false);
      }
    }
    loadSchools();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSchool) {
      toast.error("Please select a school");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolId: selectedSchool,
          round: selectedRound
        })
      });

      if (!res.ok) {
        throw new Error("Failed to create application");
      }

      const { id } = await res.json();
      toast.success("Application created!");
      router.push(`/dashboard/applications/${id}/requirements`);
    } catch (error) {
      toast.error("Failed to create application");
    } finally {
      setLoading(false);
    }
  }

  if (loadingSchools) {
    return (
      <div className="mx-auto max-w-2xl p-6">
        <div className="text-center">
          <div className="text-lg font-medium">Loading schools...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">New Application</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a new MBA application to get organized essay writing and AI feedback.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Select School *
          </label>
          <select
            value={selectedSchool}
            onChange={(e) => setSelectedSchool(e.target.value)}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
            required
          >
            <option value="">Choose a school...</option>
            {schools.map(school => (
              <option key={school.id} value={school.id}>
                {school.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Application Round
          </label>
          <select
            value={selectedRound}
            onChange={(e) => setSelectedRound(e.target.value)}
            className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="R1">Round 1</option>
            <option value="R2">Round 2</option>
            <option value="R3">Round 3</option>
            <option value="Rolling">Rolling</option>
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || !selectedSchool}
            className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:opacity-95 disabled:pointer-events-none disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Application"}
          </button>
        </div>
      </form>

      <div className="mt-8 rounded-lg border p-4 bg-muted/20">
        <h3 className="font-medium mb-2">What happens next?</h3>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• View official essay requirements for your school</li>
          <li>• Start drafts with one-click essay creation</li>
          <li>• Write essays with auto-save and word count</li>
          <li>• Get AI-powered feedback and suggestions</li>
        </ul>
      </div>
    </div>
  );
} 