import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const projects = sqliteTable("projects", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  archivedAt: integer("archived_at", { mode: "timestamp" }),
  link1Url: text("link1_url"),
  link1Label: text("link1_label"),
  link2Url: text("link2_url"),
  link2Label: text("link2_label"),
  link3Url: text("link3_url"),
  link3Label: text("link3_label"),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export const issues = sqliteTable("issues", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", { enum: ["backlog", "todo", "in_progress", "done"] })
    .notNull()
    .default("backlog"),
  priority: text("priority", { enum: ["none", "low", "medium", "high", "urgent"] })
    .notNull()
    .default("none"),
  projectId: text("project_id").references(() => projects.id, { onDelete: "set null" }),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  archivedAt: integer("archived_at", { mode: "timestamp" }),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).notNull().$defaultFn(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type Issue = typeof issues.$inferSelect;
export type NewIssue = typeof issues.$inferInsert;
