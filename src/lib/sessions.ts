import type { WebSocket } from "ws";
import * as crypto from "node:crypto";
import { SESSIONS_SECRET } from "@/lib/utils/crypto";
import { z } from "zod";

export const sessionInfoSchema = z.object({
    id: z.string(),
    token: z.string(),
    fingerprint: z.string(),
});
export type SessionInfo = z.infer<typeof sessionInfoSchema>;

export type Session = Map<string, WebSocket>;

export const sessions: Session = new Map<string, WebSocket>();

export const generateSessionId = () => {
    return crypto.randomUUID();
};

export const generateSessionInfo = (sessionId: string): SessionInfo => {
    const token = crypto.randomBytes(32).toString("base64url");

    const hmac = crypto.createHmac("sha256", SESSIONS_SECRET);
    hmac.update(`${token}:${sessionId}`);
    const fingerprint = hmac.digest("hex");

    return { id: sessionId, token, fingerprint };
};

export const verifySessionToken = ({
    token,
    fingerprint,
    id: sessionId,
}: SessionInfo) => {
    const hmac = crypto.createHmac("sha256", SESSIONS_SECRET);
    hmac.update(`${token}:${sessionId}`);
    const expectedFingerprint = hmac.digest("hex");

    try {
        return crypto.timingSafeEqual(
            Buffer.from(fingerprint, "hex"),
            Buffer.from(expectedFingerprint, "hex"),
        );
    } catch {
        return false;
    }
};

export const assignSessionTo = ({
    sessionInfo,
    socket,
}: {
    sessionInfo: SessionInfo;
    socket: WebSocket;
}) => {
    try {
        const sessionId = sessionInfo.id;
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
