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
}

export interface SplitEmbedResult {
    success: true;
    totalParts: number;
    secretMessageLength: number;
    files: SplitEmbedMediaResult[];
}

export interface SplitEmbedErrorResponse {
    success: false;
    error: string;
}

export type SplitEmbedResponse =
    | SplitEmbedResult
    | SplitEmbedErrorResponse;