import type { Route } from "@/lib/types/routes";

export const indexRoute: Route = {
    method: "GET",
    handler: () => {
        return new Response(JSON.stringify({ hello: "world" }));
    },
};
