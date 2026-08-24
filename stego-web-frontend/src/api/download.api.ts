import axios, { type AxiosResponse } from "axios";

const API_BASE_URL = import.meta.env.VITE_API_DOWNLOAD_URL;

export const downloadFile = async (
    downloadUrl: string,
    fileName?: string,
) => {
    const response = await axios.get(`${API_BASE_URL}${downloadUrl}`, {
        responseType: "blob",
    });

    const blobUrl = window.URL.createObjectURL(response.data);

    const link = document.createElement("a");

    link.href = blobUrl;
    link.download = fileName || getFileNameFromResponse(response, downloadUrl);

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);
};

const getFileNameFromResponse = (
    response: AxiosResponse,
    fallbackUrl: string,
) => {
    const disposition = response.headers["content-disposition"];

    if (disposition) {
        const match = String(disposition).match(/filename="?([^"]+)"?/);

        if (match?.[1]) {
            return match[1];
        }
    }

    // Fall back to the last segment of the URL, or a generic name
    const segments = fallbackUrl.split("/");
    return segments[segments.length - 1] || "download";
};