-- Use UTF-8 properly
SET NAMES 'utf8mb4';
SET CHARACTER SET utf8mb4;

CREATE TABLE `users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `first_name` VARCHAR(255),
  `last_name` VARCHAR(255),
  `email` VARCHAR(255) UNIQUE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `accounts` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(255) UNIQUE,
  `password` VARCHAR(255),
  `user_id` INT,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `priority_levels` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255),
  `color` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `tasks` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT,
  `title` VARCHAR(255),
  `description` TEXT,
  `priority_id` INT,
  `deadline` DATETIME,
  `completed` BOOLEAN DEFAULT FALSE,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`priority_id`) REFERENCES `priority_levels`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `tags` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) UNIQUE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `task_tag` (
  `task_id` INT,
  `tag_id` INT,
  PRIMARY KEY (`task_id`, `tag_id`),
  FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`tag_id`) REFERENCES `tags`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `attachments` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `task_id` INT,
  `file_url` VARCHAR(255),
  `uploaded_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`task_id`) REFERENCES `tasks`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `backgrounds` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `image_url` VARCHAR(255),
  `label` VARCHAR(255)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_background` (
  `user_id` INT PRIMARY KEY,
  `background_id` INT,
  `set_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `accounts`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`background_id`) REFERENCES `backgrounds`(`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed data
INSERT INTO users (first_name, last_name, email)
VALUES
('Lam', 'Doanh', 'lamdoanh@example.com'),
('Nguyen', 'Thao', 'thaonguyen@example.com');

INSERT INTO accounts (username, password, user_id)
VALUES
('lamdoanh01', '12345678', 1),
('thaonguyen92', '12345678', 2);

INSERT INTO priority_levels (name, color)
VALUES
('High', '#FF0000'),
('Medium', '#FFA500'),
('Low', '#00BFFF');

INSERT INTO tasks (user_id, title, description, priority_id, deadline, completed)
VALUES
(1, 'Finish weekly report', 'Write and submit the report before Friday', 1, '2025-07-20 18:00:00', false),
(1, 'Reply to customer email', 'Respond to Mr. John''s email', 2, '2025-07-19 12:00:00', false),
(2, 'Prepare presentation slides', 'Slides for the group study session', 3, '2025-07-21 09:00:00', false);

INSERT INTO tags (name)
VALUES
('work'), ('urgent'), ('client'), ('school'), ('personal');

INSERT INTO task_tag (task_id, tag_id)
VALUES
(1, 1),  -- work
(1, 2),  -- urgent
(2, 1),  -- work
(2, 3),  -- client
(3, 4),  -- school
(3, 5);  -- personal

INSERT INTO attachments (task_id, file_url)
VALUES
(1, 'https://example.com/report.docx'),
(3, 'https://example.com/slides.pptx');

INSERT INTO backgrounds (image_url, label)
VALUES
('https://images.pexels.com/photo1.jpg', 'Nature Green'),
('https://images.pexels.com/photo2.jpg', 'Minimal Light'),
('https://images.pexels.com/photo3.jpg', 'Ocean Blue');

INSERT INTO user_background (user_id, background_id)
VALUES
(1, 1),
(2, 2);
