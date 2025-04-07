import type { Config } from "drizzle-kit"
import * as dotenv from "dotenv"
dotenv.config()

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  driver: "mysql2",
  dbCredentials: {
    host: process.env.DATABASE_HOST || "localhost",
    user: process.env.DATABASE_USERNAME || "root",
    password: process.env.DATABASE_PASSWORD || "",
    database: process.env.DATABASE_NAME || "business_management",
  },
} satisfies Config

