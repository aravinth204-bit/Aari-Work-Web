import { pgTable, serial, text, varchar, timestamp } from "drizzle-orm/pg-core";

export const enquiries = pgTable("enquiries", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 120 }).notNull(),
  mobile: varchar("mobile", { length: 20 }).notNull(),
  workType: varchar("work_type", { length: 80 }).notNull(),
  functionDate: varchar("function_date", { length: 40 }),
  budget: varchar("budget", { length: 60 }),
  city: varchar("city", { length: 120 }),
  message: text("message"),
  adminNotes: text("admin_notes"),
  status: varchar("status", { length: 30 }).notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Enquiry = typeof enquiries.$inferSelect;
export type NewEnquiry = typeof enquiries.$inferInsert;

export const galleryImages = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  category: varchar("category", { length: 80 }).notNull(),
  imageUrl: text("image_url").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type GalleryImageRecord = typeof galleryImages.$inferSelect;
export type NewGalleryImageRecord = typeof galleryImages.$inferInsert;
