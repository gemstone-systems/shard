import db from "@/db";
import { messagesTable, type ShardMessageInsert } from "@/db/schema/messages";
import type { ShardMessage } from "@/lib/types/messages";
import * as TID from "@atcute/tid";

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
