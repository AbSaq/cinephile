import { z } from "zod";

// Auth schemas
export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const updateProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
});

// Movie filter schemas (for TanStack Router type-safety)
export const movieFiltersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  genre: z.coerce.number().int().optional(),
  year: z.coerce.number().int().min(1900).max(2025).optional(),
  rating: z.coerce.number().min(0).max(10).optional(),
  sort: z
    .enum(["popularity.desc", "vote_average.desc", "release_date.desc"])
    .default("popularity.desc"),
  search: z.string().optional(),
});

export type MovieFilters = z.infer<typeof movieFiltersSchema>;
