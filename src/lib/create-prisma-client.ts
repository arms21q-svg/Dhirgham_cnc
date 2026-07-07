import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaLibSql as PrismaLibSqlNode } from "@prisma/adapter-libsql";
import { PrismaLibSql as PrismaLibSqlWeb } from "@prisma/adapter-libsql/web";
import {
  getDatabaseMode,
  getLocalDatabaseUrl,
  getTursoConfig,
} from "@/lib/database-config";
import { resolveLocalDatabaseUrl } from "@/lib/database-url";

function shouldUseWebLibsqlAdapter() {
  return Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
}

export function createPrismaClient(): PrismaClient {
  if (getDatabaseMode() === "turso") {
    const turso = getTursoConfig();
    const LibSqlAdapter = shouldUseWebLibsqlAdapter() ? PrismaLibSqlWeb : PrismaLibSqlNode;
    const adapter = new LibSqlAdapter({
      url: turso.url,
      authToken: turso.authToken,
    });
    return new PrismaClient({ adapter });
  }

  const adapter = new PrismaBetterSqlite3({
    url: resolveLocalDatabaseUrl(getLocalDatabaseUrl()),
  });
  return new PrismaClient({ adapter });
}
