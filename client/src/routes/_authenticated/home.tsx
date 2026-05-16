import { createFileRoute } from "@tanstack/react-router";
import { HomePage } from "../../components/HomePage.tsx";

export const Route = createFileRoute("/_authenticated/home")({
  component: HomePage,
});
