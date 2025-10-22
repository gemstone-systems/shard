import { z } from "zod";

export const constellationBacklinkSchema = z.object({
    did: z.string(),
    collection: z.string(),
    rkey: z.string(),
});
export type ConstellationBacklink = z.infer<typeof constellationBacklinkSchema>;

export const constellationBacklinkResponseSchema = z.object({
    total: z.number(),
    records: z.array(constellationBacklinkSchema),
    cursor: z.optional(z.string()),
});
export type ConstellationBacklinkResponse = z.infer<
    typeof constellationBacklinkResponseSchema
>;
