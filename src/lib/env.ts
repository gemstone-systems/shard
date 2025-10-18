import "dotenv/config";

const dbUrl = process.env.DB_URL;
if (!dbUrl)
    console.warn("Environment DB_URL not set. Defaulting to `:memory:`");
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
