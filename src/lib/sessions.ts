import type { WebSocket } from "ws";

export type Session = Map<string, WebSocket>;

export const sessions: Session = new Map<string, WebSocket>();

export const generateSessionId = () => {
    return crypto.randomUUID();
};

export const assignSessionTo = (socket: WebSocket) => {
    try {
        const sessionId = generateSessionId();
        sessions.set(sessionId, socket);
        return { ok: true };
    } catch (err: unknown) {
        return { ok: false, err };
    }
};

export const dropSession = (sessionId: string) => {
    try {
        if (!sessions.has(sessionId))
            return {
                ok: false,
                err: new Error(
                    `Could not find a session socket for id ${sessionId} `,
                ),
            };
        const session = sessions.get(sessionId);
        if (!session)
            return {
                ok: false,
                err: new Error(
                    "`sessionId` key exists, but could not get the session socket for some reason?",
                ),
            };
        session.close();
        sessions.delete(sessionId);
        return { ok: true };
    } catch (err: unknown) {
        return { ok: false, err };
    }
};
