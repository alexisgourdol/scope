import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import Database from "better-sqlite3";
import path from "path";

const DB_PATH =
  process.env.DB_PATH ?? path.join(process.cwd(), "db", "seed.sqlite");

console.log("Opening:", DB_PATH);
const sqlite = new Database(DB_PATH);
const db = drizzle(sqlite);

try {
  migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations applied successfully!");
} catch (err) {
  console.error("Error:", err);
  process.exit(1);
} finally {
  sqlite.close();
}
