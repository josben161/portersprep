import crypto from "node:crypto";

export function newToken(len = 32) {
  return crypto.randomBytes(len).toString("base64url");
}
export function hashPasscode(pass?: string | null) {
  if (!pass) return null;
  return crypto.createHash("sha256").update(pass).digest("hex");
}
