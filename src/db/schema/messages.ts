import { sql } from "drizzle-orm";
import { integer, text, index } from "drizzle-orm/sqlite-core";
import { sqliteTable } from "drizzle-orm/sqlite-core";

// NOTE:: for an initial mvp, we are supporting only sqlite and storing all the messages in a single table.
// for an actual production release, we will likely be storing messages in separate tables or separate sqlite files (depending on config).
export const messagesTable = sqliteTable(
    "messages",
    {
        // we do incrementing numbers for now but for goodness sake we need to come up with something better
        // TODO: id by snowflakes or something more sane.
        id: text("id").primaryKey(),
        channelAtUri: text("channel_at_uri"),
        authorDid: text("author_did").notNull(),
        content: text("content").notNull(),
        createdAt: integer("created_at", { mode: "timestamp" })
            .notNull()
            .default(sql`(unixepoch('now'))`),
    },
    (table) => [
        index("messages_channel_idx").on(table.channelAtUri, table.createdAt),
        index("messages_author_idx").on(table.authorDid),
    ],
);
