import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../features/auth/hooks/useAuth";
import { loginSchema } from "../features/auth/schemas/auth.schema.ts";
import type { z } from "zod";

type FormData = z.infer<typeof loginSchema>;

export function LoginPage() {
  const { login, isLoggingIn } = useAuth();
  const navigate = useNavigate(); // Standard imperative hook for event handlers

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: FormData) => {
    try {
      await login({ email: data.email, password: data.password });
      navigate({ to: "/home" });
    } catch {
      setError("root", { message: "Invalid email or password credentials." });
    }
  };

  return (
    <div id="auth-page" className="auth-container">
      <div className="auth-box">
        <div className="auth-logo">
          <div className="logo-text">CineVerse</div>
          <p>Discover, track, and enjoy the world of cinema</p>
        </div>

        {errors.root && (
          <span
            className="error"
            style={{ marginBottom: "12px", textAlign: "center" }}
          >
            {errors.root.message}
          </span>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="example@email.com"
              {...register("email")}
            />
            {errors.email && (
              <span className="error">{errors.email.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && (
              <span className="error">{errors.password.message}</span>
            )}
          </div>

          <button type="submit" disabled={isLoggingIn} className="btn-primary">
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>
        </form>

        <p
          style={{
            textAlign: "center",
            marginTop: "20px",
            color: "var(--text2)",
            fontSize: "0.88rem",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "var(--accent)",
              textDecoration: "none",
              fontWeight: "600",
            }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
