import { createFileRoute } from "@tanstack/react-router";
import { ProfilePage } from "../../components/Profile.tsx";

export const Route = createFileRoute("/_authenticated/profile")({
  component: ProfilePage,
});
