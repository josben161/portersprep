import { getAdminSupabase } from "@/lib/supabaseAdmin";
import * as providers from "./providers";

export type ContextScope = {
  profile?: boolean;
  applications?: boolean | { applicationId?: string };
  essays?: boolean | { applicationId?: string };
  recommendations?: boolean | { applicationId?: string };
  memory?: boolean;
  schools?: boolean;
};

export async function getContext(userId: string, scope: ContextScope) {
  const db = getAdminSupabase();

  const [profile, apps, essays, recs, mem, sch, prog] = await Promise.all([
    scope.profile ? providers.profile(db, userId) : null,
    scope.applications ? providers.applications(db, userId, scope) : null,
    scope.essays ? providers.essays(db, userId, scope) : null,
    scope.recommendations ? providers.recommendations(db, userId, scope) : null,
    scope.memory ? providers.memory(db, userId) : null,
    scope.schools ? providers.schools(db) : null,
    providers.progress(db, userId),
  ]);

  return {
    profile,
    applications: apps,
    essays,
    recommendations: recs,
    memory: mem,
    schools: sch,
    progress: prog,
  };
}
