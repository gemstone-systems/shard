import { SERVICE_DID } from "@/lib/env";
import type { Did } from "@/lib/types/atproto";
import { didDocumentSchema, didWebSchema } from "@/lib/types/atproto";
import type { Route, RouteHandler } from "@/lib/types/routes";
import { createDidWebDoc } from "@/lib/utils/did";
import { newErrorResponse } from "@/lib/utils/http/responses";

const routeHandlerFactory = (did: Did) => {
    const serveDidPlc: RouteHandler = async () => {
        const plcDirectoryReq = new Request(`https://plc.directory/${did}`);
        const plcDirectoryRes = await fetch(plcDirectoryReq);
        const {
            success,
            data: didDocument,
            error,
        } = didDocumentSchema.safeParse(await plcDirectoryRes.json());

        if (!success)
            return newErrorResponse(500, {
                message:
                    "did:plc was not set properly. Either the Shard's did:plc is wrong, or the did:plc was not registered with a public ledger.",
                details: error,
            });

        return Response.json(didDocument);
    };

    const { success: isDidWeb, data: didWeb } = didWebSchema.safeParse(did);
    if (!isDidWeb) return serveDidPlc;

    const serveDidDoc: RouteHandler = () => {
        const didDoc = createDidWebDoc(didWeb);

        return Response.json(didDoc);
    };

    return serveDidDoc;
};

export const didWebDocRoute: Route = {
    method: "GET",
    handler: routeHandlerFactory(SERVICE_DID),
};
