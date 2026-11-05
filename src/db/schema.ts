import { pgTable, serial, text, varchar, timestamp, integer } from "drizzle-orm/pg-core";

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
  // New Operational & Order Fields
  orderAmount: integer("order_amount").default(0),
  advanceAmount: integer("advance_amount").default(0),
  deliveryDate: varchar("delivery_date", { length: 40 }), // Target delivery date
  orderSource: varchar("order_source", { length: 50 }).default("Website Form"),
  measurements: text("measurements"), // Custom blouse stitching specs
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
  // New Editable Metadata
  price: varchar("price", { length: 60 }), // e.g. "₹4,500"
  tags: varchar("tags", { length: 255 }),  // e.g. "Bridal, Peacock, Zardosi"
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type GalleryImageRecord = typeof galleryImages.$inferSelect;
export type NewGalleryImageRecord = typeof galleryImages.$inferInsert;
