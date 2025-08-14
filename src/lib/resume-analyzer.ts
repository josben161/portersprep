import OpenAI from "openai";

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
): Promise<ResumeAnalysis> {
  if (!isOpenAIAvailable()) {
    console.error("OpenAI API key not configured or client not initialized.");
    return {
      summary: "OpenAI API key not configured or client not initialized.",
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

  try {
    const systemPrompt = `You are an expert MBA admissions consultant analyzing a resume for MBA application readiness. 

Analyze the resume comprehensively and return a detailed JSON analysis focusing on:

1. **Experience Analysis**: Years of experience, industries, roles, leadership experience, international exposure
2. **Education**: GPA, major, institution, graduation year, honors
3. **Skills**: Technical, leadership, analytical, communication skills
4. **Achievements**: Quantifiable results, leadership accomplishments, awards
5. **MBA Readiness**: Strengths, weaknesses, specific recommendations, overall fit score (0-100)
6. **Extracted Data**: Basic contact and personal information

Focus on factors that impact MBA admissions:
- Leadership experience and progression
- Quantifiable achievements and impact
- Industry diversity and international exposure
- Academic performance and honors
- Technical and analytical skills
- Communication and teamwork abilities

Return only valid JSON.`;

    const userPrompt = `Please analyze this resume for MBA application readiness:

${resumeText}

Provide a comprehensive analysis in JSON format.`;

    const response = await openai!.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 2000,
    });

    const analysisText = response.choices[0]?.message?.content;
    if (!analysisText) {
      throw new Error("No analysis generated");
    }

    // Parse the JSON response
    const analysis: ResumeAnalysis = JSON.parse(analysisText);

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
): Promise<string[]> {
  if (!isOpenAIAvailable()) {
    console.error("OpenAI API key not configured or client not initialized.");
    return ["Unable to generate insights at this time."];
  }

  try {
    const systemPrompt = `You are an MBA admissions expert providing specific insights based on resume analysis and target schools.`;

    const userPrompt = `Based on this resume analysis:

${JSON.stringify(analysis, null, 2)}

And these target schools: ${targetSchools.join(", ")}

Provide 5-7 specific, actionable insights for improving MBA application chances. Focus on:
1. Resume improvements
2. Experience gaps to address
3. School-specific strategies
4. Timeline recommendations
5. Skill development priorities

Format as a numbered list.`;

    const response = await openai!.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const insightsText = response.choices[0]?.message?.content;
    if (!insightsText) {
      return ["Unable to generate insights at this time."];
    }

    // Parse numbered list into array
    const insights = insightsText
      .split("\n")
      .filter((line) => line.trim().match(/^\d+\./))
      .map((line) => line.replace(/^\d+\.\s*/, "").trim())
      .filter((insight) => insight.length > 0);

    return insights.length > 0
      ? insights
      : ["Unable to generate insights at this time."];
  } catch (error) {
    console.error("Resume insights generation error:", error);
    return ["Unable to generate insights at this time."];
  }
}

export function calculateMBAFitScore(analysis: ResumeAnalysis): number {
  if (!isOpenAIAvailable()) {
    console.error("OpenAI API key not configured or client not initialized.");
    return 50; // Return a default score if OpenAI is not available
  }

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
