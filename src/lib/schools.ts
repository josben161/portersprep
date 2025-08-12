import fs from "node:fs/promises";
import path from "node:path";

export type Essay = {
  type: "short" | "long";
  title: string;
  prompt: string;
  word_limit: number | null;
  source_url: string;
};

export type School = {
  id: string;
  name: string;
  country: string;
  cycle: string;
  essays: Essay[];
  video_assessment: { provider: string; notes?: string } | null;
  lor: { count: number; format: string } | null;
  verify_in_portal: boolean;
  last_checked: string;
};

const DATA_DIR = path.join(process.cwd(), "data", "schools");

export async function listSchoolsData(): Promise<Pick<School,"id"|"name">[]> {
  const files = await fs.readdir(DATA_DIR);
  return Promise.all(
    files.filter(f=>f.endsWith(".json")).map(async f=>{
      const json = JSON.parse(await fs.readFile(path.join(DATA_DIR,f),"utf8"));
      return { id: json.id, name: json.name };
    })
  );
}

export async function getSchoolData(id: string): Promise<School | null> {
  try {
    const json = JSON.parse(await fs.readFile(path.join(DATA_DIR, `${id}.json`), "utf8"));
    return json as School;
  } catch {
    return null;
  }
} 