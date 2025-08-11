// import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { getAdminSupabase } from "@/lib/supabaseAdmin";

const Input = z.object({
  resumeText: z.string().min(50),
  scores: z.object({ gmat: z.number().optional(), gre: z.object({ v: z.number(), q: z.number() }).optional() }).optional(),
  targets: z.array(z.string()).min(1),
  goals: z.string().min(10),
  constraints: z.string().optional()
});

export async function POST(req: Request) {
  // const { userId } = auth();
  // if (!userId) return new Response("Unauthorized", { status: 401 });
  const userId = "dummy-user-id"; // Temporary for build

  const json = await req.json();
  const parsed = Input.safeParse(json);
  if (!parsed.success) return new Response("Bad Request", { status: 400 });

  const supabase = getAdminSupabase();
  const { data: profile } = await supabase.from("profiles").select("id").eq("clerk_user_id", userId).single();

  const result = {
    bands: { ExampleSchool: "20–30%" },
    angles: ["Impact + Quant spike"],
    gaps: ["Math brushup"],
    timeline: ["Book quant refresher in 2 weeks"]
  };

  const { data, error } = await supabase
    .from("assessments")
    .insert({ user_id: profile!.id, inputs: parsed.data, result })
    .select("id").single();

  if (error) return new Response("DB error", { status: 500 });
  return Response.json({ assessmentId: data.id });
} 