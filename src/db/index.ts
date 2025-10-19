import { schema } from "@/db/schema";
import { AUTH_TOKEN, DB_URL } from "@/lib/env";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

const dbClient = createClient({
    url: DB_URL,
    authToken: AUTH_TOKEN,
});

const db = drizzle(dbClient, { schema });

export default db;

export const setupDbWithMigrations = async (migrationsFolder: string) => {
    if (DB_URL !== ":memory:") return;
    console.log("Performing migrations for an in-memory database.");
    await migrate(db, { migrationsFolder });
};
