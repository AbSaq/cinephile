import { createFileRoute } from "@tanstack/react-router";
import { MovieDetailView } from "../../components/MovieDetailView";

export const Route = createFileRoute("/_authenticated/movies/$movieId")({
  component: MovieDetailComponent,
});

// eslint-disable-next-line react-refresh/only-export-components
function MovieDetailComponent() {
  const { movieId } = Route.useParams();
  const intMovieId = parseInt(movieId, 10);

  if (isNaN(intMovieId)) {
    return <div className="error-state">⚠️ Invalid Movie ID format.</div>;
  }

  return <MovieDetailView movieId={intMovieId} />;
}
