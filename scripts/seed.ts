import { drizzle } from "drizzle-orm/better-sqlite3"
import Database from "better-sqlite3"
import { users } from "../db/schema"
import { USER_ID } from "../lib/auth"
import path from "path"

const sqlite = new Database(path.join(process.cwd(), "db", "seed.sqlite"))
const db = drizzle(sqlite)

db.insert(users)
  .values({ id: USER_ID, name: "Alexis Gourdol", email: "alexis.gourdol@gmail.com" })
  .onConflictDoNothing()
  .run()

console.log("Seeded user", USER_ID)
sqlite.close()
