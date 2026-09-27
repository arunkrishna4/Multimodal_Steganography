import api from "./axios";

import type {
    SplitEmbedResponse,
} from "../types/api/split-and-embed.types";
import type { SelectedMethod } from "../types/steganography";

export const splitAndEmbed = async (
    originalFile: File,
    mediaFiles: File[],
    selectedMethods: SelectedMethod[],
): Promise<SplitEmbedResponse> => {

    const formData = new FormData();

    formData.append(
        "originalFile",
        originalFile,
    );

    mediaFiles.forEach((file) => {
        formData.append(
            "mediaFiles",
            file,
        );
    });

    formData.append(
        "selectedMethods",
        JSON.stringify(selectedMethods),
    );

    try {

        const response =
            await api.post<SplitEmbedResponse>(
                "/split-and-embed",
                formData,
            );

        return response.data;

    } catch (error) {

        console.error(
            "Error splitting and embedding:",
            error,
        );

        throw error;
    }
};