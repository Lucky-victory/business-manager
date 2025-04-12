ALTER TABLE `users` MODIFY COLUMN `company_name` varchar(255);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `company_address` varchar(255);--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `company_phone` varchar(255);--> statement-breakpoint
CREATE INDEX `credits_debtor_id_idx` ON `credits` (`debtor_id`);--> statement-breakpoint
CREATE INDEX `credits_type_idx` ON `credits` (`type`);--> statement-breakpoint
CREATE INDEX `credits_item_idx` ON `credits` (`item`);--> statement-breakpoint
CREATE INDEX `credits_user_id_idx` ON `credits` (`user_id`);--> statement-breakpoint
CREATE INDEX `credits_is_paid_idx` ON `credits` (`is_paid`);--> statement-breakpoint
CREATE INDEX `credits_date_idx` ON `credits` (`date`);--> statement-breakpoint
CREATE INDEX `credits_invoice_id_idx` ON `credits` (`invoice_id`);--> statement-breakpoint
CREATE INDEX `credits_paid_date_idx` ON `credits` (`paid_date`);--> statement-breakpoint
CREATE INDEX `debtors_name_idx` ON `debtors` (`name`);--> statement-breakpoint
CREATE INDEX `debtors_email_idx` ON `debtors` (`email`);--> statement-breakpoint
CREATE INDEX `debtors_phone_idx` ON `debtors` (`phone`);--> statement-breakpoint
CREATE INDEX `debtors_created_at_idx` ON `debtors` (`created_at`);--> statement-breakpoint
CREATE INDEX `invoices_debtor_id_idx` ON `invoices` (`debtor_id`);--> statement-breakpoint
CREATE INDEX `invoices_status_idx` ON `invoices` (`status`);--> statement-breakpoint
CREATE INDEX `invoices_issue_date_idx` ON `invoices` (`issue_date`);--> statement-breakpoint
CREATE INDEX `invoices_due_date_idx` ON `invoices` (`due_date`);--> statement-breakpoint
CREATE INDEX `invoices_user_id_idx` ON `invoices` (`user_id`);--> statement-breakpoint
CREATE INDEX `invoices_invoice_number_idx` ON `invoices` (`invoice_number`);--> statement-breakpoint
CREATE INDEX `products_user_id_idx` ON `products` (`user_id`);--> statement-breakpoint
CREATE INDEX `products_name_idx` ON `products` (`name`);--> statement-breakpoint
CREATE INDEX `products_stock_quantity_idx` ON `products` (`stock_quantity`);--> statement-breakpoint
CREATE INDEX `sales_user_date_idx` ON `sales` (`user_id`,`date`);--> statement-breakpoint
CREATE INDEX `sales_user_id_idx` ON `sales` (`user_id`);--> statement-breakpoint
CREATE INDEX `sales_product_id_idx` ON `sales` (`product_id`);--> statement-breakpoint
CREATE INDEX `sales_item_idx` ON `sales` (`item`);--> statement-breakpoint
CREATE INDEX `sales_payment_type_idx` ON `sales` (`payment_type`);--> statement-breakpoint
CREATE INDEX `sales_quantity_idx` ON `sales` (`quantity`);--> statement-breakpoint
CREATE INDEX `sales_date_idx` ON `sales` (`date`);--> statement-breakpoint
CREATE INDEX `session_expires_at_idx` ON `session` (`expires_at`);--> statement-breakpoint
CREATE INDEX `session_user_id_idx` ON `session` (`user_id`);