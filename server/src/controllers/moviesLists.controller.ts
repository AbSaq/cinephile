import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { db } from "../db";
import { userMovies } from "../db/schema";
import { eq, and } from "drizzle-orm";

// ============ HELPERS (DRY - Don't Repeat Yourself) ============

function getUserId(req: AuthRequest): number {
  if (!req.userId) throw new Error("Unauthorized");
  return req.userId;
}

function getMovieId(req: AuthRequest): number {
  const movieId = req.params.movieId;
  if (typeof movieId !== "string") {
    throw new Error("Invalid movie ID");
  }
  const id = parseInt(movieId, 10);
  if (isNaN(id)) {
    throw new Error("Invalid movie ID format");
  }
  return id;
}

async function checkExists(
  userId: number,
  movieId: number,
  type: "watched" | "watchlist",
): Promise<boolean> {
  const existing = await db
    .select()
    .from(userMovies)
    .where(
      and(
        eq(userMovies.userId, userId),
        eq(userMovies.movieId, movieId),
        eq(userMovies.type, type),
      ),
    );
  return existing.length > 0;
}

async function removeFromList(
  userId: number,
  movieId: number,
  type: "watched" | "watchlist",
): Promise<void> {
  await db
    .delete(userMovies)
    .where(
      and(
        eq(userMovies.userId, userId),
        eq(userMovies.movieId, movieId),
        eq(userMovies.type, type),
      ),
    );
}

function handleError(error: unknown, res: Response): void {
  console.error("Error:", error);

  if (error instanceof Error) {
    switch (error.message) {
      case "Unauthorized":
        res.status(401).json({ error: "Unauthorized" });
        return;
      case "Invalid movie ID":
      case "Invalid movie ID format":
        res.status(400).json({ error: error.message });
        return;
    }
  }
  res.status(500).json({ error: "Internal server error" });
}

// ============ CONTROLLERS (Clean and DRY) ============

// Get both lists
export async function getUserLists(req: AuthRequest, res: Response) {
  try {
    const userId = getUserId(req);

    const [watched, watchlist] = await Promise.all([
      db
        .select()
        .from(userMovies)
        .where(
          and(eq(userMovies.userId, userId), eq(userMovies.type, "watched")),
        ),
      db
        .select()
        .from(userMovies)
        .where(
          and(eq(userMovies.userId, userId), eq(userMovies.type, "watchlist")),
        ),
    ]);

    res.json({ watched, watchlist });
  } catch (error) {
    handleError(error, res);
  }
}

// Generic function to add to any list
async function addToList(
  req: AuthRequest,
  res: Response,
  type: "watched" | "watchlist",
) {
  try {
    const userId = getUserId(req);
    const movieId = getMovieId(req);
    const { movieData } = req.body;

    // Check if already in this list
    const exists = await checkExists(userId, movieId, type);
    if (exists) {
      res.status(400).json({ error: `Movie already in ${type} list` });
      return;
    }

    // If adding to watched, remove from watchlist (common UX pattern)
    if (type === "watched") {
      await removeFromList(userId, movieId, "watchlist");
    }

    // Add to the list
    await db.insert(userMovies).values({
      userId,
      movieId,
      type,
      movieData: movieData || null,
    });

    res.status(201).json({ message: `Added to ${type}` });
  } catch (error) {
    handleError(error, res);
  }
}

// Generic function to remove from any list
async function removeFromListController(
  req: AuthRequest,
  res: Response,
  type: "watched" | "watchlist",
) {
  try {
    const userId = getUserId(req);
    const movieId = getMovieId(req);

    await removeFromList(userId, movieId, type);

    res.json({ message: `Removed from ${type}` });
  } catch (error) {
    handleError(error, res);
  }
}

// ============ EXPORTED ROUTE HANDLERS ============

export const addToWatched = (req: AuthRequest, res: Response) =>
  addToList(req, res, "watched");
export const removeFromWatched = (req: AuthRequest, res: Response) =>
  removeFromListController(req, res, "watched");
export const addToWatchlist = (req: AuthRequest, res: Response) =>
  addToList(req, res, "watchlist");
export const removeFromWatchlist = (req: AuthRequest, res: Response) =>
  removeFromListController(req, res, "watchlist");
