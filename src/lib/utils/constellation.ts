import { CONSTELLATION_URL } from "@/lib/env";
import type { ConstellationBacklinkResponse } from "@/lib/types/constellation";
import { constellationBacklinkResponseSchema } from "@/lib/types/constellation";
import type { Result } from "@/lib/utils/result";
import type { ZodError } from "zod";

export const getConstellationBacklink = async ({
    subject,
    source,
}: {
    subject: string;
    source: {
        nsid: string;
        fieldName?: string;
    };
}): Promise<
    Result<
        ConstellationBacklinkResponse,
        ZodError | { message: string; fetchStatus: number }
    >
> => {
    const { nsid, fieldName } = source;
    const sourceParam = fieldName ? `${nsid}:${fieldName}` : nsid;
    const req = new Request(
        `${CONSTELLATION_URL}/xrpc/blue.microcosm.links.getBacklinks?subject=${encodeURIComponent(subject)}?source=${encodeURIComponent(sourceParam)}`,
    );
    const res = await fetch(req);

    if (!res.ok)
        return {
            ok: false,
            error: {
                message: "Fetch request to Constellation did not return 200.",
                fetchStatus: res.status,
            },
        };

    const data: unknown = await res.json();

    const {
        success,
        error,
        data: constellationResponse,
    } = constellationBacklinkResponseSchema.safeParse(data);

    if (!success) {
        return { ok: false, error };
    } else return { ok: true, data: constellationResponse };
};
