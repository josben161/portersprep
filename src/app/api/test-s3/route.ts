import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const envCheck = {
    AWS_REGION: !!process.env.AWS_REGION,
    S3_BUCKET: !!process.env.S3_BUCKET,
    AWS_ACCESS_KEY_ID: !!process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: !!process.env.AWS_SECRET_ACCESS_KEY,
  };

  console.log("S3 Environment check:", envCheck);

  return Response.json({
    message: "S3 environment check",
    configured: envCheck,
    missing: Object.entries(envCheck)
      .filter(([_, present]) => !present)
      .map(([key]) => key),
  });
}
