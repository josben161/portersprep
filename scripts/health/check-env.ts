#!/usr/bin/env tsx

const requiredEnvVars = [
  "NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY",
  // Note: CLERK_SECRET_KEY is now handled by backend service
  "NEXT_PUBLIC_SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "OPENAI_API_KEY",
  "STRIPE_SECRET_KEY",
  "STRIPE_WEBHOOK_SECRET",
  "STRIPE_PRICE_PLUS",
  "STRIPE_PRICE_PRO",
  "AWS_REGION",
  "S3_BUCKET",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "EMAIL_FROM",
  "RESEND_API_KEY",
  "NEXT_PUBLIC_APP_URL",
];

const missing: string[] = [];

for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    missing.push(key);
  }
}

if (missing.length > 0) {
  console.error("❌ Missing environment variables:");
  missing.forEach((key) => console.error(`  - ${key}`));
  process.exit(1);
}

console.log("✅ All required environment variables are present");
process.exit(0);
