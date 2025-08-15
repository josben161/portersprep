// scripts/test-import-schools.ts
import fs from "fs";
import path from "path";

type Essay = {
  type: "short" | "long";
  title?: string;
  prompt: string;
  word_limit?: number;
  source_url?: string;
};

type SchoolJson = {
  id: string;
  name: string;
  country?: string;
  cycle: string; // e.g. "2025-2026"
  deadlines?: { round1?: string; round2?: string; round3?: string };
  essays?: Essay[];
  video_assessment?: { provider?: string; notes?: string };
  lor?: { count?: number; format?: string };
  verify_in_portal?: boolean;
  last_checked?: string;
  website?: string;
  location?: string;
  class_size?: number;
  acceptance_rate?: string;
  avg_gmat?: number;
  avg_gpa?: number;
  tuition?: string;
  application_fee?: string;
};

function cycleYear(label: string) {
  const m = label.match(/^(\d{4})/);
  return m ? parseInt(m[1], 10) : new Date().getFullYear();
}

function validateSchool(s: SchoolJson) {
  console.log(`Validating: ${s.name}`);
  console.log(`  ID: ${s.id}`);
  console.log(`  Cycle: ${s.cycle} (Year: ${cycleYear(s.cycle)})`);
  console.log(`  Essays: ${s.essays?.length || 0}`);
  console.log(`  Deadlines: ${Object.keys(s.deadlines || {}).length}`);

  if (s.essays) {
    s.essays.forEach((essay, i) => {
      console.log(
        `    Essay ${i + 1}: ${essay.type} - ${essay.word_limit || "no limit"} words`,
      );
    });
  }

  console.log("");
}

async function run() {
  const dir = process.argv[2] || "./schools-json";
  console.log(`Reading from directory: ${dir}`);

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
  console.log(`Found ${files.length} JSON files\n`);

  if (!files.length) {
    console.log(`No JSON files found in ${dir}`);
    return;
  }

  for (const f of files) {
    try {
      const s = JSON.parse(
        fs.readFileSync(path.join(dir, f), "utf8"),
      ) as SchoolJson;
      validateSchool(s);
    } catch (err) {
      console.error(`Error parsing ${f}:`, err);
    }
  }

  console.log("✅ All files validated successfully!");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
