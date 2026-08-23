export type MediaType = "image" | "audio";

export interface SplitEmbedMediaResult {
    sequence: number;
    mediaType: MediaType;
    inputFile: string;
    outputFile: string;
    messageLength: number;
    messageBits: number;
    headerBits: number;
    totalBits: number;
    psnr?: number;
    snr?: number;
    sampleRate?: number;
    downloadUrl: string;
}

export interface SplitEmbedResult {
    success: true;
    totalParts: number;
    secretMessageLength: number;
    files: SplitEmbedMediaResult[];
}

export interface SplitEmbedSuccessResponse {
    success: true;
    result: SplitEmbedResult;
}

export interface SplitEmbedErrorResponse {
    success: false;
    error: string;
}

export type SplitEmbedResponse =
    | SplitEmbedSuccessResponse
    | SplitEmbedErrorResponse;