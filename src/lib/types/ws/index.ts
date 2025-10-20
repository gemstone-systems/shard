import { shardMessagesInsertSchema } from "@/db/schema/messages";
import { verificationRequestSchema } from "@/lib/types/ws/verify";
import { z } from "zod";

export const WebSocketMessageType = {
    SHARD_VERIFY: "shard/verify",
    SHARD_MESSAGE: "shard/message",
} as const;
export const webSocketMessageTypeSchema = z.enum(WebSocketMessageType);
export type WebSocketMessageType = z.infer<typeof webSocketMessageTypeSchema>;

const webSocketMessageBase = z.object({
    type: webSocketMessageTypeSchema,
    data: z.unknown(),
});

export const verificationMessageSchema = webSocketMessageBase.safeExtend({
    type: z.literal("shard/verify"),
    data: verificationRequestSchema,
});
export type VerificationMessage = z.infer<typeof verificationMessageSchema>;

// there are only two difficult things in programming.
// 1. naming things
// 2. cache invalidation
// 3. off-by-one errors
export const shardMessageMessageSchema = webSocketMessageBase.safeExtend({
    type: z.literal("shard/message"),
    data: z.object({
        message: shardMessagesInsertSchema,
        sessionId: z.string(),
    }),
});
export type ShardMessage = z.infer<typeof shardMessageMessageSchema>;

export const webSocketMessageSchema = z.union([
    verificationMessageSchema,
    shardMessageMessageSchema,
]);
export type WebSocketMessage = z.infer<typeof webSocketMessageSchema>;
