import { createFileRoute, redirect } from "@tanstack/react-router";
import { fetchCurrentUser } from "../hooks/useAuth"; // export helper
import { AuthenticatedLayout } from "../components/AuthenticatedLayout.tsx";

export const Route = createFileRoute("/_authenticated")({
  loader: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData({
      queryKey: ["auth", "user"],
      queryFn: fetchCurrentUser,
    });
    if (!user) throw redirect({ to: "/login" });
    return { user };
  },
  component: AuthenticatedLayout,
});
