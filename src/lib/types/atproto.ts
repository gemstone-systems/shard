import { z } from "zod";

export const didPlcSchema = z.templateLiteral(["did:plc:", z.string()]);
export type DidPlc = z.infer<typeof didPlcSchema>;

export const didWebSchema = z.templateLiteral(["did:web:", z.string()]);
export type DidWeb = z.infer<typeof didWebSchema>;

export const didSchema = z.templateLiteral([
    "did:",
    z.string(),
    ":",
    z.string(),
]);
export type Did = z.infer<typeof didSchema>;

export const nsidSchema = z
    .string()
    .regex(
        /^[a-zA-Z]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(\.[a-zA-Z]([a-zA-Z0-9]{0,62})?)$/,
    );
export type NSID = z.infer<typeof nsidSchema>;

export const atprotoHandleSchema = z
    .string()
    .regex(
        /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/,
    );

export const atUriSchema = z.object({
    authority: z.union([didPlcSchema, didWebSchema, atprotoHandleSchema]),
    collection: z.optional(nsidSchema),
    rKey: z.optional(z.string()),
});
export type AtUri = z.infer<typeof atUriSchema>;
