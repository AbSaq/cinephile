import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Users table
export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  email: text("email").unique().notNull(),
  name: text("name").notNull(),
  password: text("password").notNull(), // bcrypt hashed
  role: text("role").default("user"), // 'user' | 'admin'
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

// User movies (watched & watchlist)
export const userMovies = sqliteTable("user_movies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  movieId: integer("movie_id").notNull(), // TMDB ID
  type: text("type").notNull(), // 'watched' | 'watchlist'

  // Cached movie metadata (saves TMDB API calls)
  movieData: text("movie_data", { mode: "json" }).$type<{
    title: string;
    poster_path: string | null;
    year: string;
    rating: number;
    genre_ids: number[];
  }>(),

  addedAt: integer("added_at", { mode: "timestamp" }).$defaultFn(
    () => new Date(),
  ),
});

// Export types for TypeScript
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type UserMovie = typeof userMovies.$inferSelect;
