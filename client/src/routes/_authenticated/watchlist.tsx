import { createFileRoute } from "@tanstack/react-router";
import { WatchlistPage } from "../../components/WatchList.tsx";

export const Route = createFileRoute("/_authenticated/watchlist")({
  component: WatchlistPage,
});
