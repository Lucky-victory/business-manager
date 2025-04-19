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
  json,
  uniqueIndex,
} from "drizzle-orm/mysql-core";
import { relations } from "drizzle-orm";
import { MEASUREMENT_UNITS, PAYMENT_TYPES } from "@/types";

const updatedAt = timestamp("updated_at").onUpdateNow().notNull();
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
    updatedAt,
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
      enum: PAYMENT_TYPES,
    }).notNull(),
    date: timestamp("date").notNull(),
    measurementUnit: varchar("measurement_unit", {
      length: 50,
      enum: MEASUREMENT_UNITS,
    }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt,
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    isDeleted: boolean("is_deleted").default(false).notNull(),
    deletedAt: timestamp("deleted_at"),
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
    updatedAt,
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    isDeleted: boolean("is_deleted").default(false).notNull(),
    deletedAt: timestamp("deleted_at"),
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
      enum: MEASUREMENT_UNITS,
    }),
    price: decimal("price", { precision: 10, scale: 2 }),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    paymentType: varchar("payment_type", { length: 50, enum: PAYMENT_TYPES }),
    isPaid: boolean("is_paid").default(false).notNull(),
    paidDate: timestamp("paid_date"),
    date: timestamp("date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt,
    invoiceId: varchar("invoice_id", { length: 36 }),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    isDeleted: boolean("is_deleted").default(false).notNull(),
    deletedAt: timestamp("deleted_at"),
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
    updatedAt,
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    isDeleted: boolean("is_deleted").default(false).notNull(),
    deletedAt: timestamp("deleted_at"),
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
      enum: PAYMENT_TYPES,
    }).notNull(),
    category: varchar("category", { length: 100 }),
    notes: text("notes"),
    date: timestamp("date").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt,
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    isDeleted: boolean("is_deleted").default(false).notNull(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => [
    index("expenses_user_id_idx").on(table.userId),
    index("expenses_date_idx").on(table.date),
    index("expenses_payment_type_idx").on(table.paymentType),
    index("expenses_category_idx").on(table.category),
  ]
);

