import {
  useManageMovieLists,
  useUserLists,
} from "../features/movies/hooks/useMovies.ts";

export function WatchedPage() {
  const { data, isLoading } = useUserLists();
  const { removeMovie } = useManageMovieLists();

  if (isLoading) return <div>Loading history...</div>;

  const watchedItems = data?.watched || [];

  const totalHours = Math.round(watchedItems.length * 1.8);
  const totalVotes = watchedItems.reduce(
    (acc, curr) => acc + (curr.movieData?.vote_average || 0),
    0,
  );
  const avgRating = watchedItems.length
    ? (totalVotes / watchedItems.length).toFixed(1)
    : "-";

  return (
    <div className="page active">
      <div className="section-title">✅ Movies You've Watched</div>

      <div className="list-stats">
        <div className="stat-card">
          <div className="stat-num">{watchedItems.length}</div>
          <div className="stat-label">Movies Watched</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{totalHours}</div>
          <div className="stat-label">Approx. Watch Hours</div>
        </div>
        <div className="stat-card">
          <div className="stat-num">{avgRating}</div>
          <div className="stat-label">Average Rating</div>
        </div>
      </div>

      <div id="watched-list">
        {watchedItems.length === 0 ? (
          <div className="empty-list">
            <div className="empty-icon">🎬</div>
            <p>You haven't marked any movies as watched yet!</p>
          </div>
        ) : (
          watchedItems.map((item) => (
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
                  removeMovie({ movieId: item.movieId, listType: "watched" })
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
