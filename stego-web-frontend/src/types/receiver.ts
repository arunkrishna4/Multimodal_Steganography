export interface ExtractResult {
    mediaFiles: number;
    messageLength: number;
    extractedMessage: string;
}

export interface ExtractSuccessResponse {
    success: true;
    result: ExtractResult;
}

export interface ExtractErrorResponse {
    success: false;
    error: string;
}

export type ExtractResponse =
    | ExtractSuccessResponse
    | ExtractErrorResponse;