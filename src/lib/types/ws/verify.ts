import { atUriSchema } from "@/lib/types/atproto";
import z from "zod/v4";

export const verificationRequestSchema = z.object({
    interServiceJwt: z.unknown(),
    channelAtUris: z.array(atUriSchema),
});
export type VerificationRequest = z.infer<typeof verificationRequestSchema>;
