import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || "none";
const JWT_EXPIRES_IN = "7d";

if (!process.env.JWT_SECRET) {
  console.warn("⚠️ WARNING: Using fallback JWT secret. Set JWT_SECRET in .env");
}

export function generateToken(userId: number, email: string): string {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): { userId: number; email: string } {
  return jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
}
