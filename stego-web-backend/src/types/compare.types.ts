export interface CompareRequest {
    originalMessage: string;
    extractedMessage: string;
}

export interface CompareResult {
    exactMatch: boolean;
    originalLength: number;
    extractedLength: number;
    matchingCharacters: number;
    errorCharacters: number;
    editDistance: number;
    similarity: number;
    errorRate: number;
    accuracy: number;
}

export interface CompareSuccessResponse {
    success: true;
    result: CompareResult;
}

export interface CompareErrorResponse {
    success: false;
    error: string;
}

export type CompareResponse =
    | CompareSuccessResponse
    | CompareErrorResponse;