import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  useManageMovieLists,
  useMovieBrowser,
  useUserLists,
} from "../features/movies/hooks/useMovies.ts";

export function HomePage() {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState<number | undefined>(undefined);
  const [year, setYear] = useState<number | undefined>(undefined);
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [sort, setSort] = useState("popularity.desc");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useMovieBrowser({
    page,
    genre,
    year,
    rating,
    sort,
    search: search || undefined,
  });

  const { data: userLists } = useUserLists();
  const { addMovie, removeMovie } = useManageMovieLists();

  const handleReset = () => {
    setSearch("");
    setGenre(undefined);
    setYear(undefined);
    setRating(undefined);
    setSort("popularity.desc");
    setPage(1);
  };

  if (isError)
    return <div className="error-state">⚠️ Failed to load movies.</div>;

  return (
    <div className="page active">
      <div className="hero-banner">
        <h1>
          Welcome to <span>CineVerse</span>
        </h1>
        <p>Discover top films, track them, and build your perfect watchlist</p>
      </div>

      <div className="section-title">🎬 Browse Movies</div>

      {/* Filters Bar */}
      <div className="filters-bar">
        <div className="filter-group">
          <label>Sort By</label>
          <select
            className="filter-select"
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
          >
            <option value="popularity.desc">Most Popular</option>
            <option value="vote_average.desc">Top Rated</option>
            <option value="primary_release_date.desc">Newest</option>
            <option value="primary_release_date.asc">Oldest</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Rating</label>
          <select
            className="filter-select"
            value={rating || ""}
            onChange={(e) => {
              setRating(e.target.value ? Number(e.target.value) : undefined);
              setPage(1);
            }}
          >
            <option value="">All</option>
            <option value="9">9+ ⭐</option>
            <option value="8">8+ ⭐</option>
            <option value="7">7+ ⭐</option>
            <option value="6">6+ ⭐</option>
          </select>
        </div>

        <button className="btn-reset" onClick={handleReset}>
          Reset
        </button>
      </div>

      {/* Movies Grid */}
      {isLoading ? (
        <div className="movies-grid">
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <div
                key={i}
                className="skel-card skeleton"
                style={{ height: "300px" }}
              />
            ))}
        </div>
      ) : (
        <div className="movies-grid">
          {data?.results.map((movie) => {
            const isWatched = userLists?.watched.some(
              (m) => m.movieId === movie.id,
            );
            const isWatchlisted = userLists?.watchlist.some(
              (m) => m.movieId === movie.id,
            );

            return (
              <Link
                key={movie.id}
                to="/movies/$movieId"
                params={{ movieId: String(movie.id) }}
                className="movie-card"
                style={{
                  position: "relative",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="movie-poster"
                />
                <div className="movie-info">
                  <div className="movie-title">{movie.title}</div>
                  <div className="movie-meta">
                    <span>{movie.release_date?.substring(0, 4) || "?"}</span>
                    <span className="movie-rating">
                      ⭐ {movie.vote_average.toFixed(1)}
                    </span>
                  </div>
                </div>
                <div className="card-actions">
                  <button
                    className={`card-btn btn-watched-card ${isWatched ? "active" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();

                      if (isWatched) {
                        void removeMovie({
                          movieId: movie.id,
                          listType: "watched",
                        });
                      } else {
                        void addMovie({
                          movieId: movie.id,
                          listType: "watched",
                          movieData: movie,
                        });
                      }
                    }}
                  >
                    {isWatched ? "✅" : "➕"}
                  </button>

                  <button
                    className={`card-btn btn-wl-card ${isWatchlisted ? "active" : ""}`}
                    disabled={isWatched}
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();

                      if (isWatchlisted) {
                        void removeMovie({
                          movieId: movie.id,
                          listType: "watchlist",
                        });
                      } else {
                        void addMovie({
                          movieId: movie.id,
                          listType: "watchlist",
                          movieData: movie,
                        });
                      }
                    }}
                  >
                    {isWatchlisted ? "🔖" : "🍿"}
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Pagination Footer */}
      {data && data.totalPages > 1 && (
        <div
          className="load-more-wrap"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "30px",
          }}
        >
          <button
            className="btn-reset"
            style={{ padding: "8px 16px" }}
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
          >
            Previous
          </button>
          <span
            style={{
              margin: "0 20px",
              color: "var(--text2)",
              fontSize: "0.9rem",
            }}
          >
            Page {page} of {data.totalPages}
          </span>
          <button
            className="btn-reset"
            style={{ padding: "8px 16px" }}
            disabled={page >= data.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
