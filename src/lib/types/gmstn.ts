import { ComAtprotoRepoStrongRef } from "@atcute/atproto";
import z from "zod";

export const systemsGmstnDevelopmentChannelRecordSchema = z.object({
    $type: z.string(),
    name: z.string(),
    topic: z.string(),
    storeAt: z.object({ ...ComAtprotoRepoStrongRef.mainSchema.shape }),
    routeThrough: z.object({ ...ComAtprotoRepoStrongRef.mainSchema.shape }),
    createdAt: z.coerce.date(),
});
export type SystemsGmstnDevelopmentChannel = z.infer<
    typeof systemsGmstnDevelopmentChannelRecordSchema
>;
