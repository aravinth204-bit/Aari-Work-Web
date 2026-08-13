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
  status: varchar("status", { length: 30 }).notNull().default("new"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type Enquiry = typeof enquiries.$inferSelect;
export type NewEnquiry = typeof enquiries.$inferInsert;
