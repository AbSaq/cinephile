import { Router } from "express";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  getUserLists,
  addToWatched,
  removeFromWatched,
  addToWatchlist,
  removeFromWatchlist,
} from "../controllers/moviesLists.controller";

const movieListsRoutes = Router();

// All routes require authentication
movieListsRoutes.use(authMiddleware);

// Get both lists
movieListsRoutes.get("/lists", getUserLists);

// Watched routes
movieListsRoutes.post("/watched/:movieId", addToWatched);
movieListsRoutes.delete("/watched/:movieId", removeFromWatched);

// Watchlist routes
movieListsRoutes.post("/watchlist/:movieId", addToWatchlist);
movieListsRoutes.delete("/watchlist/:movieId", removeFromWatchlist);

export default movieListsRoutes;
