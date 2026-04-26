import { config } from "dotenv";
import type { Config } from "drizzle-kit";

config({ path: ".env.local" });

export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DIRECT_DATABASE_URL ?? process.env.DATABASE_URL!,
  },
} satisfies Config;
