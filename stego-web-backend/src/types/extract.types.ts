// What does the API receive?
export interface ExtractResponseResult {
    mediaFiles: number;
    messageLength: number;
    extractedMessage: string;
}

export interface ExtractSuccessResponse {
    success: true;
    result: ExtractResponseResult;
}

export interface ExtractErrorResponse {
    success: false;
    error: string;
}

export type ExtractResponse =
    | ExtractSuccessResponse
    | ExtractErrorResponse;