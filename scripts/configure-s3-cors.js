import { S3Client, PutBucketCorsCommand } from "@aws-sdk/client-s3";

const s3 = new S3Client({ region: process.env.AWS_REGION });

const corsRules = [
  {
    AllowedHeaders: ["*"],
    AllowedMethods: ["GET", "PUT", "POST", "DELETE", "HEAD"],
    AllowedOrigins: [
      "https://The Admit Architect.vercel.app",
      "https://The Admit Architect.com",
      "http://localhost:3000",
    ],
    ExposeHeaders: ["ETag"],
    MaxAgeSeconds: 3000,
  },
];

async function configureCors() {
  try {
    console.log("Configuring CORS for S3 bucket:", process.env.S3_BUCKET);

    const command = new PutBucketCorsCommand({
      Bucket: process.env.S3_BUCKET,
      CORSConfiguration: {
        CORSRules: corsRules,
      },
    });

    await s3.send(command);
    console.log("✅ CORS configured successfully!");
    console.log("Allowed origins:", corsRules[0].AllowedOrigins);
  } catch (error) {
    console.error("❌ Failed to configure CORS:", error);
    console.log("\n📋 Manual CORS Configuration:");
    console.log("1. Go to AWS S3 Console");
    console.log("2. Select your bucket:", process.env.S3_BUCKET);
    console.log("3. Go to 'Permissions' tab");
    console.log("4. Click 'CORS configuration'");
    console.log("5. Add this JSON:");
    console.log(JSON.stringify(corsRules, null, 2));
  }
}

configureCors();
