import { z } from "zod";

export const constellationBacklinkResponseSchema = z.object({
    total: z.number(),
    records: z.array(
        z.object({
            did: z.string(),
            collection: z.string(),
            rkey: z.string(),
        }),
    ),
    cursor: z.optional(z.string()),
});
export type ConstellationBacklinkResponse = z.infer<
    typeof constellationBacklinkResponseSchema
>;
