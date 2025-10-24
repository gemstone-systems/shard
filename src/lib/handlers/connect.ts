import {
    createNewSession,
    issuedHandshakes,
    isValidSession,
} from "@/lib/sessions";
import type { PreHandler, WsRouteHandler } from "@/lib/types/routes";

export const connectPreHandler: PreHandler = (req, reply, done) => {
    const { query } = req;
    if (!query) return;
    if (!(typeof query === "object" && "token" in query)) {
        reply.code(400).send("provide token in query params");
        return;
    }

    const sessionToken = query.token as string;

    const sessionInfo = issuedHandshakes.get(sessionToken);
    if (!sessionInfo) {
        reply.code(404).send("session token could not resolve to existing session. retry?");
        return;
    }

    if (!isValidSession(sessionInfo)) {
        reply.code(403).send("session token resolved to session, but did not pass verification. this should not happen.");
        return;
    }


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
};
