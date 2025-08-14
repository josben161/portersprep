import { getAdminSupabase } from "@/lib/supabaseAdmin";

interface UserPreferences {
  writingStyle: "formal" | "conversational" | "creative";
  focusAreas: string[];
  preferredSchools: string[];
  applicationTimeline: "early" | "regular" | "rolling";
  stressLevel: "low" | "medium" | "high";
  learningStyle: "visual" | "auditory" | "kinesthetic";
}

interface PersonalizationInsights {
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  motivationalStyle: string;
  communicationStyle: string;
}

export async function analyzeUserPersonality(
  userId: string,
): Promise<PersonalizationInsights> {
  const supabase = getAdminSupabase();

  try {
    // Gather user data for personality analysis
    const [conversations, memory, profile] = await Promise.all([
      supabase
        .from("coach_conversations")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(20),

      supabase
        .from("coach_memory")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50),

      supabase.from("profiles").select("*").eq("id", userId).single(),
    ]);

    const convData = conversations.data || [];
    const memoryData = memory.data || [];
    const profileData = profile.data || {};

    // Analyze conversation patterns
    const messageLengths = convData.map((c) => c.message.length);
    const avgMessageLength =
      messageLengths.reduce((a, b) => a + b, 0) / messageLengths.length;

    // Analyze common topics
    const topics = extractTopics(convData);

    // Analyze stress indicators
    const stressIndicators = analyzeStressLevel(convData);

    // Determine communication style
    const communicationStyle = determineCommunicationStyle(
      avgMessageLength,
      topics,
    );

    // Determine motivational style
    const motivationalStyle = determineMotivationalStyle(
      memoryData,
      profileData,
    );

    // Identify strengths and weaknesses
    const strengths = identifyStrengths(profileData, memoryData);
    const weaknesses = identifyWeaknesses(profileData, memoryData);

    // Generate personalized recommendations
    const recommendations = generateRecommendations(
      strengths,
      weaknesses,
      topics,
    );

    return {
      strengths,
      weaknesses,
      recommendations,
      motivationalStyle,
      communicationStyle,
    };
  } catch (error) {
    console.error("Error analyzing user personality:", error);
    return {
      strengths: ["Determination", "Organization"],
      weaknesses: ["Time management", "Essay writing"],
      recommendations: [
        "Focus on time management",
        "Practice essay writing regularly",
      ],
      motivationalStyle: "encouraging",
      communicationStyle: "conversational",
    };
  }
}

export async function updateUserPreferences(
  userId: string,
  preferences: Partial<UserPreferences>,
) {
  const supabase = getAdminSupabase();

  try {
    await supabase.from("coach_memory").insert({
      user_id: userId,
      memory_type: "preference",
      content: {
        ...preferences,
        updated_at: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error updating user preferences:", error);
  }
}

export async function getPersonalizedGreeting(userId: string): Promise<string> {
  const insights = await analyzeUserPersonality(userId);

  const timeOfDay = new Date().getHours();
  let timeGreeting = "";

  if (timeOfDay < 12) timeGreeting = "Good morning";
  else if (timeOfDay < 17) timeGreeting = "Good afternoon";
  else timeGreeting = "Good evening";

  const motivationalPhrases = {
    encouraging: [
      "You're making great progress!",
      "I believe in your potential!",
      "You've got this!",
      "Your dedication is inspiring!",
    ],
    analytical: [
      "Let's analyze your next steps.",
      "Here's what we need to focus on.",
      "Based on your progress, here's what's next.",
      "Let's optimize your strategy.",
    ],
    supportive: [
      "I'm here to support you every step of the way.",
      "Remember, this is a journey, not a race.",
      "Take it one step at a time.",
      "You're not alone in this process.",
    ],
  };

  const phrases =
    motivationalPhrases[
      insights.motivationalStyle as keyof typeof motivationalPhrases
    ] || motivationalPhrases.encouraging;
  const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];

  return `${timeGreeting}! ${randomPhrase} How can I help you today?`;
}

function extractTopics(conversations: any[]): string[] {
  const topics = new Set<string>();

  conversations.forEach((conv) => {
    const message = conv.message.toLowerCase();
    if (message.includes("essay")) topics.add("essay writing");
    if (message.includes("school") || message.includes("college"))
      topics.add("school selection");
    if (message.includes("recommendation")) topics.add("recommendations");
    if (message.includes("deadline") || message.includes("timeline"))
      topics.add("timeline");
    if (message.includes("stress") || message.includes("anxiety"))
      topics.add("stress management");
    if (message.includes("interview")) topics.add("interview preparation");
  });

  return Array.from(topics);
}

function analyzeStressLevel(conversations: any[]): "low" | "medium" | "high" {
  const stressKeywords = [
    "stress",
    "anxiety",
    "worried",
    "nervous",
    "overwhelmed",
    "panic",
  ];
  const stressCount = conversations.filter((conv) =>
    stressKeywords.some((keyword) =>
      conv.message.toLowerCase().includes(keyword),
    ),
  ).length;

  if (stressCount > 3) return "high";
  if (stressCount > 1) return "medium";
  return "low";
}

function determineCommunicationStyle(
  avgMessageLength: number,
  topics: string[],
): string {
  if (avgMessageLength > 100) return "detailed";
  if (avgMessageLength > 50) return "conversational";
  return "concise";
}

function determineMotivationalStyle(memory: any[], profile: any): string {
  const preferences = memory.filter((m) => m.memory_type === "preference");
  const hasDetailedPrefs = preferences.some((p) => p.content?.writingStyle);

  if (hasDetailedPrefs) return "analytical";
  if (profile?.bio?.includes("creative") || profile?.bio?.includes("artistic"))
    return "supportive";
  return "encouraging";
}

function identifyStrengths(profile: any, memory: any[]): string[] {
  const strengths = [];

  if (profile?.extracurriculars) strengths.push("Leadership experience");
  if (profile?.academic_interests) strengths.push("Academic focus");
  if (memory.some((m) => m.content?.function === "analyze_user_progress"))
    strengths.push("Progress tracking");

  return strengths.length > 0 ? strengths : ["Determination", "Organization"];
}

function identifyWeaknesses(profile: any, memory: any[]): string[] {
  const weaknesses = [];

  if (!profile?.bio) weaknesses.push("Profile completion");
  if (memory.some((m) => m.content?.function === "generate_essay_guidance"))
    weaknesses.push("Essay writing");

  return weaknesses.length > 0
    ? weaknesses
    : ["Time management", "Essay writing"];
}

function generateRecommendations(
  strengths: string[],
  weaknesses: string[],
  topics: string[],
): string[] {
  const recommendations = [];

  if (weaknesses.includes("Profile completion")) {
    recommendations.push(
      "Complete your profile to unlock personalized insights",
    );
  }

  if (weaknesses.includes("Essay writing")) {
    recommendations.push("Practice essay writing with our guided prompts");
  }

  if (topics.includes("stress management")) {
    recommendations.push(
      "Take breaks and practice stress management techniques",
    );
  }

  if (strengths.includes("Leadership experience")) {
    recommendations.push("Highlight your leadership experience in essays");
  }

  return recommendations.length > 0
    ? recommendations
    : ["Focus on time management", "Practice essay writing regularly"];
}
