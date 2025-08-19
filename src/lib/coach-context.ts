import { getAdminSupabase } from "@/lib/supabaseAdmin";

export async function gatherUserContext(userId: string) {
  const supabase = getAdminSupabase();

  try {
    console.log(`Coach Context: Gathering context for user ${userId}`);
    
    // Gather all user data in parallel
    const [
      profileResult,
      applicationsResult,
      recommendationsResult,
    ] = await Promise.all([
      // User profile
      supabase.from("profiles").select("*").eq("id", userId).single(),

      // Applications
      supabase
        .from("applications")
        .select("*")
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
    ]);

    // Extract data and handle errors gracefully
    const profile = profileResult.data || {};
    const applications = applicationsResult.data || [];
    const recommendations = recommendationsResult.data || [];
    
    // Note: essays, conversations, memory tables don't exist in new schema
    const essays: any[] = [];
    const conversations: any[] = [];
    const memory: any[] = [];

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
