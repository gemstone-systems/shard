import type {
    HttpErrorResponse,
    HttpResponseData,
} from "@/lib/types/http/responses";
import { HttpResponseStatusType } from "@/lib/types/http/responses";

export const newSuccessResponse = (data: HttpResponseData) => {
    const response = {
        status: HttpResponseStatusType.SUCCESS,
        data,
    };
    return new Response(JSON.stringify(response), {
        status: 200,
        headers: {
            "Content-Type": "application/json",
        },
    });
};

export const newErrorResponse = (
    httpCode: number,
    errorObj: HttpErrorResponse,
) => {
    return new Response(JSON.stringify(errorObj), {
        status: httpCode,
        headers: {
            "Content-Type": "application/json",
        },
    });
};
