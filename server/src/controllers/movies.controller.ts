import { Request, Response } from "express";
import { tmdbService } from "../services/tmdb.service";

export async function getMovies(req: Request, res: Response) {
  try {
    const page = req.query.page ? parseInt(req.query.page as string) : 1;
    const genre = req.query.genre
      ? parseInt(req.query.genre as string)
      : undefined;
    const year = req.query.year
      ? parseInt(req.query.year as string)
      : undefined;
    const rating = req.query.rating
      ? parseInt(req.query.rating as string)
      : undefined;
    const sort = req.query.sort as string | undefined;
    const search = req.query.search as string | undefined;

    const data = await tmdbService.getMovies({
      page,
      genre,
      year,
      rating,
      sort,
      search,
    });

    // Add image URLs to each movie
    const results = data.results?.map((movie: any) => ({
      ...movie,
      poster_url: tmdbService.getImageUrl(movie.poster_path, "w342"),
      backdrop_url: tmdbService.getImageUrl(movie.backdrop_path, "w780"),
    }));

    res.json({
      results,
      page: data.page,
      totalPages: data.total_pages,
      totalResults: data.total_results,
    });
  } catch (error) {
    console.error("Get movies error:", error);
    res.status(500).json({ error: "Failed to fetch movies from TMDB" });
  }
}

export async function getMovieById(req: Request, res: Response) {
  try {
    // Get the id parameter and ensure it's a string
    const idParam = req.params.id;

    // Check if it's an array (edge case, but TypeScript requires it)
    if (Array.isArray(idParam)) {
      res.status(400).json({ error: "Invalid movie ID format" });
      return;
    }

    const id = parseInt(idParam);

    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid movie ID" });
      return;
    }

    const movie = await tmdbService.getMovieById(id);

    const enrichedMovie = {
      ...movie,
      poster_url: tmdbService.getImageUrl(movie.poster_path, "w500"),
      backdrop_url: tmdbService.getImageUrl(movie.backdrop_path, "original"),
    };

    res.json(enrichedMovie);
  } catch (error) {
    console.error("Get movie by ID error:", error);
    res.status(500).json({ error: "Failed to fetch movie from TMDB" });
  }
}

export async function getGenres(req: Request, res: Response) {
  try {
    const genres = await tmdbService.getGenres();
    res.json(genres);
  } catch (error) {
    console.error("Get genres error:", error);
    res.status(500).json({ error: "Failed to fetch genres" });
  }
}
