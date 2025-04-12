ALTER TABLE `users` ADD `currency_code` varchar(5) DEFAULT 'NGN';--> statement-breakpoint
ALTER TABLE `users` ADD `currency_symbol` varchar(5) DEFAULT '';--> statement-breakpoint
ALTER TABLE `users` ADD `currency_name` varchar(50) DEFAULT 'Naira';