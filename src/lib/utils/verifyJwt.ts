import { SERVICE_DID } from "@/lib/env";
import {
    CompositeDidDocumentResolver,
    PlcDidDocumentResolver,
    WebDidDocumentResolver,
    type DidDocumentResolver,
} from "@atcute/identity-resolver";
import { ServiceJwtVerifier } from "@atcute/xrpc-server/auth";

const didDocResolver: DidDocumentResolver = new CompositeDidDocumentResolver({
    methods: {
        plc: new PlcDidDocumentResolver(),
        web: new WebDidDocumentResolver(),
    },
});

export const verifyServiceJwt = async (jwt: string) => {
    const verifier = new ServiceJwtVerifier({
        resolver: didDocResolver,
        serviceDid: SERVICE_DID,
    });
    return await verifier.verify(jwt);
};
