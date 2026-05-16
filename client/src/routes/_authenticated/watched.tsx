import { createFileRoute } from "@tanstack/react-router";
import { WatchedPage } from "../../components/WatchedPage.tsx";

export const Route = createFileRoute("/_authenticated/watched")({
  component: WatchedPage,
});
