import { callGateway } from "./ai";

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  category: "profile" | "resume" | "goals" | "schools" | "timeline";
  priority: "low" | "medium" | "high" | "critical";
  completed: boolean;
  action_url?: string;
  estimated_time: number; // in minutes
}

export interface OnboardingProgress {
  total_steps: number;
  completed_steps: number;
  completion_percentage: number;
  next_steps: OnboardingStep[];
  critical_missing: OnboardingStep[];
  estimated_completion_time: number; // in minutes
}

export async function analyzeOnboardingStatus(
  userId: string,
): Promise<OnboardingProgress> {
  try {
    const { content } = await callGateway("coach", {
      userId,
      params: {
        mode: "onboarding_analysis",
      },
    });

    // Parse the response to get onboarding progress
    let progress: OnboardingProgress;
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        progress = JSON.parse(jsonMatch[1]);
      } else {
        progress = JSON.parse(content);
      }
    } catch (parseError) {
      console.error("Failed to parse onboarding analysis:", parseError);
      // Return default progress
      return {
        total_steps: 0,
        completed_steps: 0,
        completion_percentage: 0,
        next_steps: [],
        critical_missing: [],
        estimated_completion_time: 0,
      };
    }

    return progress;
  } catch (error) {
    console.error("Error analyzing onboarding status:", error);
    return {
      total_steps: 0,
      completed_steps: 0,
      completion_percentage: 0,
      next_steps: [],
      critical_missing: [],
      estimated_completion_time: 0,
    };
  }
}

export async function generateOnboardingMessage(
  userId: string,
): Promise<string> {
  try {
    const { content } = await callGateway("coach", {
      userId,
      params: {
        mode: "onboarding_message",
      },
    });

    return content;
  } catch (error) {
    console.error("Error generating onboarding message:", error);
    return "Welcome to The Admit Architect! I'm here to help you with your MBA applications. Let's start by completing your profile.";
  }
}
