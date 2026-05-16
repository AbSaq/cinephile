import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../../../api/client";
import type { Movie, TMDBResponse, UserListsResponse } from "../../../types";

// Cache Keys
export const MOVIE_KEYS = {
  all: ["movies"] as const,
  lists: () => [...MOVIE_KEYS.all, "lists"] as const,
  browser: (filters: Record<string, any>) =>
    [...MOVIE_KEYS.all, "browser", filters] as const,
  detail: (id: number) => [...MOVIE_KEYS.all, "detail", id] as const,
};

// --- Queries ---

export function useMovieBrowser(filters: {
  page?: number;
  genre?: number;
  year?: number;
  rating?: number; // Added to match backend query parser
  sort?: string; // Added to match backend query parser
  search?: string;
}) {
  return useQuery<TMDBResponse<Movie>>({
    queryKey: MOVIE_KEYS.browser(filters),
    queryFn: async () => {
      // Axios passing filters as query parameters (?page=1&rating=8...)
      const { data } = await apiClient.get("/movies", { params: filters });
      return data;
    },
  });
}

export function useMovieDetail(id: number) {
  return useQuery<Movie>({
    queryKey: MOVIE_KEYS.detail(id),
    queryFn: async () => {
      const { data } = await apiClient.get(`/movies/${id}`);
      return data;
    },
    enabled: !isNaN(id),
  });
}

export function useUserLists() {
  return useQuery<UserListsResponse>({
    queryKey: MOVIE_KEYS.lists(),
    queryFn: async () => {
      const { data } = await apiClient.get("/user/lists");
      return data;
    },
  });
}

// --- Mutations ---

export function useManageMovieLists() {
  const queryClient = useQueryClient();

  const addMutation = useMutation({
    mutationFn: async ({
      movieId,
      listType,
      movieData,
    }: {
      movieId: number;
      listType: "watched" | "watchlist";
      movieData?: Partial<Movie>;
    }) => {
      const { data } = await apiClient.post(`/user/${listType}/${movieId}`, {
        movieData,
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MOVIE_KEYS.lists() });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async ({
      movieId,
      listType,
    }: {
      movieId: number;
      listType: "watched" | "watchlist";
    }) => {
      const { data } = await apiClient.delete(`/user/${listType}/${movieId}`);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MOVIE_KEYS.lists() });
    },
  });

  return {
    addMovie: addMutation.mutateAsync,
    isAdding: addMutation.isPending,
    removeMovie: removeMutation.mutateAsync,
    isRemoving: removeMutation.isPending,
  };
}
