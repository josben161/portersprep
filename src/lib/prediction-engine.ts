import OpenAI from "openai";
import { aiContextManager } from "./ai-context-manager";
import { ResumeAnalysis } from "./resume-analyzer";

// Initialize OpenAI client only on server side with proper error handling
let openai: OpenAI | null = null;

if (typeof window === "undefined" && process.env.OPENAI_API_KEY) {
  try {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  } catch (error) {
    console.error("Failed to initialize OpenAI client:", error);
  }
}

// Helper function to check if OpenAI is available
function isOpenAIAvailable(): boolean {
  return openai !== null && process.env.OPENAI_API_KEY !== undefined;
}

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
  if (!isOpenAIAvailable()) {
    console.warn("OpenAI not available, returning empty predictions");
    return [];
  }

  try {
    const context = await aiContextManager.getUserContext(userId);
    const resumeAnalysis = context.resume?.resume_analysis;

    const predictions: SchoolPrediction[] = [];

    for (const schoolId of schoolIds) {
      const school = context.schools.find((s) => s.id === schoolId);
      if (!school) continue;

      const prediction = await analyzeSchoolFit(
        context,
        school,
        resumeAnalysis,
      );
      predictions.push(prediction);
    }

    return predictions;
  } catch (error) {
    console.error("Error generating school predictions:", error);
    return [];
  }
}

async function analyzeSchoolFit(
  context: any,
  school: any,
  resumeAnalysis?: ResumeAnalysis,
): Promise<SchoolPrediction> {
  if (!isOpenAIAvailable()) {
    // Return a default prediction when OpenAI is not available
    return {
      school_id: school.id,
      school_name: school.name,
      admission_probability: 50,
      confidence_level: "low",
      strengths: ["Profile data available"],
      weaknesses: ["AI analysis unavailable"],
      fit_analysis:
        "AI analysis is currently unavailable. Please complete your profile for better insights.",
      recommendations: ["Complete your profile with more details"],
      data_points: {
        gpa_match: false,
        gmat_match: false,
        experience_match: false,
        industry_match: false,
        leadership_match: false,
      },
    };
  }

  try {
    const systemPrompt = `You are an expert MBA admissions consultant analyzing a candidate's fit for a specific business school. 

Analyze the candidate's profile against the school's characteristics and return a detailed prediction in JSON format.

Consider:
- Academic profile (GPA, GMAT, institution)
- Work experience (years, industry, leadership)
- Extracurricular activities and achievements
- School's typical class profile
- School's industry preferences
- Geographic and demographic factors

Return JSON with:
- admission_probability (0-100)
- confidence_level (low/medium/high)
- strengths (array of specific strengths)
- weaknesses (array of specific weaknesses)
- fit_analysis (detailed explanation)
- recommendations (array of specific actions)
- data_points (boolean flags for key factors)`;

    const userPrompt = `Analyze this candidate's fit for ${school.name}:

CANDIDATE PROFILE:
- GPA: ${context.profile.gpa || "Not provided"}
- GMAT: ${context.profile.gmat || "Not provided"}
- Years of Experience: ${context.profile.years_exp || "Not provided"}
- Industry: ${context.profile.industry || "Not provided"}
- Academic Background: ${context.profile.academic_interests || "Not provided"}
- Extracurriculars: ${context.profile.extracurriculars || "Not provided"}

RESUME ANALYSIS:
${resumeAnalysis ? JSON.stringify(resumeAnalysis, null, 2) : "Not available"}

SCHOOL CHARACTERISTICS:
${JSON.stringify(school, null, 2)}

Provide a detailed prediction in JSON format.`;

    const response = await openai!.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const predictionText = response.choices[0]?.message?.content;
    if (!predictionText) {
      throw new Error("No prediction generated");
    }

    const prediction = JSON.parse(predictionText);

    return {
      school_id: school.id,
      school_name: school.name,
      admission_probability: prediction.admission_probability || 50,
      confidence_level: prediction.confidence_level || "medium",
      strengths: prediction.strengths || [],
      weaknesses: prediction.weaknesses || [],
      fit_analysis: prediction.fit_analysis || "Analysis unavailable",
      recommendations: prediction.recommendations || [],
      data_points: prediction.data_points || {
        gpa_match: false,
        gmat_match: false,
        experience_match: false,
        industry_match: false,
        leadership_match: false,
      },
    };
  } catch (error) {
    console.error("Error analyzing school fit:", error);

    return {
      school_id: school.id,
      school_name: school.name,
      admission_probability: 50,
      confidence_level: "low",
      strengths: ["Analysis unavailable"],
      weaknesses: ["Unable to assess"],
      fit_analysis: "Unable to analyze fit at this time.",
      recommendations: ["Please ensure all profile data is complete"],
      data_points: {
        gpa_match: false,
        gmat_match: false,
        experience_match: false,
        industry_match: false,
        leadership_match: false,
      },
    };
  }
}

export async function generateImprovementPlan(
  userId: string,
  predictions: SchoolPrediction[],
): Promise<ImprovementPlan> {
  if (!isOpenAIAvailable()) {
    console.warn("OpenAI not available, returning default improvement plan");
    return {
      short_term: ["Complete your profile with more details"],
      medium_term: ["Focus on essay development and school research"],
      long_term: ["Build leadership experience and strengthen application"],
      priority_actions: [
        "AI analysis unavailable - complete profile for personalized plan",
      ],
      timeline: "Timeline unavailable",
      estimated_impact: "Impact assessment unavailable",
    };
  }

  try {
    const context = await aiContextManager.getUserContext(userId);

    const systemPrompt = `You are an expert MBA admissions consultant creating a comprehensive improvement plan for a candidate. 

Based on the school predictions and candidate profile, create a detailed action plan with:
- Short-term actions (0-3 months)
- Medium-term actions (3-6 months) 
- Long-term actions (6+ months)
- Priority actions (most impactful)
- Timeline recommendations
- Estimated impact on admission chances

Focus on actionable, specific recommendations.`;

    const userPrompt = `Create an improvement plan for this candidate:

CANDIDATE PROFILE:
${JSON.stringify(context.profile, null, 2)}

SCHOOL PREDICTIONS:
${JSON.stringify(predictions, null, 2)}

RESUME ANALYSIS:
${context.resume?.resume_analysis ? JSON.stringify(context.resume.resume_analysis, null, 2) : "Not available"}

Provide a comprehensive improvement plan in JSON format.`;

    const response = await openai!.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const planText = response.choices[0]?.message?.content;
    if (!planText) {
      throw new Error("No improvement plan generated");
    }

    const plan = JSON.parse(planText);

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
