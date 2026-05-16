import { createFileRoute, redirect } from "@tanstack/react-router";
import { fetchCurrentUser } from "../../features/auth/hooks/useAuth";
import { AuthenticatedLayout } from "../../components/AuthenticatedLayout.tsx";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ context, location }) => {
    // eslint-disable-next-line no-useless-assignment
    let user = null;

    try {
      user = await context.queryClient.ensureQueryData({
        queryKey: ["auth", "user"],
        queryFn: fetchCurrentUser,
      });
    } catch (error) {
      if (error instanceof Error && error.name === "Redirect") throw error;
      user = null;
    }

    if (!user) {
      throw redirect({ to: "/login" });
    }

    if (location.pathname === "/") {
      throw redirect({ to: "/home" });
    }

    return { user };
  },
  component: AuthenticatedLayout,
});
