import { migrate } from "drizzle-orm/mysql2/migrator"
import { db } from "./index"

// This script can be run to apply migrations
async function runMigrations() {
  console.log("Running migrations...")

  await migrate(db, { migrationsFolder: "./drizzle" })

  console.log("Migrations completed successfully")
  process.exit(0)
}

runMigrations().catch((err) => {
  console.error("Migration failed", err)
  process.exit(1)
})

