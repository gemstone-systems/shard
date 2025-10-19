import { schema } from "@/db/schema";
import { AUTH_TOKEN, DB_URL } from "@/lib/env";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

const dbClient = createClient({
    url: DB_URL,
    authToken: AUTH_TOKEN,
});

const db = drizzle(dbClient, { schema });

export default db;
