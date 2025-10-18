import type { FastifyReply, FastifyRequest } from "fastify";

export type RouteHandler = (
    req: FastifyRequest | undefined,
    reply: FastifyReply | undefined,
) => Response;

export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface Route {
    method: Method;
    handler: RouteHandler;
}
