import { atUriSchema } from "@/lib/types/atproto";
import { z } from "zod";

export const verificationRequestSchema = z.object({
    interServiceJwt: z.unknown(),
    channelAtUris: z.array(atUriSchema),
});
export type VerificationRequest = z.infer<typeof verificationRequestSchema>;
