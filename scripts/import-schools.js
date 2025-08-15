"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
// scripts/import-schools.ts
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const supabase_js_1 = require("@supabase/supabase-js");
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE) {
  throw new Error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY env.",
  );
}
const supabase = (0, supabase_js_1.createClient)(
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE,
);
function cycleYear(label) {
  const m = label.match(/^(\d{4})/);
  return m ? parseInt(m[1], 10) : new Date().getFullYear();
}
async function upsertSchool(s) {
  // schools
  const { data: school, error: e1 } = await supabase
    .from("schools")
    .upsert(
      {
        ext_id: s.id,
        name: s.name,
        country: s.country ?? null,
        website: s.website ?? null,
        location: s.location ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "ext_id" },
    )
    .select()
    .single();
  if (e1 || !school)
    throw e1 ?? new Error(`Failed school upsert for ${s.name}`);
  // per-year stats
  const year = cycleYear(s.cycle);
  const { error: eStats } = await supabase.from("school_cycle_stats").upsert(
    {
      school_id: school.id,
      cycle_year: year,
      class_size: s.class_size ?? null,
      acceptance_rate: s.acceptance_rate ?? null,
      avg_gmat: s.avg_gmat ?? null,
      avg_gpa: s.avg_gpa ?? null,
      tuition: s.tuition ?? null,
      application_fee: s.application_fee ?? null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "school_id,cycle_year" },
  );
  if (eStats) throw eStats;
  // cycles (one row per provided deadline)
  const rounds = [
    ["round1", s.deadlines?.round1],
    ["round2", s.deadlines?.round2],
    ["round3", s.deadlines?.round3],
  ];
  for (const [round, deadline] of rounds) {
    if (!deadline) continue;
    const { data: cycle, error: e2 } = await supabase
      .from("school_cycles")
      .upsert(
        {
          school_id: school.id,
          intake_label: s.cycle,
          cycle_year: year,
          round,
          deadline_date: deadline,
          video_provider: s.video_assessment?.provider ?? null,
          video_notes: s.video_assessment?.notes ?? null,
          lor_count: s.lor?.count ?? null,
          lor_format: s.lor?.format ?? null,
          verify_in_portal: s.verify_in_portal ?? null,
          last_checked: s.last_checked ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "school_id,cycle_year,round" },
      )
      .select()
      .single();
    if (e2 || !cycle)
      throw e2 ?? new Error(`Failed cycle upsert for ${s.name} ${round}`);
    // questions (essays)
    for (const e of s.essays ?? []) {
      const { error: e3 } = await supabase.from("questions").upsert(
        {
          school_cycle_id: cycle.id,
          title: e.title ?? null,
          prompt: e.prompt,
          type: e.type,
          word_limit: e.word_limit ?? null,
          source_url: e.source_url ?? null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "school_cycle_id,prompt" },
      );
      if (e3) throw e3;
    }
  }
}
async function run() {
  const dir = process.argv[2] || "./schools-json";
  const files = fs_1.default
    .readdirSync(dir)
    .filter((f) => f.endsWith(".json"));
  if (!files.length) {
    console.log(`No JSON files found in ${dir}`);
    return;
  }
  for (const f of files) {
    const s = JSON.parse(
      fs_1.default.readFileSync(path_1.default.join(dir, f), "utf8"),
    );
    await upsertSchool(s);
    console.log(`Imported: ${s.name}`);
  }
}
run().catch((err) => {
  console.error(err);
  process.exit(1);
});
