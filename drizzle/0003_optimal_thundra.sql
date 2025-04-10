ALTER TABLE `sales` ADD `measurement_unit` varchar(50);--> statement-breakpoint
ALTER TABLE `sales` ADD `updated_at` timestamp DEFAULT (now()) NOT NULL;