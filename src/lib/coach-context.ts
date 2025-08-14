import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function gatherUserContext(userId: string) {
  const supabase = getAdminSupabase();

  try {
    // Gather all user data in parallel
    const [
      profileResult,
      applicationsResult,
      essaysResult,
      recommendationsResult,
      conversationsResult,
      memoryResult,
    ] = await Promise.all([
      // User profile
      supabase.from("profiles").select("*").eq("id", userId).single(),

      // Applications
      supabase
        .from("applications")
        .select(
          `
          *,
          schools (*)
        `,
        )
        .eq("user_id", userId),

      // Essays/Answers
      supabase
        .from("answers")
        .select(
          `
          *,
          questions (*),
          applications (*)
        `,
        )
        .eq("user_id", userId),

      // Recommendations
      supabase
        .from("recommender_assignments")
        .select(
          `
          *,
          recommenders (*),
          applications (*)
        `,
        )
        .eq("user_id", userId),

      // Recent conversations
      supabase
        .from("coach_conversations")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5),

      // Coach memory
      supabase
        .from("coach_memory")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10),
    ]);

    // Extract data and handle errors gracefully
    const profile = profileResult.data || {};
    const applications = applicationsResult.data || [];
    const essays = essaysResult.data || [];
    const recommendations = recommendationsResult.data || [];
    const conversations = conversationsResult.data || [];
    const memory = memoryResult.data || [];

    // Calculate progress metrics
    const progress = {
      totalApplications: applications.length,
      completedApplications: applications.filter(
        (app) => app.status === "completed",
      ).length,
      totalEssays: essays.length,
      completedEssays: essays.filter((essay) => essay.status === "completed")
        .length,
      totalRecommendations: recommendations.length,
      completedRecommendations: recommendations.filter(
        (rec) => rec.status === "completed",
      ).length,
      profileCompleteness: calculateProfileCompleteness(profile),
    };

    // Format context for AI
    const context = {
      user: {
        profile,
        applications,
        essays,
        recommendations,
        progress,
      },
      schools: {
        targetSchools: applications.map((app) => app.schools).filter(Boolean),
        requirements: applications
          .map((app) => app.school_requirements)
          .filter(Boolean),
        deadlines: applications
          .map((app) => ({
            school: app.schools?.name,
            deadline: app.deadline,
            application: app.name,
          }))
          .filter((d) => d.school),
      },
      session: {
        conversationHistory: conversations,
        userPreferences: extractUserPreferences(memory),
        learningMemory: memory,
      },
    };

    return context;
  } catch (error) {
    console.error("Error gathering user context:", error);
    // Return minimal context on error
    return {
      user: {
        profile: {},
        applications: [],
        essays: [],
        recommendations: [],
        progress: {},
      },
      schools: { targetSchools: [], requirements: [], deadlines: [] },
      session: {
        conversationHistory: [],
        userPreferences: {},
        learningMemory: [],
      },
    };
  }
}

function calculateProfileCompleteness(profile: any): number {
  const fields = [
    "name",
    "email",
    "bio",
    "academic_interests",
    "extracurriculars",
  ];
  const completedFields = fields.filter(
    (field) => profile[field] && profile[field].trim() !== "",
  );
  return Math.round((completedFields.length / fields.length) * 100);
}

function extractUserPreferences(memory: any[]): any {
  const preferences = memory.filter((m) => m.memory_type === "preference");
  return preferences.reduce((acc, pref) => {
    return { ...acc, ...pref.content };
  }, {});
}
