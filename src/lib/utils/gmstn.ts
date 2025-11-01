import db from "@/db";
import type { ShardMessageSelect } from "@/db/schema/messages";
import { messagesTable, type ShardMessageInsert } from "@/db/schema/messages";
import type { ShardMessage } from "@/lib/types/messages";
import type { Result } from "@/lib/utils/result";
import * as TID from "@atcute/tid";
import { eq } from "drizzle-orm";

export const storeMessageInDb = async (message: ShardMessage) => {
    const tid = TID.now();
    const {
        content,
        channel: channelAtUri,
        sentBy: authorDid,
        sentAt,
    } = message;
    const messageToStore: ShardMessageInsert = {
        id: tid,
        authorDid,
        content,
        channelAtUri,
        sentAt,
        createdAt: new Date(),
    };

    const insertResult = await db.insert(messagesTable).values(messageToStore);

    if (insertResult.rowsAffected > 0) console.log("Stored!");
    else {
        console.error("Something went wrong storing", messageToStore);
        console.error("insertResult:", insertResult);
    }
};

export const getChannelHistory = async (
    channelAtUriString: string,
): Promise<Result<Array<ShardMessageSelect>, unknown>> => {
    const messages = await db
        .select()
        .from(messagesTable)
        .where(eq(messagesTable.channelAtUri, channelAtUriString))
        .limit(100);
    if (messages.length === 0)
        return {
            ok: false,
            error: "Channel either has no messages, or the provided channel at uri is wrong.",
        };
    return { ok: true, data: messages };
};
