import OpenAI from "openai";
import {
  searchWeb,
  searchCollegeInfo,
  searchCurrentEvents,
} from "./web-search";
import { aiContextManager } from "./ai-context-manager";

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

// Coach system function definitions
export const coachFunctions = [
  {
    name: "analyze_user_progress",
    description: "Analyze user's application progress and provide insights",
    parameters: {
      type: "object",
      properties: {
        progress_summary: {
          type: "string",
          description: "Summary of user's current progress",
        },
        next_steps: {
          type: "array",
          items: { type: "string" },
          description: "Prioritized next steps for the user",
        },
        insights: {
          type: "array",
          items: { type: "string" },
          description: "Key insights about user's application strategy",
        },
      },
      required: ["progress_summary", "next_steps", "insights"],
    },
  },
  {
    name: "generate_essay_guidance",
    description: "Provide guidance for essay writing",
    parameters: {
      type: "object",
      properties: {
        suggestions: {
          type: "array",
          items: { type: "string" },
          description: "Essay writing suggestions",
        },
        structure_advice: {
          type: "string",
          description: "Advice on essay structure and flow",
        },
        content_ideas: {
          type: "array",
          items: { type: "string" },
          description: "Content ideas and themes to explore",
        },
      },
      required: ["suggestions", "structure_advice", "content_ideas"],
    },
  },
  {
    name: "search_web",
    description: "Search the internet for current information",
    parameters: {
      type: "object",
      properties: {
        search_query: {
          type: "string",
          description: "The search query to execute",
        },
        search_type: {
          type: "string",
          enum: ["general", "college", "current_events"],
          description: "Type of search to perform",
        },
      },
      required: ["search_query", "search_type"],
    },
  },
  {
    name: "analyze_resume",
    description: "Analyze user's resume and provide MBA-specific insights",
    parameters: {
      type: "object",
      properties: {
        strengths: {
          type: "array",
          items: { type: "string" },
          description: "Resume strengths for MBA applications",
        },
        weaknesses: {
          type: "array",
          items: { type: "string" },
          description: "Areas for improvement",
        },
        recommendations: {
          type: "array",
          items: { type: "string" },
          description: "Specific recommendations for resume improvement",
        },
      },
      required: ["strengths", "weaknesses", "recommendations"],
    },
  },
  {
    name: "generate_school_predictions",
    description: "Generate admission predictions for target schools",
    parameters: {
      type: "object",
      properties: {
        school_analysis: {
          type: "array",
          items: {
            type: "object",
            properties: {
              school_name: { type: "string" },
              admission_probability: { type: "number" },
              strengths: { type: "array", items: { type: "string" } },
              weaknesses: { type: "array", items: { type: "string" } },
              recommendations: { type: "array", items: { type: "string" } },
            },
          },
          description: "Analysis for each target school",
        },
      },
      required: ["school_analysis"],
    },
  },
];

// Generate coach response with comprehensive context
export async function generateCoachResponse(
  messages: any[],
  userContext: any,
  functions?: any[],
) {
  console.log("Checking OpenAI availability...");
  console.log("OpenAI client:", openai ? "initialized" : "not initialized");
  console.log("API key exists:", !!process.env.OPENAI_API_KEY);
  
  if (!isOpenAIAvailable()) {
    console.error("OpenAI not available - missing API key or client initialization");
    return {
      role: "assistant",
      content:
        "I apologize, but I am currently unable to process your request due to missing API key or OpenAI client initialization issues. Please try again later or contact support.",
    };
  }

  try {
    const systemMessage = {
      role: "system" as const,
      content: `You are The Admit Planner, an expert AI assistant specializing in MBA applications. You have comprehensive access to the user's profile, applications, essays, recommendations, resume analysis, and school data.

Your role is to:
1. Provide personalized, actionable guidance based on the user's specific situation
2. Help with essay writing, application strategy, and school selection
3. Offer reassurance and motivation throughout the process
4. Direct users to relevant parts of their application they need to complete
5. Provide specific, actionable next steps with timelines
6. Use web search when needed for current information
7. Analyze resume and provide MBA-specific insights
8. Generate realistic school predictions and improvement plans
9. Act as an onboarding assistant for new users

You have access to:
- User Profile: ${JSON.stringify(userContext.profile || {})}
- Applications: ${JSON.stringify(userContext.applications || [])}
- Essays: ${JSON.stringify(userContext.essays || [])}
- Recommendations: ${JSON.stringify(userContext.recommendations || [])}
- Resume Analysis: ${JSON.stringify(userContext.resume || {})}
- Schools Data: ${JSON.stringify(userContext.schools || [])}
- Progress Metrics: ${JSON.stringify(userContext.progress || {})}
- AI Memory: ${JSON.stringify(userContext.memory || [])}
- Conversation History: ${JSON.stringify(userContext.conversations || [])}

Guidelines:
- Be specific and actionable in all recommendations
- Reference specific data points from their profile
- Provide realistic timelines and expectations
- Consider their target schools and industry background
- Use their resume analysis to inform advice
- Remember previous conversations and preferences
- For new users, focus on onboarding and profile completion
- Always provide next steps and clear action items

Be encouraging, specific, and always provide actionable advice that moves them toward their MBA goals.`,
    };

    const response = await openai!.chat.completions.create({
      model: "gpt-4",
      messages: [systemMessage, ...messages],
      functions: functions || coachFunctions,
      function_call: functions ? "auto" : undefined,
      temperature: 0.7,
      max_tokens: 1500,
    });

    return response.choices[0];
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw error;
  }
}

