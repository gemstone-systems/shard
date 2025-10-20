import type { HttpResponseErrorInfo } from "@/lib/types/http/errors";
import type {
    HttpErrorResponse,
    HttpResponseData,
    HttpSuccessResponse,
} from "@/lib/types/http/responses";
import { HttpResponseStatusType } from "@/lib/types/http/responses";

export const newSuccessResponse = (data: HttpResponseData) => {
    const body: HttpSuccessResponse = {
        status: HttpResponseStatusType.SUCCESS,
        data,
    };
    return new Response(JSON.stringify(body), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const newErrorResponse = (
    httpCode: number,
    errorObj: HttpResponseErrorInfo,
) => {
    const body: HttpErrorResponse = {
        status: HttpResponseStatusType.ERROR,
        error: errorObj,
    };
    return new Response(JSON.stringify(body), {
        status: httpCode,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
