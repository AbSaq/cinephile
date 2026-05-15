import { createFileRoute, redirect, Link } from "@tanstack/react-router";
import { useAuth, fetchCurrentUser } from "../../hooks/useAuth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Route = createFileRoute("/(auth)/register")({
  beforeLoad: async () => {
    const user = await fetchCurrentUser();
    if (user) {
      throw redirect({
        to: "/",
      });
    }
  },
  component: RegisterPage,
});

function RegisterPage() {
  const { register: registerUser, isRegistering } = useAuth();
  const navigate = Route.useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser(data);
      navigate({ to: "/" });
    } catch {
      setError("root", {
        type: "manual",
        message: "Registration failed. Please try again.",
      });
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Register</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          {errors.root && (
            <div className="error-summary">{errors.root.message}</div>
          )}

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" type="text" {...register("name")} />
            {errors.name && (
              <span className="error">{errors.name.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" type="email" {...register("email")} />
            {errors.email && (
              <span className="error">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" type="password" {...register("password")} />
            {errors.password && (
              <span className="error">{errors.password.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isRegistering}
            className="btn-primary"
          >
            {isRegistering ? "Creating account..." : "Register"}
          </button>
        </form>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
