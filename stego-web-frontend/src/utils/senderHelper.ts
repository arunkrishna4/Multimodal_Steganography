import type { MediaType } from "../types/steganography";

export const getMediaType = (file: File): MediaType => {
    if (file.type.startsWith("image/")) {
        return "image";
    }

    if (file.type.startsWith("video/")) {
        return "video";
    }

    if (file.type.startsWith("audio/")) {
        return "audio";
    }

    return "text";
};