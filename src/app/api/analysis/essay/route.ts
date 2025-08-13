import { auth } from "@clerk/nextjs/server";
import { requireAuthedProfile } from "@/lib/authz";
import { chatJson } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { profile } = await requireAuthedProfile();
    const { content, school_name, essay_title, essay_prompt, word_limit } = await req.json();
    
    if (!content || !school_name || !essay_title || !essay_prompt) {
      return new Response("Missing required fields", { status: 400 });
    }

    const analysisPrompt = `You are an expert MBA admissions consultant evaluating an essay for ${school_name}.

Essay Title: ${essay_title}
Essay Prompt: ${essay_prompt}
Word Limit: ${word_limit || 'No limit'}
Word Count: ${content.trim().split(/\s+/).filter(word => word.length > 0).length}

Please analyze this essay and provide:

1. A score out of 10
2. Specific feedback on strengths and weaknesses
3. Actionable suggestions for improvement
4. Assessment of how well it addresses the prompt
5. Evaluation of fit with the school's values and culture

Essay Content:
${content}

Provide your analysis in JSON format with the following structure:
{
  "score": number (1-10),
  "feedback": "detailed feedback on strengths and weaknesses",
  "suggestions": "specific actionable suggestions for improvement",
  "promptAlignment": "how well the essay addresses the prompt",
  "schoolFit": "assessment of fit with school values"
}`;

    const analysis = await chatJson(analysisPrompt);
    
    return Response.json(analysis);
  } catch (error) {
    console.error("Essay analysis error:", error);
    return new Response("Failed to analyze essay", { status: 500 });
  }
} 