// Handle function calls
export async function handleFunctionCall(
  functionCall: any,
  userId?: string,
): Promise<string> {
  if (!isOpenAIAvailable()) {
    return "I apologize, but I am currently unable to process your request due to missing API key or OpenAI client initialization issues. Please try again later or contact support.";
  }

  const { name, arguments: args } = functionCall;
  const parsedArgs = JSON.parse(args);

  switch (name) {
    case "search_web":
      return await handleWebSearch(parsedArgs);
    case "analyze_user_progress":
      return await handleProgressAnalysis(parsedArgs);
    case "generate_essay_guidance":
      return await handleEssayGuidance(parsedArgs);
    case "analyze_resume":
      return await handleResumeAnalysis(parsedArgs, userId);
    case "generate_school_predictions":
      return await handleSchoolPredictions(parsedArgs, userId);
    default:
      return "I processed your request but encountered an unknown function.";
  }
}

async function handleWebSearch(args: any): Promise<string> {
  const { search_query, search_type } = args;

  let results;
  switch (search_type) {
    case "college":
      results = await searchCollegeInfo(search_query);
      break;
    case "current_events":
      results = await searchCurrentEvents(search_query);
      break;
    default:
      results = await searchWeb(search_query);
  }

  if (results.length === 0) {
    return `I searched for "${search_query}" but couldn't find specific results. You might want to try a more specific search term.`;
  }

  const formattedResults = results
    .map(
      (result, index) =>
        `${index + 1}. **${result.title}**\n${result.snippet}\nSource: ${result.url}`,
    )
    .join("\n\n");

  return `Here's what I found for "${search_query}":\n\n${formattedResults}`;
}

async function handleProgressAnalysis(args: any): Promise<string> {
  const { progress_summary, next_steps, insights } = args;

  const formattedSteps = next_steps
    .map((step: string, index: number) => `${index + 1}. ${step}`)
    .join("\n");

  const formattedInsights = insights
    .map((insight: string) => `• ${insight}`)
    .join("\n");

  return `## Progress Analysis\n\n**Summary:** ${progress_summary}\n\n**Next Steps:**\n${formattedSteps}\n\n**Key Insights:**\n${formattedInsights}`;
}

async function handleEssayGuidance(args: any): Promise<string> {
  const { suggestions, structure_advice, content_ideas } = args;

  const formattedSuggestions = suggestions
    .map((suggestion: string, index: number) => `${index + 1}. ${suggestion}`)
    .join("\n");

  const formattedIdeas = content_ideas
    .map((idea: string) => `• ${idea}`)
    .join("\n");

  return `## Essay Guidance\n\n**Writing Suggestions:**\n${formattedSuggestions}\n\n**Structure Advice:**\n${structure_advice}\n\n**Content Ideas:**\n${formattedIdeas}`;
}

async function handleResumeAnalysis(
  args: any,
  userId?: string,
): Promise<string> {
  const { strengths, weaknesses, recommendations } = args;

  const formattedStrengths = strengths
    .map((strength: string) => `• ${strength}`)
    .join("\n");

  const formattedWeaknesses = weaknesses
    .map((weakness: string) => `• ${weakness}`)
    .join("\n");

  const formattedRecommendations = recommendations
    .map((rec: string, index: number) => `${index + 1}. ${rec}`)
    .join("\n");

  let message = `## Resume Analysis\n\n**Strengths:**\n${formattedStrengths}\n\n**Areas for Improvement:**\n${formattedWeaknesses}\n\n**Recommendations:**\n${formattedRecommendations}`;

  // Store this analysis in memory for future reference
  if (userId) {
    await aiContextManager.storeMemory(userId, {
      memory_type: "analysis",
      content: {
        type: "resume_analysis",
        strengths,
        weaknesses,
        recommendations,
        timestamp: new Date().toISOString(),
      },
      context: { source: "planner_function_call" },
    });
  }

  return message;
}

async function handleSchoolPredictions(
  args: any,
  userId?: string,
): Promise<string> {
  const { school_analysis } = args;

  let message = `## School Predictions\n\n`;

  school_analysis.forEach((school: any, index: number) => {
    message += `### ${school.school_name}\n`;
    message += `**Admission Probability:** ${school.admission_probability}%\n\n`;

    message += `**Strengths:**\n`;
    school.strengths.forEach((strength: string) => {
      message += `• ${strength}\n`;
    });

    message += `\n**Areas for Improvement:**\n`;
    school.weaknesses.forEach((weakness: string) => {
      message += `• ${weakness}\n`;
    });

    message += `\n**Recommendations:**\n`;
    school.recommendations.forEach((rec: string, recIndex: number) => {
      message += `${recIndex + 1}. ${rec}\n`;
    });

    message += `\n---\n\n`;
  });

  // Store predictions in memory
  if (userId) {
    await aiContextManager.storeMemory(userId, {
      memory_type: "prediction",
      content: {
        type: "school_predictions",
        predictions: school_analysis,
        timestamp: new Date().toISOString(),
      },
      context: { source: "planner_function_call" },
    });
  }

  return message;
}
