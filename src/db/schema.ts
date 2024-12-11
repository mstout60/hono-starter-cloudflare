// db/schema.ts
import { pgTable, serial, text, doublePrecision } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name"),
  description: text("description"),
  price: doublePrecision("price"),
});

export const Users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username"),
});
