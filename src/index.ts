import { routes } from "@/routes";
import { server } from "@/server";

for (const [url, route] of Object.entries(routes)) {
    const { handler, method } = route;
    server.route({
        url,
        method,
        handler,
    });
}

server.listen({ port: 3000 }).catch((err: unknown) => {
    server.log.error(err);
    process.exit(1);
});
