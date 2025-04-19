ALTER TABLE `country_currency` MODIFY COLUMN `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `credits` MODIFY COLUMN `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `debtors` MODIFY COLUMN `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `expenses` MODIFY COLUMN `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `invoices` MODIFY COLUMN `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `plans` MODIFY COLUMN `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `pricing` MODIFY COLUMN `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `products` MODIFY COLUMN `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `sales` MODIFY COLUMN `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `subscription_payments` MODIFY COLUMN `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `user_subscriptions` MODIFY COLUMN `updated_at` timestamp NOT NULL ON UPDATE CURRENT_TIMESTAMP;