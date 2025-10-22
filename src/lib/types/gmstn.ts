import { ComAtprotoRepoStrongRef } from "@atcute/atproto";
import z from "zod";

export const systemsGmstnDevelopmentChannelRecordSchema = z.object({
    $type: z.string(),
    name: z.string(),
    topic: z.string(),
    storeAt: ComAtprotoRepoStrongRef.mainSchema,
    routeThrough: ComAtprotoRepoStrongRef.mainSchema,
    createdAt: z.coerce.date(),
});
export type SystemsGmstnDevelopmentChannel = z.infer<
    typeof systemsGmstnDevelopmentChannelRecordSchema
>;
