import { pgTable, text, serial, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const apps = pgTable("apps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  iconUrl: text("icon_url").notNull(),
  downloadLink: text("download_link").notNull(),
  downloadCount: integer("download_count").notNull().default(0),
});

export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  visitorCount: integer("visitor_count").notNull().default(0),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertAppSchema = createInsertSchema(apps).omit({ id: true });
export const insertUserSchema = createInsertSchema(users).omit({ id: true });

export type App = typeof apps.$inferSelect;
export type InsertApp = z.infer<typeof insertAppSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
