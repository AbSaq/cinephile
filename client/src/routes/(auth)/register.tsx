import { createFileRoute, redirect } from "@tanstack/react-router";
import { RegisterPage } from "../../components/RegisterPage.tsx";
import { fetchCurrentUser } from "../../features/auth/hooks/useAuth";

export const Route = createFileRoute("/(auth)/register")({
  beforeLoad: async ({ context }) => {
    try {
      // Safely inspect your query cache first
      const user = await context.queryClient.ensureQueryData({
        queryKey: ["auth", "user"],
        queryFn: fetchCurrentUser,
      });

      // If they are already logged in, push them away to /home
      if (user) {
        throw redirect({ to: "/home" });
      }
    } catch (error) {
      // Let TanStack Router redirects pass through
      if (error instanceof Error && error.name === "Redirect") throw error;

      // Fail silently for unauthenticated users so they can access the form!
    }
  },
  component: RegisterPage,
});
