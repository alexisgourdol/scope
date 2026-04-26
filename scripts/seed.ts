import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import { config } from "dotenv"
import { users } from "../db/schema"
import { USER_ID } from "../lib/auth"

config({ path: ".env.local" })

const pool = new Pool({
  connectionString: process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL!,
  ssl: { rejectUnauthorized: false },
})

async function seed() {
  const db = drizzle(pool)
  await db
    .insert(users)
    .values({ id: USER_ID, name: "Alexis Gourdol", email: "alexis.gourdol@gmail.com" })
    .onConflictDoNothing()
  console.log("Seeded user", USER_ID)
  await pool.end()
}

seed().catch((err) => {
  console.error(err)
  process.exit(1)
})
