import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { db } from "../db";
import { users, userMovies } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { hashPassword, verifyPassword } from "../utils/hash";
import { updateProfileSchema, changePasswordSchema } from "../schemas";

function getUserId(req: AuthRequest): number {
  if (!req.userId) {
    throw new Error("User ID not found in request");
  }
  return req.userId;
}

// Get user profile
export async function getProfile(req: AuthRequest, res: Response) {
  try {
    const userId = getUserId(req);

    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Get counts - using Promise.all for better performance
    const [watchedCount, watchlistCount] = await Promise.all([
      db.$count(
        userMovies,
        and(eq(userMovies.userId, userId), eq(userMovies.type, "watched")),
      ),
      db.$count(
        userMovies,
        and(eq(userMovies.userId, userId), eq(userMovies.type, "watchlist")),
      ),
    ]);

    res.json({
      ...user,
      stats: {
        watchedCount,
        watchlistCount,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    if (
      error instanceof Error &&
      error.message === "User ID not found in request"
    ) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
}

// Update profile
export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    const userId = getUserId(req);
    const validated = updateProfileSchema.parse(req.body);
    const { name } = validated;

    if (!name) {
      res.status(400).json({ error: "No fields to update" });
      return;
    }

    await db.update(users).set({ name }).where(eq(users.id, userId));

    const updatedUser = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Update profile error:", error);
    if (
      error instanceof Error &&
      error.message === "User ID not found in request"
    ) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
}

// Change password
export async function changePassword(req: AuthRequest, res: Response) {
  try {
    const userId = getUserId(req);
    const validated = changePasswordSchema.parse(req.body);
    const { currentPassword, newPassword } = validated;

    // Get user with password using findFirst
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    // Verify current password
    const isValid = await verifyPassword(currentPassword, user.password);
    if (!isValid) {
      res.status(401).json({ error: "Current password is incorrect" });
      return;
    }

    // Hash and save new password
    const hashedPassword = await hashPassword(newPassword);
    await db
      .update(users)
      .set({ password: hashedPassword })
      .where(eq(users.id, userId));

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    if (
      error instanceof Error &&
      error.message === "User ID not found in request"
    ) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
    res.status(500).json({ error: "Internal server error" });
  }
}
