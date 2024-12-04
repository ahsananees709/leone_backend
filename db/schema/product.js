import { mysqlTable, bigint, varchar, datetime } from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { ProductRanking } from "./productRanking.js";

export const Product = mysqlTable("da_nang_products", {
  item_id: bigint("item_id", { mode: "number" }).primaryKey(),
  name: varchar("name", { length: 255 }),
  url: varchar("url", { length: 255 }),
  created_at: datetime("created_at"),
  updated_at: datetime("updated_at"),
});


export const productRelations = relations(Product, ({ many }) => ({
    rankings: many(ProductRanking),
}));