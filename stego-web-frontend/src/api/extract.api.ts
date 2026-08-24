import api from "./axios";

import type {
    ExtractResponse,
} from "../types/receiver";

export const extractMessage = async (
    mediaFiles: File[],
): Promise<ExtractResponse> => {

    const formData = new FormData();

    mediaFiles.forEach((file) => {
        formData.append("stegoFiles", file);
    });

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