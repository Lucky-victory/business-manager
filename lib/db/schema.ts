import {
  mysqlTable,
  varchar,
  int,
  decimal,
  timestamp,
  text,
  mysqlEnum,
  boolean,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";

// Users table for authentication
export const users = mysqlTable("users", {
  id: varchar("id", { length: 36 }).primaryKey(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull(),
  image: text("image"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  username: varchar("username", { length: 255 }).unique(),
  role: mysqlEnum("role", ["admin", "user"]).default("user").notNull(),
  displayUsername: text("display_username"),
});

export const session = mysqlTable("session", {
  id: varchar("id", { length: 36 }).primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const account = mysqlTable("account", {
  id: varchar("id", { length: 36 }).primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 36 }).primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at"),
});

// Products/Inventory table
export const products = mysqlTable("products", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  stockQuantity: int("stock_quantity").notNull().default(0),
  lowStockThreshold: int("low_stock_threshold").default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Sales table - stores all sales transactions
export const sales = mysqlTable("sales", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  productId: varchar("product_id", { length: 36 }),
  item: varchar("item", { length: 255 }).notNull(),
  quantity: int("quantity").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paymentType: varchar("payment_type", { length: 50 }).notNull(),
  date: timestamp("date").notNull(),
  measurementUnit: varchar("measurement_unit", {
    length: 50,
    enum: ["set", "kg", "pcs"],
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Debtors table - stores information about people who owe money
export const debtors = mysqlTable("debtors", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  address: text("address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Credits table - stores both purchases on credit and payments made
export const credits = mysqlTable("credits", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  debtorId: varchar("debtor_id", { length: 36 }).notNull(),
  type: mysqlEnum("type", ["purchase", "payment"]).notNull(),
  // For purchases
  item: varchar("item", { length: 255 }),
  quantity: int("quantity"),
  measurementUnit: varchar("measurement_unit", {
    length: 50,
    enum: ["set", "kg", "pcs"],
  }),
  price: decimal("price", { precision: 10, scale: 2 }),
  // For both purchases and payments
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  // For payments
  paymentType: varchar("payment_type", { length: 50 }),
  // Status tracking
  isPaid: boolean("is_paid").default(false).notNull(),
  paidDate: timestamp("paid_date"),
  // Dates
  date: timestamp("date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  // Invoice related
  invoiceId: varchar("invoice_id", { length: 36 }),
  // User who created this entry
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Invoices table
export const invoices = mysqlTable("invoices", {
  id: varchar("id", { length: 36 }).primaryKey().notNull(),
  debtorId: varchar("debtor_id", { length: 36 }).notNull(),
  invoiceNumber: varchar("invoice_number", { length: 50 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["draft", "sent", "paid", "overdue"])
    .default("draft")
    .notNull(),
  issueDate: timestamp("issue_date").notNull(),
  dueDate: timestamp("due_date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  userId: varchar("user_id", { length: 36 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

// Define relationships
export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  products: many(products),
  sales: many(sales),
  debtors: many(debtors),
  credits: many(credits),
  invoices: many(invoices),
}));

export const debtorsRelations = relations(debtors, ({ many, one }) => ({
  credits: many(credits),
  invoices: many(invoices),
  user: one(users, {
    fields: [debtors.userId],
    references: [users.id],
  }),
}));

export const creditsRelations = relations(credits, ({ one }) => ({
  debtor: one(debtors, {
    fields: [credits.debtorId],
    references: [debtors.id],
  }),
  invoice: one(invoices, {
    fields: [credits.invoiceId],
    references: [invoices.id],
  }),
  user: one(users, {
    fields: [credits.userId],
    references: [users.id],
  }),
}));

export const invoicesRelations = relations(invoices, ({ one, many }) => ({
  debtor: one(debtors, {
    fields: [invoices.debtorId],
    references: [debtors.id],
  }),
  credits: many(credits),
  user: one(users, {
    fields: [invoices.userId],
    references: [users.id],
  }),
}));

export const salesRelations = relations(sales, ({ one }) => ({
  product: one(products, {
    fields: [sales.productId],
    references: [products.id],
  }),
  user: one(users, {
    fields: [sales.userId],
    references: [users.id],
  }),
}));

export const productsRelations = relations(products, ({ many, one }) => ({
  sales: many(sales),
  user: one(users, {
    fields: [products.userId],
    references: [users.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(users, {
    fields: [session.userId],
    references: [users.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(users, {
    fields: [account.userId],
    references: [users.id],
  }),
}));
