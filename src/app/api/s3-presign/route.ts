import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
// import { auth } from "@clerk/nextjs/server";

const s3 = new S3Client({ region: process.env.AWS_REGION });

export async function GET() {
  // const { userId } = auth();
  // if (!userId) return new Response("Unauthorized", { status: 401 });
  const userId = "dummy-user-id"; // Temporary for build

  const key = `${userId}/${crypto.randomUUID()}`;
  const cmd = new PutObjectCommand({ Bucket: process.env.S3_BUCKET!, Key: key });
  const url = await getSignedUrl(s3, cmd, { expiresIn: 300 });

  return Response.json({ url, key });
} 