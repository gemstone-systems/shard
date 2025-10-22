import { SERVICE_DID } from "@/lib/env";
import { didDocResolver } from "@/lib/utils/atproto";
import { ServiceJwtVerifier } from "@atcute/xrpc-server/auth";

export const verifyServiceJwt = async (jwt: string) => {
    const verifier = new ServiceJwtVerifier({
        resolver: didDocResolver,
        serviceDid: SERVICE_DID,
    });
    return await verifier.verify(jwt);
};
