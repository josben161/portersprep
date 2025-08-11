import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

const ddb = DynamoDBDocumentClient.from(new DynamoDBClient({ region: process.env.AWS_REGION }));

export const LIMITS = {
  free: { assessment_runs: 1, essay_docs: 1, redline_runs: 3 },
  plus: { assessment_runs: 3, essay_docs: 5, redline_runs: 20 },
  pro:  { assessment_runs: -1, essay_docs: 20, redline_runs: 100 }
} as const;

export async function checkAndIncrement(
  userId: string,
  feature: keyof typeof LIMITS["free"],
  tier: keyof typeof LIMITS
) {
  const month = new Date().toISOString().slice(0,7).replace("-", "");
  const featureMonth = `${feature}#${month}`;
  const limit = LIMITS[tier][feature];
  if (limit === -1) return true;

  const existing = await ddb.send(new GetCommand({ TableName: process.env.DYNAMODB_TABLE!, Key: { userId, featureMonth } }));
  const next = (existing.Item?.count ?? 0) + 1;
  if (next > limit) return false;

  const expireAt = Math.floor(new Date(new Date().getFullYear(), new Date().getMonth()+1, 1).getTime()/1000);
  await ddb.send(new UpdateCommand({
    TableName: process.env.DYNAMODB_TABLE!,
    Key: { userId, featureMonth },
    UpdateExpression: "SET #c = :c, expireAt = :e",
    ExpressionAttributeNames: { "#c": "count" },
    ExpressionAttributeValues: { ":c": next, ":e": expireAt }
  }));
  return true;
} 