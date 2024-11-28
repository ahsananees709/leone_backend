import { mysqlTable, bigint, int, datetime } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { Product } from "./product.js";


export const ProductRanking = mysqlTable("da_nang_products_rankings", {
    item_id: bigint("item_id", { mode: "number" }).references(() => Product.item_id, { onDelete: 'cascade' }),
    created_at: datetime("created_at"),
    ranking: int("ranking"),
});
  
export const productRankingRelations = relations(ProductRanking, ({ one }) => ({
	product: one(Product, {
		fields: [ProductRanking.item_id],
		references: [Product.item_id],
	}),
}));
