import { createFileRoute, redirect } from "@tanstack/react-router";
import { LoginPage } from "../../components/LoginPage";
import { fetchCurrentUser } from "../../features/auth/hooks/useAuth";

export const Route = createFileRoute("/(auth)/login")({
  beforeLoad: async ({ context }) => {
    try {
      const user = await context.queryClient.ensureQueryData({
        queryKey: ["auth", "user"],
        queryFn: fetchCurrentUser,
      });

      // Bounces valid sessions back into the dashboard layout
      if (user) {
        throw redirect({ to: "/home" });
      }
    } catch (error) {
      if (error instanceof Error && error.name === "Redirect") throw error;

      context.queryClient.setQueryData(["auth", "user"], null);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    }
  },
  component: LoginPage,
});