// Combined countries and currencies table
export const countryCurrency = mysqlTable(
  "country_currency",
  {
    id: varchar("id", { length: 36 }).notNull(),
    countryCode: varchar("country_code", {
      length: 4,
      enum: ["NG", "US", "ZAR", "KE", "GH"],
    })
      .primaryKey()
      .notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    currencyCode: varchar("currency_code", { length: 3 }).notNull(),
    currencySymbol: varchar("currency_symbol", { length: 10 }).notNull(),
    currencyName: varchar("currency_name", { length: 100 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt,
  },
  (table) => [
    index("country_currency_currency_code_idx").on(table.currencyCode),
    index("country_currency_country_name_idx").on(table.name),
  ]
);

// Plans table to define available plan types
export const plans = mysqlTable(
  "plans",
  {
    id: varchar("id", { length: 36 }).primaryKey().notNull(),
    name: varchar("name", { length: 50 }).notNull(),
    description: varchar("description", { length: 255 }),
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt,
  },
  (table) => [
    index("plan_name_idx").on(table.name),
    index("plan_is_active_idx").on(table.isActive),
  ]
);

// Pricing table that connects countries with plans and pricing details
export const pricing = mysqlTable(
  "pricing",
  {
    id: varchar("id", { length: 36 }).primaryKey().notNull(),
    countryCode: varchar("country_code", { length: 4 })
      .notNull()
      .references(() => countryCurrency.countryCode),
    planId: varchar("plan_id", { length: 36 })
      .notNull()
      .references(() => plans.id),
    monthlyPrice: decimal("monthly_price", {
      precision: 10,
      scale: 2,
    }).notNull(),
    features: json("features").notNull(), // JSON string of features
    yearlyPrice: decimal("yearly_price", { precision: 10, scale: 2 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt,
  },
  (table) => [
    index("pricing_country_code_idx").on(table.countryCode),
    index("pricing_plan_id_idx").on(table.planId),
    uniqueIndex("unique_pricing").on(table.countryCode, table.planId),
  ]
);

// Define relations for better TypeScript type inference
export const countryCurrencyRelations = relations(
  countryCurrency,
  ({ many }) => ({
    pricing: many(pricing),
  })
);

// User subscriptions table
export const userSubscriptions = mysqlTable(
  "user_subscriptions",
  {
    id: varchar("id", { length: 36 }).primaryKey().notNull(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id),
    pricingId: varchar("pricing_id", { length: 36 })
      .notNull()
      .references(() => pricing.id),
    startDate: timestamp("start_date").notNull(),
    endDate: timestamp("end_date"),

    status: mysqlEnum("status", [
      "trial",
      "active",
      "past_due",
      "canceled",
      "expired",
    ])
      .default("trial")
      .notNull(),
    trialStartDate: timestamp("trial_start_date"),
    trialEndDate: timestamp("trial_end_date"),
    trialUsed: boolean("trial_used").default(false).notNull(),
    canceledAt: timestamp("canceled_at"),
    billingCycle: varchar("billing_cycle", { length: 20 }).notNull(), // "monthly" or "yearly"
    autoRenew: boolean("auto_renew").default(true).notNull(),
    lastPaymentDate: timestamp("last_payment_date"),
    nextBillingDate: timestamp("next_billing_date"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt,
  },
  (table) => [
    index("user_subscription_user_id_idx").on(table.userId),
    index("user_subscription_pricing_id_idx").on(table.pricingId),
    index("user_subscription_status__idx").on(table.status),
    index("user_subscription_next_billing_date_idx").on(table.nextBillingDate),
  ]
);

// Optional: Subscription payment history
export const subscriptionPayments = mysqlTable(
  "subscription_payments",
  {
    id: varchar("id", { length: 36 }).primaryKey().notNull(),
    subscriptionId: varchar("subscription_id", { length: 36 })
      .notNull()
      .references(() => userSubscriptions.id),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 3 }).notNull(),
    status: varchar("status", { length: 20 }).notNull(), // "succeeded", "failed", "pending", etc.
    paymentMethod: varchar("payment_method", { length: 50 }),
    paymentProvider: varchar("payment_provider", { length: 100 }),
    paymentProviderSubscriptionId: varchar("payment_provider_subscription_id", {
      length: 100,
    }),
    paymentDate: timestamp("payment_date").notNull(),
    metadata: json("metadata"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt,
  },
  (table) => [
    index("payment_subscription_id_idx").on(table.subscriptionId),
    index("payment_status_idx").on(table.status),
    index("payment_date_idx").on(table.paymentDate),
  ]
);
// Define relationships
export const plansRelations = relations(plans, ({ many }) => ({
  pricing: many(pricing),
}));

export const userSubscriptionRelations = relations(
  userSubscriptions,
  ({ one, many }) => ({
    user: one(users, {
      fields: [userSubscriptions.userId],
      references: [users.id],
    }),
    pricing: one(pricing, {
      fields: [userSubscriptions.pricingId],
      references: [pricing.id],
    }),
    payments: many(subscriptionPayments),
  })
);

export const subscriptionPaymentRelations = relations(
  subscriptionPayments,
  ({ one }) => ({
    subscription: one(userSubscriptions, {
      fields: [subscriptionPayments.subscriptionId],
      references: [userSubscriptions.id],
    }),
  })
);
export const pricingRelations = relations(pricing, ({ one, many }) => ({
  country: one(countryCurrency, {
    fields: [pricing.countryCode],
    references: [countryCurrency.countryCode],
  }),
  plan: one(plans, {
    fields: [pricing.planId],
    references: [plans.id],
  }),
  subscriptions: many(userSubscriptions),
}));

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
