export interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
  createdAt?: string;
}

export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  poster_url?: string;
  backdrop_url?: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
}

export interface UserMovie {
  id: number;
  userId: number;
  movieId: number;
  type: "watched" | "watchlist";
  movieData: {
    title: string;
    poster_path: string | null;
    year: string;
    rating: number;
    genre_ids: number[];
  };
  addedAt: string;
}

export interface AuthResponse {
  message: string;
  user: User;
  token: string;
}
