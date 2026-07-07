import "dotenv/config";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { createClient } from "@libsql/client/web";

function isTursoConfigured() {
  const url =
    process.env.TURSO_DATABASE_URL?.trim() ??
    process.env.DATABASE_URL?.trim() ??
    "";
  return url.startsWith("libsql://") || url.startsWith("https://");
}

async function syncTursoSchema() {
  const url =
    process.env.TURSO_DATABASE_URL?.trim() ??
    process.env.DATABASE_URL?.trim();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim();

  if (!url) {
    throw new Error("TURSO_DATABASE_URL or DATABASE_URL is required.");
  }

  if (!authToken) {
    throw new Error("TURSO_AUTH_TOKEN is required for Turso database.");
  }

  const schemaPath = path.join(process.cwd(), "prisma", "turso-schema.sql");
  const sql = fs.readFileSync(schemaPath, "utf-8");
  const client = createClient({ url, authToken });

  const statements = sql
    .split(";")
    .map((statement) => statement.trim())
    .filter((statement) => statement.length > 0 && !statement.startsWith("--"));

  for (const statement of statements) {
    try {
      await client.execute(statement);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (message.includes("already exists")) {
        continue;
      }
      throw error;
    }
  }

  console.log("Turso schema synced.");
}

async function main() {
  if (isTursoConfigured()) {
    await syncTursoSchema();
    return;
  }

  execSync("npx prisma db push", { stdio: "inherit" });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
