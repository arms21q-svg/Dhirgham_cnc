import fs from "fs";
import path from "path";

export function resolveDatabaseUrl(): string {
  const configured = process.env.DATABASE_URL?.trim();

  if (configured && !configured.startsWith("file:./")) {
    return configured;
  }

  const sourceDb = path.join(process.cwd(), "dev.db");

  if (process.env.VERCEL) {
    const tmpDb = path.join("/tmp", "dev.db");
    try {
      if (!fs.existsSync(tmpDb) && fs.existsSync(sourceDb)) {
        fs.copyFileSync(sourceDb, tmpDb);
      }
      if (fs.existsSync(tmpDb)) {
        return `file:${tmpDb}`;
      }
    } catch {
      // Fall back to bundled path below.
    }
  }

  if (fs.existsSync(sourceDb)) {
    return `file:${sourceDb}`;
  }

  return configured ?? "file:./dev.db";
}
