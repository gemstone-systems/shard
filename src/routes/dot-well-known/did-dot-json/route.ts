import { SERVICE_DID } from "@/lib/env";
import type { Did } from "@/lib/types/atproto";
import { didDocumentSchema, didWebSchema } from "@/lib/types/atproto";
import type { Route, RouteHandler } from "@/lib/types/routes";
import { didDoc as importedDidDoc } from "@/lib/utils/did";
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

    const { success: isDidWeb } = didWebSchema.safeParse(did);
    if (!isDidWeb) return serveDidPlc;

    const serveDidDoc: RouteHandler = () => {
        const didDoc = importedDidDoc;
        if (!didDoc) {
            return newErrorResponse(500, {
                message:
                    "Somehow tried to serve a did:web document when no did:web document was available. Specifically, somehow parsing the same SERVICE_DID environment variable resulted in both a did:web and a not did:web",
            });
        }
        return Response.json(didDoc);
    };

    return serveDidDoc;
};

export const didWebDocRoute: Route = {
    method: "GET",
    handler: routeHandlerFactory(SERVICE_DID),
};
