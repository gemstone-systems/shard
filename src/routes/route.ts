import type { Route } from "@/lib/types/routes";

export const indexRoute: Route = {
    method: "GET",
    handler: () => {
        return new Response("this is a gemstone systems shard", {
            headers: { "content-type": "text/plain; charset=utf-8" },
        });
    },
};
