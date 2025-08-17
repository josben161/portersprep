import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  // Only allow in development or with a secret key
  if (process.env.NODE_ENV === 'production' && req.nextUrl.searchParams.get('key') !== process.env.DEBUG_SECRET) {
    return NextResponse.json({ error: "Not authorized" }, { status: 401 });
  }

  const envCheck = {
    supabase: {
      url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      anonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      serviceKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    openai: {
      apiKey: !!process.env.OPENAI_API_KEY,
    },
    aws: {
      region: !!process.env.AWS_REGION,
      bucket: !!process.env.S3_BUCKET,
    },
    app: {
      url: process.env.NEXT_PUBLIC_APP_URL,
      vercelUrl: process.env.VERCEL_URL,
    },
    nodeEnv: process.env.NODE_ENV,
  };

  return NextResponse.json(envCheck);
}
