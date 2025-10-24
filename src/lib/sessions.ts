import type { WebSocket } from "ws";
import * as crypto from "node:crypto";
import { SESSIONS_SECRET } from "@/lib/utils/crypto";
import { z } from "zod";
import type { Result } from "@/lib/utils/result";

export const sessionInfoSchema = z.object({
    id: z.string(),
    token: z.string(),
    fingerprint: z.string(),
});
export type SessionInfo = z.infer<typeof sessionInfoSchema>;

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

export const verifyHandshakeToken = ({
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

export const issuedHandshakes = new Map<string, SessionInfo>();

export const issueNewHandshakeToken = () => {
    const sessionId = generateSessionId();
    const sessionInfo = generateSessionInfo(sessionId);
    issuedHandshakes.set(sessionInfo.id, sessionInfo);
    return sessionInfo;
};

export const activeSessions = new Map<string, WebSocket>();

export const createNewSession = ({
    sessionInfo,
    socket,
}: {
    sessionInfo: SessionInfo;
    socket: WebSocket;
}): Result<undefined, undefined> => {
    const isValidSession = verifyHandshakeToken(sessionInfo);
    if (!isValidSession) return { ok: false };

    try {
        issuedHandshakes.delete(sessionInfo.id);
    } catch {
        return { ok: false };
    }
    activeSessions.set(sessionInfo.id, socket);
    return { ok: true };
};

export const deleteSession = (
    sessionInfo: SessionInfo,
): Result<undefined, undefined> => {
    if (!activeSessions.has(sessionInfo.id)) return { ok: false };
    try {
        activeSessions.delete(sessionInfo.id);
    } catch {
        return { ok: false };
    }
    return { ok: true };
};
