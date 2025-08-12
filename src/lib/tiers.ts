export type Plan = "free" | "plus" | "pro";

export const PLAN_LIMITS: Record<Plan, {
  schools_max: number;
  essays_max: number | "unlimited";
  story_bank_max: number | "unlimited";
  variants_per_story_per_school: number | "unlimited";
  ai_calls_month: number | "unlimited"; // design + draft + analyze combined
  features: {
    analysis: "basic" | "advanced";
    coverage_heatmap: boolean;
    per_school_adaptation: boolean;
  };
}> = {
  free: {
    schools_max: 1,
    essays_max: 2,
    story_bank_max: 3,
    variants_per_story_per_school: 0,
    ai_calls_month: 5,
    features: { analysis: "basic", coverage_heatmap: false, per_school_adaptation: false }
  },
  plus: {
    schools_max: 3,
    essays_max: 10,
    story_bank_max: "unlimited",
    variants_per_story_per_school: 2,
    ai_calls_month: 200, // generous for drafting season
    features: { analysis: "advanced", coverage_heatmap: true, per_school_adaptation: true }
  },
  pro: {
    schools_max: 20,
    essays_max: "unlimited",
    story_bank_max: "unlimited",
    variants_per_story_per_school: "unlimited",
    ai_calls_month: "unlimited",
    features: { analysis: "advanced", coverage_heatmap: true, per_school_adaptation: true }
  }
}; 