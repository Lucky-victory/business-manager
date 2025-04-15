CREATE TABLE `country_currency` (
	`country_code` char(2) NOT NULL,
	`name` varchar(100) NOT NULL,
	`currency_code` char(3) NOT NULL,
	`currency_symbol` varchar(10) NOT NULL,
	`currency_name` varchar(100) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `country_currency_country_code` PRIMARY KEY(`country_code`)
);
--> statement-breakpoint
CREATE TABLE `plans` (
	`id` varchar(36) NOT NULL,
	`name` varchar(50) NOT NULL,
	`description` varchar(255),
	`is_active` boolean NOT NULL DEFAULT true,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `plans_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `pricing` (
	`id` varchar(36) NOT NULL,
	`country_code` char(2) NOT NULL,
	`plan_id` varchar(36) NOT NULL,
	`monthly_price` decimal(10,2) NOT NULL,
	`features` json NOT NULL,
	`yearly_price` decimal(10,2) NOT NULL,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `pricing_id` PRIMARY KEY(`id`),
	CONSTRAINT `unique_pricing` UNIQUE(`country_code`,`plan_id`)
);
--> statement-breakpoint
CREATE TABLE `subscription_payments` (
	`id` varchar(36) NOT NULL,
	`subscription_id` varchar(36) NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`currency` char(3) NOT NULL,
	`status` varchar(20) NOT NULL,
	`payment_method` varchar(50),
	`payment_date` timestamp NOT NULL,
	`metadata` json,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `subscription_payments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_subscriptions` (
	`id` varchar(36) NOT NULL,
	`user_id` varchar(36) NOT NULL,
	`pricing_id` varchar(36) NOT NULL,
	`start_date` timestamp NOT NULL,
	`end_date` timestamp,
	`is_active` boolean NOT NULL DEFAULT true,
	`canceled_at` timestamp,
	`billing_cycle` varchar(20) NOT NULL,
	`auto_renew` boolean NOT NULL DEFAULT true,
	`payment_method` varchar(50),
	`last_payment_date` timestamp,
	`next_billing_date` timestamp,
	`created_at` timestamp NOT NULL DEFAULT (now()),
	`updated_at` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `pricing` ADD CONSTRAINT `pricing_country_code_country_currency_country_code_fk` FOREIGN KEY (`country_code`) REFERENCES `country_currency`(`country_code`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `pricing` ADD CONSTRAINT `pricing_plan_id_plans_id_fk` FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `subscription_payments` ADD CONSTRAINT `subscription_payments_subscription_id_user_subscriptions_id_fk` FOREIGN KEY (`subscription_id`) REFERENCES `user_subscriptions`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_subscriptions` ADD CONSTRAINT `user_subscriptions_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `user_subscriptions` ADD CONSTRAINT `user_subscriptions_pricing_id_pricing_id_fk` FOREIGN KEY (`pricing_id`) REFERENCES `pricing`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `country_currency_currency_code_idx` ON `country_currency` (`currency_code`);--> statement-breakpoint
CREATE INDEX `country_currency_country_name_idx` ON `country_currency` (`name`);--> statement-breakpoint
CREATE INDEX `plan_name_idx` ON `plans` (`name`);--> statement-breakpoint
CREATE INDEX `plan_is_active_idx` ON `plans` (`is_active`);--> statement-breakpoint
CREATE INDEX `pricing_country_code_idx` ON `pricing` (`country_code`);--> statement-breakpoint
CREATE INDEX `pricing_plan_id_idx` ON `pricing` (`plan_id`);--> statement-breakpoint
CREATE INDEX `payment_subscription_id_idx` ON `subscription_payments` (`subscription_id`);--> statement-breakpoint
CREATE INDEX `payment_status_idx` ON `subscription_payments` (`status`);--> statement-breakpoint
CREATE INDEX `payment_date_idx` ON `subscription_payments` (`payment_date`);--> statement-breakpoint
CREATE INDEX `user_subscription_user_id_idx` ON `user_subscriptions` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_subscription_pricing_id_idx` ON `user_subscriptions` (`pricing_id`);--> statement-breakpoint
CREATE INDEX `user_subscription_is_active_idx` ON `user_subscriptions` (`is_active`);--> statement-breakpoint
CREATE INDEX `user_subscription_next_billing_date_idx` ON `user_subscriptions` (`next_billing_date`);