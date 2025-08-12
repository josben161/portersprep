import { getAdminSupabase } from "@/lib/supabaseAdmin";
import { PLAN_LIMITS, type Plan } from "./tiers";

/** Returns { plan, usage } using Supabase views. */
export async function getQuotaSnapshot(clerkUserId: string){
  const sb = getAdminSupabase();
  const { data: profile } = await sb.from("profiles").select("id, subscription_tier").eq("clerk_user_id", clerkUserId).single();
  if (!profile) throw new Error("profile-not-found");
  const plan = (profile.subscription_tier ?? "free") as Plan;

  const { data: usage } = await sb.from("v_usage_counts_secure").select("*").eq("user_id", profile.id).single();
  const limits = PLAN_LIMITS[plan];

  return { plan, profile_id: profile.id, limits, usage: usage ?? {
    user_id: profile.id,
    schools_count: 0, essays_count: 0, stories_count: 0, variants_count: 0, ai_calls_month: 0
  }};
}

/** Throws 402 if over limit; otherwise returns silently. */
export function assertWithinLimit(kind: "schools" | "essays" | "stories" | "variants" | "ai_calls", snapshot: any){
  const { limits, usage } = snapshot;

  if (kind === "schools") {
    if (usage.schools_count >= limits.schools_max) throwQuota("schools", limits.schools_max);
  }
  if (kind === "essays") {
    if (limits.essays_max !== "unlimited" && usage.essays_count >= limits.essays_max) throwQuota("essays", limits.essays_max);
  }
  if (kind === "stories") {
    if (limits.story_bank_max !== "unlimited" && usage.stories_count >= limits.story_bank_max) throwQuota("stories", limits.story_bank_max);
  }
  if (kind === "variants") {
    // Per-story-per-school limit enforced at creation time in API (we only allow creation if current count < limit)
    if (limits.variants_per_story_per_school === 0) throwQuota("variants", 0);
  }
  if (kind === "ai_calls") {
    if (limits.ai_calls_month !== "unlimited" && usage.ai_calls_month >= limits.ai_calls_month) throwQuota("ai", limits.ai_calls_month);
  }
}

function throwQuota(feature: string, limit: number | string){
  const body = JSON.stringify({ error: "upgrade_required", feature, limit });
  // 402 Payment Required: signals client to show upgrade modal
  throw new Response(body, { status: 402, headers: { "Content-Type": "application/json" } });
}

/** Convenience: log AI usage after a successful call */
export async function logAiUse(profileId: string, feature: "ai_design"|"ai_draft"|"ai_analyze"){
  const sb = getAdminSupabase();
  await sb.rpc("log_ai_usage", { p_user_id: profileId, p_feature: feature, p_delta: 1 });
} 