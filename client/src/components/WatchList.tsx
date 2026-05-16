import {
  useManageMovieLists,
  useUserLists,
} from "../features/movies/hooks/useMovies.ts";

export function WatchlistPage() {
  const { data, isLoading } = useUserLists();
  const { removeMovie } = useManageMovieLists();

  if (isLoading) return <div>Loading watchlist...</div>;

  const watchlistItems = data?.watchlist || [];
  const expectedHours = Math.round(watchlistItems.length * 1.8);

  return (
    <div className="page active">
      <div className="section-title">🔖 Your Watchlist</div>

      <div className="list-stats">
        <div className="stat-card">
          <div className="stat-num">{watchlistItems.length}</div>
          <div className="stat-label">In Watchlist</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{expectedHours}</div>
          <div className="stat-label">Expected Hours</div>
        </div>
      </div>

      <div id="watchlist-list">
        {watchlistItems.length === 0 ? (
          <div className="empty-list">
            <div className="empty-icon">🔖</div>
            <p>Your watchlist is empty! Add movies from the home page.</p>
          </div>
        ) : (
          watchlistItems.map((item) => (
            <div key={item.id} className="list-movie-row">
              <img
                src={item.movieData?.poster_url}
                alt={item.movieData?.title}
                className="list-poster"
              />
              <div className="list-movie-info">
                <div className="list-movie-title">{item.movieData?.title}</div>
                <div className="list-movie-meta">
                  <span>
                    ⭐ {item.movieData?.vote_average?.toFixed(1) || "-"}
                  </span>
                </div>
              </div>
              <button
                className="btn-remove"
                onClick={() =>
                  removeMovie({ movieId: item.movieId, listType: "watchlist" })
                }
              >
                Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
