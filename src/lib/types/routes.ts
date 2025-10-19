import type { FastifyReply, FastifyRequest } from "fastify";
import type { WebSocket } from "ws";

export type RouteHandler = (
    req: FastifyRequest | undefined,
    reply: FastifyReply | undefined,
) => Response;

export type Method = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface Route {
    method: Method;
    handler: RouteHandler;
    wsHandler?: undefined;
}

export type WsRouteHandler = (
    socket: WebSocket,
    req: FastifyRequest | undefined,
) => void;

export interface WsRoute {
    method?: Method;
    handler?: RouteHandler;
    wsHandler: WsRouteHandler;
}
