import {
    createNewSession,
    issuedHandshakes,
    isValidSession,
} from "@/lib/sessions";
import { shardMessageSchema } from "@/lib/types/messages";
import type { PreHandler, WsRouteHandler } from "@/lib/types/routes";
import { atUriToString } from "@/lib/utils/atproto";
import { storeMessageInDb } from "@/lib/utils/gmstn";
import {
    rawDataToString,
    validateWsMessageType,
} from "@/lib/utils/ws/validate";
import { z } from "zod";

export const connectPreHandler: PreHandler = (req, reply, done) => {
    const { query } = req;
    if (!query) return;
    if (!(typeof query === "object" && "token" in query)) {
        reply.code(400).send("Provide token in query params");
        return;
    }

    const sessionToken = query.token as string;

    const sessionInfo = issuedHandshakes.get(sessionToken);
    if (!sessionInfo) {
        reply
            .code(404)
            .send(
                "Session token could not resolve to existing session. retry?",
            );
        return;
    }

    if (!isValidSession(sessionInfo)) {
        reply
            .code(403)
            .send(
                "Session token resolved to session, but did not pass verification. this should not happen.",
            );
        return;
    }

    console.log(
        "Found session:",
        sessionInfo.id,
        "from session token",
        sessionToken,
    );
    done();
};

export const connectWsHandler: WsRouteHandler = (socket, req) => {
    const { query } = req;
    if (!query) return;
    if (!(typeof query === "object" && "token" in query)) {
        socket.close();
        return;
    }
    const sessionToken = query.token as string;

    const sessionInfo = issuedHandshakes.get(sessionToken);
    if (!sessionInfo) {
        socket.close();
        return;
    }

    const sessionCreateResult = createNewSession({ sessionInfo, socket });
    if (!sessionCreateResult.ok) {
        socket.close();
        return;
    }

    // convert at uri objects array to set of at uri strings for easier lookup.
    const socketAllowedChannels = new Set(sessionInfo.allowedChannels.map(channel => atUriToString(channel)));

    socket.on("message", (rawData) => {
        const event = rawDataToString(rawData);

        const data: unknown = JSON.parse(event);
        const validateTypeResult = validateWsMessageType(data);
        if (!validateTypeResult.ok) return;

        const { type: messageType } = validateTypeResult.data;

        switch (messageType) {
            case "shard/message": {
                const {
                    success,
                    error,
                    data: shardMessage,
                } = shardMessageSchema.safeParse(validateTypeResult.data);
                if (!success) {
                    console.error(
                        "could not parse",
                        validateTypeResult.data,
                        "as a valid ShardMessage.",
                    );
                    console.error(z.treeifyError(error));
                    return;
                }

                const { channel } = shardMessage
                if(!socketAllowedChannels.has(channel)) return;

                storeMessageInDb(shardMessage)
                    .then(() => {
                        console.log("stored", shardMessage);
                    })
                    .catch((err: unknown) => {
                        console.error(
                            "something went wrong storing",
                            shardMessage,
                        );
                        console.error(err);
                    });
                break;
            }
        }
    });
};
