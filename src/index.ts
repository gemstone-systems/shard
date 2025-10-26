import { setupDbWithMigrations } from "@/db";
import { DB_URL, OWNER_DID, SERVER_PORT, SERVICE_DID } from "@/lib/env";
import { setRegistrationState } from "@/lib/state";
import type { AtUri } from "@/lib/types/atproto";
import { getRecordFromAtUri } from "@/lib/utils/atproto";
import { newErrorResponse } from "@/lib/utils/http/responses";
import { connectToPrism } from "@/lib/utils/prism";
import {
    attachShardRegistrationListener,
    wrapHttpRegistrationCheck,
    wrapWsRegistrationCheck,
} from "@/lib/utils/registration";
import { routes } from "@/routes";
import { setupServer } from "@/server";

const main = async () => {
    if (DB_URL === ":memory:") await setupDbWithMigrations("./drizzle");

    const server = await setupServer();
    for (const [url, route] of Object.entries(routes)) {
        if (!route.wsHandler) {
            const { handler, method, skipRegistrationCheck } = route;
            server.route({
                url,
                method,
                handler: skipRegistrationCheck
                    ? handler
                    : wrapHttpRegistrationCheck(handler),
            });
        } else {
            const {
                wsHandler,
                method,
                handler: httpHandler,
                preHandler,
                skipRegistrationCheckHttp,
                skipRegistrationCheckWs,
            } = route;

            const handler =
                httpHandler ??
                (() =>
                    newErrorResponse(404, {
                        message:
                            "This is a websocket only route. Did you mean to initiate a websocket connection here?",
                    }));

            server.register(() => {
                server.route({
                    url,
                    method: method ?? "GET",
                    handler: skipRegistrationCheckHttp
                        ? handler
                        : wrapHttpRegistrationCheck(handler),
                    wsHandler: skipRegistrationCheckWs
                        ? wsHandler
                        : wrapWsRegistrationCheck(wsHandler),
                    preHandler,
                });
            });
        }
    }

    server.listen({ port: SERVER_PORT }).catch((err: unknown) => {
        server.log.error(err);
        process.exit(1);
    });

    let shardUrlOrigin = decodeURIComponent(
        SERVICE_DID.startsWith("did:web:") ? SERVICE_DID.slice(8) : "",
    );
    if (shardUrlOrigin === "localhost")
        shardUrlOrigin += `:${SERVER_PORT.toString()}`;
    if (shardUrlOrigin === "") {
        // TODO: resolve did:plc endpoint to get the origin of the shard endpoint described by the did:plc doc
        // for now we just throw.
        throw new Error(
            "did:plc support not yet implemented. Provide a did:web for now. did:plc support will come in the future.",
        );
    }

    const shardAtUri: Required<AtUri> = {
        // @ts-expect-error alas, template literal weirdness continues uwu
        authority: OWNER_DID,
        collection: "systems.gmstn.development.shard",
        rKey: shardUrlOrigin,
    };

    const shardRecord = await getRecordFromAtUri(shardAtUri);

    if (shardRecord.ok) {
        setRegistrationState(true);
    }

    const prismWebsocket = connectToPrism({
        wantedCollections: ["systems.gmstn.development.*"],
    });

    // TODO: probably move this to an `attachListeners` hook that attaches the listeners we want.
    // least tested. will probably have nuances we need to work on in the future
    attachShardRegistrationListener(prismWebsocket);
};

main()
    .then(() => {
        console.log(`Server is running on port ${SERVER_PORT.toString()}`);
    })
    .catch((err: unknown) => {
        console.error("Something went wrong :(");
        console.error(
            "=========================== FULL ERROR BELOW ===========================",
        );
        console.error(err);
    });
