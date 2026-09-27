export type MediaType = "image" | "audio";

export interface SplitEmbedMediaResult {
    sequence: number;
    mediaType: MediaType;
    method?: string;
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

export interface SplitEmbedSuccessResponse {
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
    | SplitEmbedSuccessResponse
    | SplitEmbedErrorResponse;