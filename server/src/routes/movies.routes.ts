import { Router } from "express";
import {
  getMovies,
  getMovieById,
  getGenres,
} from "../controllers/movies.controller";

const router = Router();

// Public routes - anyone can browse movies
router.get("/", getMovies);
router.get("/genres", getGenres);
router.get("/:id", getMovieById);

export default router;
