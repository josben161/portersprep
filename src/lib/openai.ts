import OpenAI from 'openai';
import { searchWeb, searchCollegeInfo, searchCurrentEvents } from './web-search';

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
        search_type: {
          type: "string",
          enum: ["general", "college", "current_events"],
          description: "Type of search to perform"
        }
      },
      required: ["search_query", "search_type"]
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
6. Use web search when needed for current information

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

// Handle function calls
export async function handleFunctionCall(functionCall: any): Promise<string> {
  const { name, arguments: args } = functionCall;
  const parsedArgs = JSON.parse(args);

  switch (name) {
    case 'search_web':
      return await handleWebSearch(parsedArgs);
    case 'analyze_user_progress':
      return await handleProgressAnalysis(parsedArgs);
    case 'generate_essay_guidance':
      return await handleEssayGuidance(parsedArgs);
    default:
      return 'I processed your request but encountered an unknown function.';
  }
}

async function handleWebSearch(args: any): Promise<string> {
  const { search_query, search_type } = args;
  
  let results;
  switch (search_type) {
    case 'college':
      results = await searchCollegeInfo(search_query);
      break;
    case 'current_events':
      results = await searchCurrentEvents(search_query);
      break;
    default:
      results = await searchWeb(search_query);
  }

  if (results.length === 0) {
    return `I searched for "${search_query}" but couldn't find specific results. You might want to try a more specific search term.`;
  }

  const formattedResults = results.map((result, index) => 
    `${index + 1}. **${result.title}**\n${result.snippet}\nSource: ${result.url}`
  ).join('\n\n');

  return `Here's what I found for "${search_query}":\n\n${formattedResults}`;
}

async function handleProgressAnalysis(args: any): Promise<string> {
  const { progress_summary, next_steps, insights } = args;
  
  const formattedSteps = next_steps.map((step: string, index: number) => 
    `${index + 1}. ${step}`
  ).join('\n');

  const formattedInsights = insights.map((insight: string) => 
    `• ${insight}`
  ).join('\n');

  return `## Progress Analysis\n\n**Summary:** ${progress_summary}\n\n**Next Steps:**\n${formattedSteps}\n\n**Key Insights:**\n${formattedInsights}`;
}

async function handleEssayGuidance(args: any): Promise<string> {
  const { suggestions, structure_advice, content_ideas } = args;
  
  const formattedSuggestions = suggestions.map((suggestion: string, index: number) => 
    `${index + 1}. ${suggestion}`
  ).join('\n');

  const formattedIdeas = content_ideas.map((idea: string) => 
    `• ${idea}`
  ).join('\n');

  return `## Essay Guidance\n\n**Writing Suggestions:**\n${formattedSuggestions}\n\n**Structure Advice:**\n${structure_advice}\n\n**Content Ideas:**\n${formattedIdeas}`;
} 