import api from "./axios";

import type {
    ExtractResponse,
} from "../types/receiver";
import type { SelectedMethod } from "../types/steganography";

export const extractMessage = async (
    mediaFiles: File[],
    selectedMethods: SelectedMethod[],
): Promise<ExtractResponse> => {

    const formData = new FormData();

    mediaFiles.forEach((file) => {
        formData.append("stegoFiles", file);
    });

    formData.append(
        "selectedMethods",
        JSON.stringify(selectedMethods)
    );

    try {

        const response = await api.post<ExtractResponse>(
            "/extract",
            formData,
        );

        return response.data;

    } catch (error) {

        console.error(
            "Error extracting message:",
            error,
        );

        throw error;
    }
};

export const downloadExtractedMessage = async (
    extractedMessage: string,
): Promise<Blob> => {

    try {
        const response = await api.post(
            "/extract/download",
            extractedMessage,
            {
                headers: {
                    "Content-Type": "text/plain",
                },
                responseType: "blob",
            },
        );

        return response.data;

    } catch (error) {
        console.error(
            "Error downloading extracted message:",
            error,
        );

        throw error;
    }
};