import { callGateway } from "@/lib/ai";

export interface SchoolPrediction {
  school_id: string;
  school_name: string;
  admission_probability: number; // 0-100
  confidence_level: "low" | "medium" | "high";
  strengths: string[];
  weaknesses: string[];
  fit_analysis: string;
  recommendations: string[];
  data_points: {
    gpa_match: boolean;
    gmat_match: boolean;
    experience_match: boolean;
    industry_match: boolean;
    leadership_match: boolean;
  };
}

export interface ImprovementPlan {
  short_term: string[]; // 0-3 months
  medium_term: string[]; // 3-6 months
  long_term: string[]; // 6+ months
  priority_actions: string[];
  timeline: string;
  estimated_impact: string;
}

export async function generateSchoolPredictions(
  userId: string,
  schoolIds: string[],
): Promise<SchoolPrediction[]> {
  try {
    const { content } = await callGateway("predict", {
      userId,
      params: {
        schoolIds,
        predictionType: "detailed",
      },
    });

    // Parse the response to extract predictions
    let predictions: SchoolPrediction[];
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        predictions = JSON.parse(jsonMatch[1]);
      } else {
        predictions = JSON.parse(content);
      }
    } catch (parseError) {
      console.error("Failed to parse predictions:", parseError);
      return [];
    }

    return predictions;
  } catch (error) {
    console.error("Error generating school predictions:", error);
    return [];
  }
}

export async function generateImprovementPlan(
  userId: string,
  predictions: SchoolPrediction[],
): Promise<ImprovementPlan> {
  try {
    const { content } = await callGateway("predict", {
      userId,
      params: {
        predictions,
        planType: "improvement",
      },
    });

    // Parse the response to extract improvement plan
    let plan: ImprovementPlan;
    try {
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        plan = JSON.parse(jsonMatch[1]);
      } else {
        plan = JSON.parse(content);
      }
    } catch (parseError) {
      console.error("Failed to parse improvement plan:", parseError);
      return {
        short_term: ["Complete profile information"],
        medium_term: ["Focus on essay development"],
        long_term: ["Build leadership experience"],
        priority_actions: ["Unable to generate plan"],
        timeline: "Timeline unavailable",
        estimated_impact: "Impact assessment unavailable",
      };
    }

    return {
      short_term: plan.short_term || [],
      medium_term: plan.medium_term || [],
      long_term: plan.long_term || [],
      priority_actions: plan.priority_actions || [],
      timeline: plan.timeline || "Timeline unavailable",
      estimated_impact:
        plan.estimated_impact || "Impact assessment unavailable",
    };
  } catch (error) {
    console.error("Error generating improvement plan:", error);

    return {
      short_term: ["Complete profile information"],
      medium_term: ["Focus on essay development"],
      long_term: ["Build leadership experience"],
      priority_actions: ["Unable to generate plan"],
      timeline: "Timeline unavailable",
      estimated_impact: "Impact assessment unavailable",
    };
  }
}

export function calculateOverallAdmissionProbability(
  predictions: SchoolPrediction[],
): number {
  if (predictions.length === 0) return 0;

  const totalProbability = predictions.reduce(
    (sum, pred) => sum + pred.admission_probability,
    0,
  );
  return Math.round(totalProbability / predictions.length);
}

export function getConfidenceLevel(
  predictions: SchoolPrediction[],
): "low" | "medium" | "high" {
  if (predictions.length === 0) return "low";

  const confidenceCounts = {
    low: 0,
    medium: 0,
    high: 0,
  };

  predictions.forEach((pred) => {
    confidenceCounts[pred.confidence_level]++;
  });

  if (
    confidenceCounts.high > confidenceCounts.medium &&
    confidenceCounts.high > confidenceCounts.low
  ) {
    return "high";
  } else if (confidenceCounts.medium > confidenceCounts.low) {
    return "medium";
  } else {
    return "low";
  }
}
