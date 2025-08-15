import { callGateway } from "@/lib/ai";

export interface ResumeAnalysis {
  summary: string;
  experience: {
    years: number;
    industries: string[];
    roles: string[];
    leadership: boolean;
    international: boolean;
  };
  education: {
    gpa?: number;
    major: string;
    institution: string;
    graduation_year: number;
    honors: string[];
  };
  skills: {
    technical: string[];
    leadership: string[];
    analytical: string[];
    communication: string[];
  };
  achievements: {
    quantifiable: string[];
    leadership: string[];
    awards: string[];
  };
  mbaReadiness: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
    fit_score: number; // 0-100
  };
  extractedData: {
    name: string;
    email: string;
    phone?: string;
    location?: string;
    linkedin?: string;
  };
}

export async function analyzeResume(
  resumeText: string,
  userId?: string,
): Promise<ResumeAnalysis> {
  try {
    const { content } = await callGateway("resume", {
      userId: userId || "anonymous",
      params: {
        resumeText,
        analysisType: "comprehensive",
      },
    });

    // Try to parse the JSON response
    let analysis: ResumeAnalysis;
    try {
      // First try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[1]);
      } else {
        // If no markdown, try direct JSON parsing
        analysis = JSON.parse(content);
      }
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Raw response that failed to parse:", content);
      throw new Error("Failed to parse AI response as JSON");
    }

    return analysis;
  } catch (error) {
    console.error("Resume analysis error:", error);

    // Return a basic analysis structure on error
    return {
      summary: "Unable to analyze resume at this time.",
      experience: {
        years: 0,
        industries: [],
        roles: [],
        leadership: false,
        international: false,
      },
      education: {
        major: "",
        institution: "",
        graduation_year: 0,
        honors: [],
      },
      skills: {
        technical: [],
        leadership: [],
        analytical: [],
        communication: [],
      },
      achievements: {
        quantifiable: [],
        leadership: [],
        awards: [],
      },
      mbaReadiness: {
        strengths: ["Resume analysis unavailable"],
        weaknesses: ["Unable to assess"],
        recommendations: ["Please ensure resume is properly formatted"],
        fit_score: 50,
      },
      extractedData: {
        name: "",
        email: "",
      },
    };
  }
}

export async function generateResumeInsights(
  analysis: ResumeAnalysis,
  targetSchools: string[],
  userId?: string,
): Promise<string[]> {
  try {
    const { content } = await callGateway("resume", {
      userId: userId || "anonymous",
      params: {
        analysis,
        targetSchools,
        insightType: "actionable",
      },
    });

    // Parse numbered list into array
    const insights = content
      .split("\n")
      .filter((line: string) => line.trim().match(/^\d+\./))
      .map((line: string) => line.replace(/^\d+\.\s*/, "").trim())
      .filter((insight: string) => insight.length > 0);

    return insights.length > 0
      ? insights
      : ["Unable to generate insights at this time."];
  } catch (error) {
    console.error("Resume insights generation error:", error);
    return ["Unable to generate insights at this time."];
  }
}

export function calculateMBAFitScore(analysis: ResumeAnalysis): number {
  let score = 50; // Base score

  // Experience factors
  if (analysis.experience.years >= 3) score += 10;
  if (analysis.experience.years >= 5) score += 5;
  if (analysis.experience.leadership) score += 10;
  if (analysis.experience.international) score += 5;
  if (analysis.experience.industries.length > 1) score += 5;

  // Education factors
  if (analysis.education.gpa && analysis.education.gpa >= 3.5) score += 10;
  if (analysis.education.honors.length > 0) score += 5;

  // Skills factors
  if (analysis.skills.leadership.length > 0) score += 5;
  if (analysis.skills.analytical.length > 0) score += 5;
  if (analysis.skills.technical.length > 0) score += 3;

  // Achievements factors
  if (analysis.achievements.quantifiable.length > 0) score += 10;
  if (analysis.achievements.leadership.length > 0) score += 5;
  if (analysis.achievements.awards.length > 0) score += 5;

  return Math.min(100, Math.max(0, score));
}
