import { useAuth } from "../hooks/useAuth.tsx";
import { useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { loginSchema } from "../features/auth/schemas/auth.schema.tsx";

export function LoginPage() {
  const { login, user, isLoggingIn } = useAuth();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (user) router.navigate({ to: "/" });
  }, [user, router]);

  const onSubmit = async (data: any) => {
    try {
      await login(data.email, data.password);
    } catch (err) {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Email</label>
            <input type="email" {...register("email")} />
            {errors.email && (
              <span className="error">{errors.email.message}</span>
            )}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" {...register("password")} />
            {errors.password && (
              <span className="error">{errors.password.message}</span>
            )}
          </div>
          <button type="submit" disabled={isLoggingIn} className="btn-primary">
            {isLoggingIn ? "Logging in..." : "Login"}
          </button>
        </form>
        <p>
          Don't have an account? <a href="/(auth)/register">Register</a>
        </p>
      </div>
    </div>
  );
}
