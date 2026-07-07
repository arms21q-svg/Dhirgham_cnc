export type DatabaseMode = "turso" | "local";

export function getDatabaseMode(): DatabaseMode {
  const url = getConfiguredDatabaseUrl();
  return url.startsWith("libsql://") || url.startsWith("https://") ? "turso" : "local";
}

export function getConfiguredDatabaseUrl(): string {
  return (
    process.env.TURSO_DATABASE_URL?.trim() ??
    process.env.DATABASE_URL?.trim() ??
    "file:./dev.db"
  );
}

export function getTursoConfig() {
  const url = getConfiguredDatabaseUrl();
  const authToken = process.env.TURSO_AUTH_TOKEN?.trim() ?? "";

  if (!url.startsWith("libsql://") && !url.startsWith("https://")) {
    throw new Error("Remote database URL must start with libsql://");
  }

  if (!authToken) {
    throw new Error("TURSO_AUTH_TOKEN is required for remote database.");
  }

  return { url, authToken };
}

export function getLocalDatabaseUrl(): string {
  const configured = process.env.DATABASE_URL?.trim();

  if (configured && configured.startsWith("file:")) {
    return configured;
  }

  return "file:./dev.db";
}

export function isTursoDatabase(): boolean {
  return getDatabaseMode() === "turso";
}
