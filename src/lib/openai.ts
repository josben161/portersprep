import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
          description: "Summary of user's current progress"
        },
        next_steps: {
          type: "array",
          items: { type: "string" },
          description: "Prioritized next steps for the user"
        },
        insights: {
          type: "array",
          items: { type: "string" },
          description: "Key insights about user's application strategy"
        }
      },
      required: ["progress_summary", "next_steps", "insights"]
    }
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
          description: "Essay writing suggestions"
        },
        structure_advice: {
          type: "string",
          description: "Advice on essay structure and flow"
        },
        content_ideas: {
          type: "array",
          items: { type: "string" },
          description: "Content ideas and themes to explore"
        }
      },
      required: ["suggestions", "structure_advice", "content_ideas"]
    }
  },
  {
    name: "search_web",
    description: "Search the internet for current information",
    parameters: {
      type: "object",
      properties: {
        search_query: {
          type: "string",
          description: "The search query to execute"
        },
        search_results: {
          type: "array",
          items: { type: "string" },
          description: "Summarized search results"
        }
      },
      required: ["search_query", "search_results"]
    }
  }
];

// Generate coach response with context
export async function generateCoachResponse(
  messages: any[],
  userContext: any,
  functions?: any[]
) {
  try {
    const systemMessage = {
      role: 'system' as const,
      content: `You are The Admit Coach, an AI assistant specializing in college applications. You have access to the user's profile, applications, essays, and recommendations.

Your role is to:
1. Provide personalized guidance based on the user's specific situation
2. Help with essay writing, application strategy, and school selection
3. Offer reassurance and motivation throughout the process
4. Direct users to relevant parts of their application they need to complete
5. Provide actionable next steps

User Context:
- Profile: ${JSON.stringify(userContext.profile || {})}
- Applications: ${JSON.stringify(userContext.applications || [])}
- Essays: ${JSON.stringify(userContext.essays || [])}
- Recommendations: ${JSON.stringify(userContext.recommendations || [])}

Be helpful, encouraging, and specific. Always provide actionable advice.`
    };

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [systemMessage, ...messages],
      functions: functions || coachFunctions,
      function_call: functions ? "auto" : undefined,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return response.choices[0];
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw error;
  }
}

// Simple web search simulation (placeholder for real search integration)
export async function searchWeb(query: string): Promise<string[]> {
  // TODO: Integrate with real search API in Phase 3
  return [
    `Search results for "${query}": This is a placeholder for real web search integration.`,
    `In a real implementation, this would search the internet for current information about ${query}.`
  ];
} 