import api from "./axios";

import type {
    CompareResponse,
} from "../types/api/compare";

export const compareMessages = async (
    originalFile: File,
    extractedMessage: string,
): Promise<CompareResponse> => {

    const formData = new FormData();

    formData.append(
        "originalFile",
        originalFile,
    );

    formData.append(
        "extractedMessage",
        extractedMessage,
    );

    try {

        const response =
            await api.post<CompareResponse>(
                "/compare",
                formData,
            );

        return response.data;

    } catch (error) {

        console.error(
            "Error comparing messages:",
            error,
        );

        throw error;
    }
};
