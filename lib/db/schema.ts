import {
  mysqlTable,
  varchar,
  int,
  decimal,
  timestamp,
  text,
  mysqlEnum,
  boolean,
  index,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { subscriptionPlans, userSubscriptions } from "./subscription-schema";

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
  displayUsername: text("display_username"),
  companyName: varchar("company_name", { length: 255 }),
  companyAddress: varchar("company_address", { length: 255 }),
  companyPhone: varchar("company_phone", { length: 255 }),
  companyEmail: varchar("company_email", { length: 255 }),
  role: text("role"),
  currencyCode: varchar("currency_code", { length: 5 }).default("NGN"),
  currencySymbol: varchar("currency_symbol", { length: 5 }).default(""),
  currencyName: varchar("currency_name", { length: 50 }).default("Naira"),
});

export const session = mysqlTable(
  "session",
  {
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
  },
  (table) => [
    // Add index for session cleanup
    index("session_expires_at_idx").on(table.expiresAt),
    index("session_user_id_idx").on(table.userId),
  ]
);

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
export const products = mysqlTable(
  "products",
  {
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
  },
  (table) => [
    index("products_user_id_idx").on(table.userId),
    index("products_name_idx").on(table.name),
    index("products_stock_quantity_idx").on(table.stockQuantity),
  ]
);

// Sales table - stores all sales transactions
export const sales = mysqlTable(
  "sales",
  {
    id: varchar("id", { length: 36 }).primaryKey().notNull(),
    productId: varchar("product_id", { length: 36 }),
    item: varchar("item", { length: 255 }).notNull(),
    quantity: int("quantity").notNull(),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    profit: decimal("profit", { precision: 10, scale: 2 }).notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    paymentType: varchar("payment_type", {
      length: 50,
      enum: ["transfer", "pos", "cash"],
    }).notNull(),
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
  },
  (table) => [
    index("sales_user_date_idx").on(table.userId, table.date),
    index("sales_user_id_idx").on(table.userId),
    index("sales_product_id_idx").on(table.productId),
    index("sales_item_idx").on(table.item),
    index("sales_payment_type_idx").on(table.paymentType),
    index("sales_quantity_idx").on(table.quantity),
    index("sales_date_idx").on(table.date),
  ]
);

// Debtors table - stores information about people who owe money
export const debtors = mysqlTable(
  "debtors",
  {
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
  },
  (table) => [
    index("debtors_name_idx").on(table.name),
    index("debtors_email_idx").on(table.email),
    index("debtors_phone_idx").on(table.phone),
    index("debtors_created_at_idx").on(table.createdAt),
  ]
);

// Credits table - stores both purchases on credit and payments made
export const credits = mysqlTable(
  "credits",
  {
    id: varchar("id", { length: 36 }).primaryKey().notNull(),
    debtorId: varchar("debtor_id", { length: 36 }).notNull(),
    type: mysqlEnum("type", ["purchase", "payment"]).notNull(),
    item: varchar("item", { length: 255 }),
    quantity: int("quantity"),
    measurementUnit: varchar("measurement_unit", {
      length: 50,
      enum: ["set", "kg", "pcs"],
    }),
    price: decimal("price", { precision: 10, scale: 2 }),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    paymentType: varchar("payment_type", { length: 50 }),
    isPaid: boolean("is_paid").default(false).notNull(),
    paidDate: timestamp("paid_date"),
    date: timestamp("date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    invoiceId: varchar("invoice_id", { length: 36 }),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("credits_debtor_id_idx").on(table.debtorId),
    index("credits_type_idx").on(table.type),
    index("credits_item_idx").on(table.item),
    index("credits_user_id_idx").on(table.userId),
    index("credits_is_paid_idx").on(table.isPaid),
    index("credits_date_idx").on(table.date),
    index("credits_invoice_id_idx").on(table.invoiceId),
    index("credits_paid_date_idx").on(table.paidDate),
  ]
);

// Invoices table
export const invoices = mysqlTable(
  "invoices",
  {
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
  },
  (table) => [
    // Add indexes for filtering and lookup operations
    index("invoices_debtor_id_idx").on(table.debtorId),
    index("invoices_status_idx").on(table.status),
    index("invoices_issue_date_idx").on(table.issueDate),
    index("invoices_due_date_idx").on(table.dueDate),
    index("invoices_user_id_idx").on(table.userId),
    index("invoices_invoice_number_idx").on(table.invoiceNumber),
  ]
);

// Define relationships
// Expenses table - stores all expense transactions
export const expenses = mysqlTable(
  "expenses",
  {
    id: varchar("id", { length: 36 }).primaryKey().notNull(),
    item: varchar("item", { length: 255 }).notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    paymentType: varchar("payment_type", {
      length: 50,
      enum: ["cash", "card", "transfer", "other"],
    }).notNull(),
    category: varchar("category", { length: 100 }),
    notes: text("notes"),
    date: timestamp("date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
  },
  (table) => [
    index("expenses_user_id_idx").on(table.userId),
    index("expenses_date_idx").on(table.date),
    index("expenses_payment_type_idx").on(table.paymentType),
    index("expenses_category_idx").on(table.category),
  ]
);

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(session),
  accounts: many(account),
  products: many(products),
  sales: many(sales),
  debtors: many(debtors),
  credits: many(credits),
  invoices: many(invoices),
  expenses: many(expenses),
  subscriptions: many(userSubscriptions),
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

export const expensesRelations = relations(expenses, ({ one }) => ({
  user: one(users, {
    fields: [expenses.userId],
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
