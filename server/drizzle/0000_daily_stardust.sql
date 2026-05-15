CREATE TABLE `user_movies`
(
    `id`         integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    `user_id`    integer NOT NULL,
    `movie_id`   integer NOT NULL,
    `type`       text    NOT NULL,
    `movie_data` text,
    `added_at`   integer,
    FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users`
(
    `id`         integer PRIMARY KEY AUTOINCREMENT NOT NULL,
    `email`      text NOT NULL,
    `name`       text NOT NULL,
    `password`   text NOT NULL,
    `role`       text DEFAULT 'user',
    `created_at` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);