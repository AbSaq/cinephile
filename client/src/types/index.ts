export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
  stats?: {
    watchedCount: number;
    watchlistCount: number;
  };
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  release_date: string;
  genre_ids: number[];
  poster_path: string;
  backdrop_path: string;
  poster_url: string;
  backdrop_url: string;
  vote_average: number;
  vote_count: number;
}

export interface TMDBResponse<T> {
  results: T[];
  page: number;
  totalPages: number;
  totalResults: number;
}

export interface UserMovieRow {
  id: number;
  userId: number;
  movieId: number;
  type: "watched" | "watchlist";
  movieData: Partial<Movie> | null;
  createdAt: string;
}

export interface UserListsResponse {
  watched: UserMovieRow[];
  watchlist: UserMovieRow[];
}

export interface MovieGenre {
  id: number;
  name: string;
}

export interface MovieDetail {
  id: number;
  title: string;
  overview: string | null;
  poster_url?: string;
  backdrop_url?: string;
  release_date?: string;
  vote_average: number;
  tagline?: string | null;
  runtime?: number | null;
  genres?: MovieGenre[];
  budget: number;
  revenue: number;
}
