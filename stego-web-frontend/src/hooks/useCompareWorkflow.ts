import { useState } from "react";
import { compareTextMessages } from "../api/compare.api";
import type { CompareResponse } from "../types/api/compare";

export const useCompareWorkflow = () => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [originalText, setOriginalText] = useState("");

    const [extractedFile, setExtractedFile] = useState<File | null>(null);
    const [extractedText, setExtractedText] = useState("");

    const [isComparing, setIsComparing] = useState(false);
    const [error, setError] = useState("");

    const [compareResponse, setCompareResponse] =
        useState<CompareResponse | null>(null);

    const handleCompare = async () => {
        if (!originalFile && !originalText.trim()) {
            setError("Please upload or paste the original message.");
            return;
        }

        if (!extractedFile && !extractedText.trim()) {
            setError("Please upload or paste the extracted message.");
            return;
        }

        setIsComparing(true);
        setError("");
        setCompareResponse(null);

        try {
            // Read file contents when files are selected.
            const originalMessage = originalFile
                ? await originalFile.text()
                : originalText;

            const extractedMessage = extractedFile
                ? await extractedFile.text()
                : extractedText;

            const response = await compareTextMessages(
                originalMessage,
                extractedMessage,
            );

            if (response.success == false) {
                setError(response.error);
                return;
            }

            setCompareResponse(response);
        } catch {
            setError("Unable to compare messages. Please try again.");
        } finally {
            setIsComparing(false);
        }
    };

    const clearComparison = () => {
        setOriginalFile(null);
        setOriginalText("");

        setExtractedFile(null);
        setExtractedText("");

        setCompareResponse(null);
        setError("");
    };

    return {
        originalFile,
        setOriginalFile,
        originalText,
        setOriginalText,

        extractedFile,
        setExtractedFile,
        extractedText,
        setExtractedText,

        isComparing,
        error,
        compareResponse,

        handleCompare,
        clearComparison,
    };
};