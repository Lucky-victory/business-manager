CREATE TABLE `expenses` (
	`id` varchar(36) NOT NULL,
	`item` varchar(255) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`payment_type` varchar(50) NOT NULL,
	`category` varchar(100),
	`notes` text,
	`date` timestamp NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	`user_id` varchar(36) NOT NULL,
	CONSTRAINT `expenses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `expenses` ADD CONSTRAINT `expenses_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `expenses_user_id_idx` ON `expenses` (`user_id`);--> statement-breakpoint
CREATE INDEX `expenses_date_idx` ON `expenses` (`date`);--> statement-breakpoint
CREATE INDEX `expenses_payment_type_idx` ON `expenses` (`payment_type`);--> statement-breakpoint
CREATE INDEX `expenses_category_idx` ON `expenses` (`category`);