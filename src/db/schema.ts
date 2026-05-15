import {
  pgTable,
  text,
  timestamp,
  integer,
  pgEnum,
  primaryKey,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

export const priorityEnum = pgEnum("priority", [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT",
]);

// Auth.js tables
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const accounts = pgTable(
  "accounts",
  {
    userId: text("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    type: text("type").notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),

    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.provider, table.providerAccountId],
    }),
  })
);

export const sessions = pgTable("sessions", {
  sessionToken: text("session_token").primaryKey(),

  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => ({
    pk: primaryKey({
      columns: [table.identifier, table.token],
    }),
  })
);

// Flowboard tables
export const boards = pgTable("boards", {
  id: text("id").primaryKey(),

  title: text("title").notNull(),
  description: text("description"),

  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const columns = pgTable("columns", {
  id: text("id").primaryKey(),

  title: text("title").notNull(),
  position: integer("position").notNull(),

  boardId: text("board_id")
    .notNull()
    .references(() => boards.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const cards = pgTable("cards", {
  id: text("id").primaryKey(),

  title: text("title").notNull(),
  description: text("description"),

  priority: priorityEnum("priority").default("MEDIUM").notNull(),
  dueDate: timestamp("due_date", { mode: "date" }),

  position: integer("position").notNull(),

  columnId: text("column_id")
    .notNull()
    .references(() => columns.id, { onDelete: "cascade" }),

  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});
