import { SupabaseClient } from "@supabase/supabase-js";

export async function schools(db: SupabaseClient) {
  const { data, error } = await db.from("schools").select(`
      id, name, country, website, location,
      school_cycles ( id, intake_label, cycle_year, round, deadline_date ),
      school_cycle_stats ( cycle_year, avg_gmat, avg_gpa, class_size, acceptance_rate )
    `);
  if (error) throw error;
  return data ?? [];
}
