import { sql } from "drizzle-orm";
import { integer, text, index } from "drizzle-orm/sqlite-core";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// NOTE:: for an initial mvp, we are supporting only sqlite and storing all the messages in a single table.
// for an actual production release, we will likely be storing messages in separate tables or separate sqlite files (depending on config).
export const messagesTable = sqliteTable(
    "messages",
    {
        id: text("id").primaryKey(),
        channelAtUri: text("channel_at_uri"),
        authorDid: text("author_did").notNull(),
        content: text("content").notNull(),
        sentAt: integer("created_at", { mode: "timestamp" }).notNull(),
        createdAt: integer("created_at", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch('now'))`),
    },
    (table) => [
        index("messages_channel_idx").on(table.channelAtUri, table.createdAt),
        index("messages_author_idx").on(table.authorDid),
    ],
);

export const shardMessagesSelectSchema = createSelectSchema(messagesTable);
export const shardMessageSelectSchemaArray = z.array(shardMessagesSelectSchema);
export const shardMessagesInsertSchema = createInsertSchema(messagesTable);

export type ShardMessageSelect = z.infer<typeof shardMessagesSelectSchema>;
export type ShardMessageInsert = z.infer<typeof shardMessagesInsertSchema>;
