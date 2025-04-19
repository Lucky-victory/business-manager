ALTER TABLE `account` MODIFY COLUMN `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `session` MODIFY COLUMN `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP;