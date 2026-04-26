import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import { config } from "dotenv";

config({ path: ".env.local" });

const url = process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL!;
console.log("Connecting to:", url.replace(/:([^:@]+)@/, ":***@"));

const pool = new Pool({ connectionString: url, ssl: { rejectUnauthorized: false } });

async function main() {
  try {
    await pool.query("SELECT 1");
    console.log("Connection OK");
    await migrate(drizzle(pool), { migrationsFolder: "./drizzle" });
    console.log("Migrations applied successfully!");
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();
