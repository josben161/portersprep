"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface School {
  id: string;
  name: string;
  country: string;
  cycle: string;
  essays: Array<{
    type: string;
    title: string;
    prompt: string;
    word_limit: number | null;
  }>;
  video_assessment: { provider: string; notes?: string } | null;
  lor: { count: number; format: string } | null;
  verify_in_portal: boolean;
  last_checked: string;
  deadlines: {
    round1: string;
    round2: string;
    round3: string;
  };
}

interface SchoolBasic {
  id: string;
  name: string;
}

export default function NewApplicationPage() {
  const [schools, setSchools] = useState<SchoolBasic[]>([]);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [round, setRound] = useState("1");
  const [deadline, setDeadline] = useState("");
  const [creating, setCreating] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  // Load schools on mount
  useEffect(() => {
    async function loadSchools() {
      try {
        const response = await fetch("/api/schools");
        if (response.ok) {
          const data = await response.json();
          setSchools(data);
        }
      } catch (error) {
        console.error("Failed to load schools:", error);
      } finally {
        setLoading(false);
      }
    }
    loadSchools();
  }, []);

  // Load detailed school data when selected
  useEffect(() => {
    if (!selectedSchool?.id) return;

    async function loadSchoolDetails() {
      try {
        const response = await fetch(`/api/schools/${selectedSchool?.id}`);
        if (response.ok) {
          const data = await response.json();
          setSelectedSchool(data);
        }
      } catch (error) {
        console.error("Failed to load school details:", error);
      }
    }
    loadSchoolDetails();
  }, [selectedSchool?.id]);

  // Filter schools based on search
  const filteredSchools = schools.filter((school) =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Get default deadline based on round
  const getDefaultDeadline = (round: string) => {
    if (!selectedSchool?.deadlines) {
      const now = new Date();
      const currentYear = now.getFullYear();

      switch (round) {
        case "1":
          return `${currentYear}-09-15`;
        case "2":
          return `${currentYear}-01-05`;
        case "3":
          return `${currentYear}-04-01`;
        default:
          return "";
      }
    }

    // Use real deadlines from school data
    switch (round) {
      case "1":
        return selectedSchool.deadlines.round1;
      case "2":
        return selectedSchool.deadlines.round2;
      case "3":
        return selectedSchool.deadlines.round3;
      default:
        return selectedSchool.deadlines.round1;
    }
  };

  // Update deadline when round changes
  useEffect(() => {
    setDeadline(getDefaultDeadline(round));
  }, [round]);

  async function createApplication() {
    if (!selectedSchool) return;

    setCreating(true);
    try {
      console.log("Creating application with school:", selectedSchool);
      console.log("School ID being sent:", selectedSchool.id);

      const response = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          school_id: selectedSchool.id,
          round: parseInt(round),
          deadline: deadline || getDefaultDeadline(round),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/dashboard/applications/${data.id}`);
      } else {
        const error = await response.text();
        console.error("Application creation failed:", error);
        // Replace alert with in-page error display
        setError(`Failed to create application: ${error}`);
      }
    } catch (error) {
      console.error("Failed to create application:", error);
      setError("Failed to create application. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-8"></div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <Link
                href="/dashboard/applications"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Applications
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Create New Application
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Choose a school and set up your application timeline
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* School Selection */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Select School
              </h2>

              {/* Search */}
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Search schools..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>

              {/* School List */}
              <div className="max-h-96 overflow-y-auto space-y-2">
                {filteredSchools.map((school) => (
                  <button
                    key={school.id}
                    onClick={() =>
                      setSelectedSchool({
                        ...school,
                        essays: [],
                        video_assessment: null,
                        lor: null,
                        verify_in_portal: false,
                        last_checked: "",
                        country: "",
                        cycle: "",
                        deadlines: { round1: "", round2: "", round3: "" },
                      })
                    }
                    className={`w-full text-left p-4 rounded-lg border transition-all ${
                      selectedSchool?.id === school.id
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500"
                    }`}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">
                      {school.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Application Details */}
            <div className="space-y-6">
              {/* School Info */}
              {selectedSchool && (
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                    {selectedSchool.name}
                  </h2>

                  <div className="space-y-4">
                    {/* Round Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Application Round
                      </label>
                      <select
                        value={round}
                        onChange={(e) => setRound(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="1">Round 1 (September)</option>
                        <option value="2">Round 2 (January)</option>
                        <option value="3">Round 3 (April)</option>
                      </select>
                    </div>

                    {/* Deadline */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Application Deadline
                      </label>
                      <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    {/* Requirements Preview */}
                    <div className="border-t pt-4">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                        Application Requirements
                      </h3>
                      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          Essays: {selectedSchool.essays?.length || 0} required
                        </div>
                        {selectedSchool.lor && (
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-green-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            Letters of Recommendation:{" "}
                            {selectedSchool.lor.count} required
                          </div>
                        )}
                        {selectedSchool.video_assessment && (
                          <div className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-blue-500"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            Video Assessment:{" "}
                            {selectedSchool.video_assessment.provider}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Create Button */}
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <button
                  onClick={createApplication}
                  disabled={!selectedSchool || creating}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {creating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Application...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                      </svg>
                      Create Application
                    </>
                  )}
                </button>
                {!selectedSchool && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">
                    Please select a school to continue
                  </p>
                )}
                {error && (
                  <div className="mt-4 text-center text-red-500 text-sm">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
