import type { Config } from "drizzle-kit";
import * as dotenv from "dotenv";
import { connectionUri } from "./lib/db";
dotenv.config();

export default {
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: { url: connectionUri },
} satisfies Config;
