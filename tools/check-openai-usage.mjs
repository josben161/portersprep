import { execSync } from "node:child_process";

const pattern =
  /(openai\.(chat|responses)|createChatCompletion|https:\/\/api\.openai\.com)/i;
const ignore = new Set(["src/app/api/ai/gateway/route.ts", "src/lib/ai.ts"]);

const files = execSync(`git ls-files "**/*.ts" "**/*.tsx"`)
  .toString()
  .trim()
  .split("\n")
  .filter(Boolean);
const offenders = [];
for (const f of files) {
  if (ignore.has(f)) continue;
  try {
    const content = execSync(`sed -n '1,2000p' "${f}"`).toString();
    if (pattern.test(content)) offenders.push(f);
  } catch (error) {
    // File doesn't exist, skip it
    continue;
  }
}
if (offenders.length) {
  console.error("Forbidden OpenAI usage found outside gateway:");
  offenders.forEach((f) => console.error(" - " + f));
  process.exit(1);
}
