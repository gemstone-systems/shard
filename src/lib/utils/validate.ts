import type { AtUri } from "@/lib/types/atproto";

// thank u julie
const atUriRegex =
    /^at:\/\/([a-zA-Z0-9._:%-]+)(?:\/([a-zA-Z0-9-.]+)(?:\/([a-zA-Z0-9._~:@!$&%')(*+,;=-]+))?)?(?:#(\/[a-zA-Z0-9._~:@!$&%')(*+,;=\-[\]/\\]*))?$/;

export const validateAtUri = (inputString: string) => {
    const regexTestResult = atUriRegex.test(inputString);
    if (!regexTestResult) return { ok: false };
    const parts = inputString.split("/");
    const authority = parts[2];
    const collection = parts[3];
    const rKey = parts[4];
    const atUri: AtUri = {
        authority,
        collection,
        rKey,
    };
    return { ok: true, value: inputString, atUri };
};
