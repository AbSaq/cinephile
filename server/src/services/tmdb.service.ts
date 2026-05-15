import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_IMG_URL = process.env.TMDB_IMG_URL;

if (!TMDB_API_KEY) {
  console.warn("⚠️ WARNING: TMDB_API_KEY not set in .env file");
}

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: "en-US",
  },
});

// Simple in-memory cache (5 minutes TTL)
interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getCachedOrFetch<T>(
  key: string,
  fetcher: () => Promise<T>,
): Promise<T> {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }

  const data = await fetcher();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}

export const tmdbService = {
  // Get popular movies (with pagination & filtering)
  async getMovies(params: {
    page?: number;
    genre?: number;
    year?: number;
    rating?: number;
    sort?: string;
    search?: string;
  }) {
    const {
      page = 1,
      genre,
      year,
      rating,
      sort = "popularity.desc",
      search,
    } = params;

    const cacheKey = `movies:${JSON.stringify(params)}`;

    return getCachedOrFetch(cacheKey, async () => {
      if (search) {
        const response = await tmdbApi.get("/search/movie", {
          params: {
            query: search,
            page,
            include_adult: false,
          },
        });
        return response.data;
      }

      const response = await tmdbApi.get("/discover/movie", {
        params: {
          page,
          sort_by: sort,
          with_genres: genre,
          primary_release_year: year,
          "vote_average.gte": rating,
          "vote_count.gte": 50,
        },
      });
      return response.data;
    });
  },

  // Get single movie details
  async getMovieById(id: number) {
    const cacheKey = `movie:${id}`;

    return getCachedOrFetch(cacheKey, async () => {
      const response = await tmdbApi.get(`/movie/${id}`, {
        params: {
          append_to_response: "credits,similar",
        },
      });
      return response.data;
    });
  },

  // Get genres list
  async getGenres() {
    const cacheKey = "genres";

    return getCachedOrFetch(cacheKey, async () => {
      const response = await tmdbApi.get("/genre/movie/list");
      return response.data.genres;
    });
  },

  // Helper to get full image URL
  getImageUrl(
    path: string | null,
    size:
      | "w92"
      | "w154"
      | "w185"
      | "w342"
      | "w500"
      | "w780"
      | "original" = "w500",
  ) {
    if (!path) return null;
    return `${TMDB_IMG_URL}/${size}${path}`;
  },
};
