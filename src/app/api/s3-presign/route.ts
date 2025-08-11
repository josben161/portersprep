import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { auth } from "@clerk/nextjs/server";

export async function GET() {
  // const { userId } = auth();
  // if (!userId) return new Response("Unauthorized", { status: 401 });
  const userId = "dummy-user-id"; // Temporary for build

  // Only initialize S3 client when function is called (not during build)
  const region = process.env.AWS_REGION;
  const bucket = process.env.S3_BUCKET;
  
  if (!region || !bucket) {
    return new Response("AWS configuration missing", { status: 500 });
  }

  const s3 = new S3Client({ region });
  const key = `${userId}/${crypto.randomUUID()}`;
  const cmd = new PutObjectCommand({ Bucket: bucket, Key: key });
  const url = await getSignedUrl(s3, cmd, { expiresIn: 300 });

  return Response.json({ url, key });
} 