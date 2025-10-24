import { setupDbWithMigrations } from "@/db";
import { DB_URL, SERVER_PORT } from "@/lib/env";
import { newErrorResponse } from "@/lib/utils/http/responses";
import {
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
