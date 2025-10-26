import { didSchema } from "@/lib/types/atproto";
import "dotenv/config";
import { z } from "zod";

const dbUrl = process.env.DB_URL;
if (!dbUrl)
    console.warn(
        "Environment variable DB_URL not set. Defaulting to `:memory:`",
    );
export const DB_URL = dbUrl ?? ":memory:";

const authToken = process.env.AUTH_TOKEN;
if (!authToken) {
    if (DB_URL !== ":memory:" && !DB_URL.startsWith("file:")) {
        console.warn(
            `You have not set AUTH_TOKEN but are using a remote database at ${DB_URL}. Please ensure that this is correct.`,
        );
    } else {
        console.log(`No AUTH_TOKEN set. DB_URL is set as ${DB_URL}`);
    }
}
export const AUTH_TOKEN = authToken;

const encPassphrase = process.env.ENC_PASSPHRASE;
if (!encPassphrase)
    console.warn("No PASSPHRASE set. Contents will NOT be encrypted at rest");
else console.log("PASSPHRASE is set. Contents will he encrypted at rest");
export const ENC_PASSPHRASE = encPassphrase;

const serverPort = process.env.SERVER_PORT;
if (!serverPort)
    console.warn(
        "Environment variable SERVER_PORT not set. Defaulting to 7337",
    );
export const SERVER_PORT = Number.parseInt(serverPort ?? "7337");

const serviceDid = process.env.SERVICE_DID;
const {
    success: serviceDidParseSuccess,
    error: serviceDidParseError,
    data: serviceDidParsed,
} = didSchema.safeParse(serviceDid);
if (!serviceDidParseSuccess) {
    console.warn(serviceDidParseError);
    console.warn(
        "Environment variable SERVICE_DID not set. Defaulting to `did:web:localhost`",
    );
}
export const SERVICE_DID = serviceDidParsed ?? "did:web:localhost";

const constellationUrl = process.env.CONSTELLATION_URL;
let constellationUrlParsed: URL;
try {
    constellationUrlParsed = new URL(constellationUrl ?? "");
} catch (err) {
    console.error(
        "Invalid CONSTELLATION_URL. Please ensure that the environment variable is a valid URL.",
    );
    console.error("https://developer.mozilla.org/en-US/docs/Web/API/URL/URL");
    // @ts-expect-error we're throwing it anyway so it doesn't really matter what we provide to the error constructor here. it should be a TypeError.
    throw new Error(err);
}
export const CONSTELLATION_URL = constellationUrlParsed;

const ownerDid = process.env.OWNER_DID;
const {
    success: ownerDidParseSuccess,
    error: ownerDidParseError,
    data: ownerDidParsed,
} = didSchema.safeParse(ownerDid);
if (!ownerDidParseSuccess) {
    console.error(
        "Could not parse OWNER_DID environment variable. Ensure that it is set and that it is a valid ATProto DID.",
    );
    console.error(
        "See the example environment variables file for more information. `.example.env` in the project root.",
    );
    throw new Error(z.prettifyError(ownerDidParseError));
}
export const OWNER_DID = ownerDidParsed;

const prismUrl = process.env.PRISM_URL;
let prismUrlParsed: URL | undefined;
try {
    prismUrlParsed = new URL(prismUrl ?? "");
} catch (err) {
    console.warn(
        "Invalid PRISM_URL. Please ensure that the environment variable is a valid URL.",
    );
    console.warn("Falling back to default prism instance.");
    console.warn(err);
}
export const PRISM_URL =
    prismUrlParsed ?? new URL("wss://jetstream.gmstn.systems/subscribe");

const nodeEnv = process.env.NODE_ENV;
export const NODE_ENV = nodeEnv ?? "development";

export const isDev = NODE_ENV === "development";
export const __DEV__ = isDev;
