import {
  useMovieDetail,
  useManageMovieLists,
  useUserLists,
} from "../features/movies/hooks/useMovies";
import { Link } from "@tanstack/react-router";
import type { MovieDetail } from "../types";

interface MovieDetailViewProps {
  movieId: number;
}

// Helper
const formatRuntime = (minutes?: number) => {
  if (!minutes) return "?";
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
};

const formatCurrency = (amount?: number) => {
  if (!amount || amount === 0) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

export function MovieDetailView({ movieId }: MovieDetailViewProps) {
  const { data, isLoading, isError } = useMovieDetail(movieId);
  const movie = data as MovieDetail | undefined;
  const { data: userLists } = useUserLists();
  const { addMovie, removeMovie } = useManageMovieLists();

  if (isLoading)
    return (
      <div className="spinner-overlay show">
        <div className="spinner"></div>
      </div>
    );
  if (isError || !movie)
    return <div className="error-state">⚠️ Failed to load movie details.</div>;

  const isWatched = userLists?.watched.some((m) => m.movieId === movieId);
  const isWatchlisted = userLists?.watchlist.some((m) => m.movieId === movieId);

  return (
    <div
      className="modal-overlay open"
      style={{ position: "relative", background: "none", padding: 0 }}
    >
      <div
        className="modal"
        style={{ width: "100%", maxHeight: "none", transform: "none" }}
      >
        {/* Hero Section Banner */}
        <div className="modal-hero">
          {/* ✅ FIXED: Changed to "/home" to return to the active main workspace grid instead of root empty view */}
          <Link
            to="/home"
            className="modal-close"
            style={{ textDecoration: "none" }}
          >
            ✕
          </Link>
          <img
            className="modal-backdrop"
            src={
              movie.backdrop_url ||
              "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1025&auto=format&fit=crop"
            }
            alt={movie.title}
          />
          <div className="modal-hero-overlay"></div>
          <div className="modal-hero-content">
            <h1 className="modal-title">{movie.title}</h1>

            {/* ✅ ADDED: Movie Tagline */}
            {movie.tagline && (
              <p
                className="modal-tagline"
                style={{
                  fontStyle: "italic",
                  opacity: 0.8,
                  marginBottom: "10px",
                }}
              >
                "{movie.tagline}"
              </p>
            )}

            <div className="modal-meta">
              <span className="modal-tag tag-year">
                {movie.release_date?.substring(0, 4) || "?"}
              </span>
              <span className="modal-tag tag-rating">
                ⭐ {movie.vote_average?.toFixed(1) || "-"}
              </span>
              {/* ✅ ADDED: Runtime format tracker flag */}
              {movie.runtime && (
                <span className="modal-tag tag-runtime">
                  ⏱️ {formatRuntime(movie.runtime)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Overview Body */}
        <div
          className="modal-body"
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: "30px",
            marginTop: "20px",
          }}
        >
          {/* Left Column: Summary and Core info */}
          <div>
            <h3 style={{ marginBottom: "10px", color: "var(--text)" }}>
              Synopsis
            </h3>
            <p className="modal-overview" style={{ lineHeight: "1.6" }}>
              {movie.overview || "No overview available for this title."}
            </p>

            {/* Action List Row Updates */}
            <div className="modal-actions" style={{ marginTop: "24px" }}>
              <button
                className={`btn-action watched-btn ${isWatched ? "active" : ""}`}
                onClick={() => {
                  if (isWatched) {
                    void removeMovie({ movieId, listType: "watched" });
                  } else {
                    void addMovie({
                      movieId,
                      listType: "watched",
                      movieData: {
                        ...movie,
                        overview: movie.overview ?? "",
                      },
                    });
                  }
                }}
              >
                ✅ <span>{isWatched ? "Watched ✓" : "Add to Watched"}</span>
              </button>

              <button
                className={`btn-action watchlist-btn ${isWatchlisted ? "active" : ""}`}
                disabled={isWatched}
                onClick={() => {
                  if (isWatchlisted) {
                    void removeMovie({ movieId, listType: "watchlist" });
                  } else {
                    void addMovie({
                      movieId,
                      listType: "watchlist",
                      movieData: {
                        ...movie,
                        overview: movie.overview ?? "",
                      },
                    });
                  }
                }}
              >
                🔖{" "}
                <span>
                  {isWatchlisted ? "In Watchlist ✓" : "Add to Watchlist"}
                </span>
              </button>
            </div>
          </div>

          {/* Right Column: Meta details sidebar panel */}
          <div
            style={{
              background: "var(--bg3, rgba(255,255,255,0.03))",
              padding: "20px",
              borderRadius: "10px",
              border: "1px solid var(--border)",
            }}
          >
            {/* Genre Tokens */}
            {movie.genres && movie.genres.length > 0 && (
              <div style={{ marginBottom: "15px" }}>
                <h4
                  style={{
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                    color: "var(--text2)",
                    marginBottom: "5px",
                  }}
                >
                  Genres
                </h4>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                  {movie.genres.map((g: { id: number; name: string }) => (
                    <span
                      key={g.id}
                      style={{
                        background: "var(--bg2)",
                        border: "1px solid var(--border)",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "0.75rem",
                      }}
                    >
                      {g.name}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Financial tracking fields */}
            {movie.budget > 0 && (
              <div style={{ marginBottom: "12px" }}>
                <h4
                  style={{
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                    color: "var(--text2)",
                    marginBottom: "2px",
                  }}
                >
                  Budget
                </h4>
                <span style={{ fontSize: "0.95rem" }}>
                  {formatCurrency(movie.budget)}
                </span>
              </div>
            )}

            {movie.revenue > 0 && (
              <div>
                <h4
                  style={{
                    fontSize: "0.85rem",
                    textTransform: "uppercase",
                    color: "var(--text2)",
                    marginBottom: "2px",
                  }}
                >
                  Revenue
                </h4>
                <span
                  style={{
                    fontSize: "0.95rem",
                    color: movie.revenue > movie.budget ? "#4caf50" : "inherit",
                  }}
                >
                  {formatCurrency(movie.revenue)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
