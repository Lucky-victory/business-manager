CREATE TABLE `user_usage` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`year` int NOT NULL,
	`month` int NOT NULL,
	`sales_count` int NOT NULL DEFAULT 0,
	`credits_count` int NOT NULL DEFAULT 0,
	`expenses_count` int NOT NULL DEFAULT 0,
	`invoices_count` int NOT NULL DEFAULT 0,
	`storage_used` int NOT NULL DEFAULT 0,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_usage_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_user_month` UNIQUE(`user_id`,`year`,`month`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `is_onboarding_complete` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `user_usage` ADD CONSTRAINT `user_usage_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `user_usage_user_id_idx` ON `user_usage` (`user_id`);