import type { RawData } from "ws";

export const wsSyncHandler = (
    data: RawData,
    handler: (jsonData: unknown) => void,
) => {
    const jsonText = rawDataToString(data);
    const jsonData: unknown = JSON.parse(jsonText);
    try {
        handler(jsonData);
    } catch (err: unknown) {
        console.error(
            `Something went wrong while executing the WebSocket handler ${handler.name}`,
        );
        console.error(err);
    }
};

export const rawDataToString = (data: RawData): string => {
    if (Buffer.isBuffer(data)) {
        return data.toString("utf-8");
    }
    if (Array.isArray(data)) {
        return Buffer.concat(data).toString("utf-8");
    }
    return new TextDecoder().decode(data);
};
