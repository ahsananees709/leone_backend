CREATE TABLE `da_nang_products` (
	`item_id` bigint NOT NULL,
	`name` varchar(255),
	`url` varchar(255),
	`created_at` datetime,
	`updated_at` datetime,
	CONSTRAINT `da_nang_products_item_id` PRIMARY KEY(`item_id`)
);
--> statement-breakpoint
CREATE TABLE `da_nang_products_rankings` (
	`item_id` bigint,
	`created_at` datetime,
	`ranking` int
);
--> statement-breakpoint
ALTER TABLE `da_nang_products_rankings` ADD CONSTRAINT `da_nang_products_rankings_item_id_da_nang_products_item_id_fk` FOREIGN KEY (`item_id`) REFERENCES `da_nang_products`(`item_id`) ON DELETE cascade ON UPDATE no action;