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
import { users } from "./schema";

// Subscription plans table
export const subscriptionPlans = mysqlTable(
  "subscription_plans",
  {
    id: varchar("id", { length: 36 }).primaryKey().notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    interval: mysqlEnum("interval", ["monthly", "yearly"]).notNull(),
    features: text("features").notNull(), // JSON string of features
    isActive: boolean("is_active").default(true).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("subscription_plans_name_idx").on(table.name),
    index("subscription_plans_is_active_idx").on(table.isActive),
  ]
);

// User subscriptions table
export const userSubscriptions = mysqlTable(
  "user_subscriptions",
  {
    id: varchar("id", { length: 36 }).primaryKey().notNull(),
    userId: varchar("user_id", { length: 36 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    planId: varchar("plan_id", { length: 36 })
      .notNull()
      .references(() => subscriptionPlans.id),
    status: mysqlEnum("status", ["active", "canceled", "expired"])
      .default("active")
      .notNull(),
    currentPeriodStart: timestamp("current_period_start").notNull(),
    currentPeriodEnd: timestamp("current_period_end").notNull(),
    cancelAtPeriodEnd: boolean("cancel_at_period_end").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("user_subscriptions_user_id_idx").on(table.userId),
    index("user_subscriptions_plan_id_idx").on(table.planId),
    index("user_subscriptions_status_idx").on(table.status),
    index("user_subscriptions_current_period_end_idx").on(
      table.currentPeriodEnd
    ),
  ]
);

// Define relationships
export const subscriptionPlansRelations = relations(
  subscriptionPlans,
  ({ many }) => ({
    userSubscriptions: many(userSubscriptions),
  })
);

export const userSubscriptionsRelations = relations(
  userSubscriptions,
  ({ one }) => ({
    user: one(users, {
      fields: [userSubscriptions.userId],
      references: [users.id],
    }),
    plan: one(subscriptionPlans, {
      fields: [userSubscriptions.planId],
      references: [subscriptionPlans.id],
    }),
  })
);
