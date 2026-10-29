// src/hooks/useCompareWorkflow.ts

import { useState } from "react";
import { compareMessages } from "../api/compare.api";
import type { CompareResponse } from "../types/api/compare";

export const useCompareWorkflow = () => {
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [extractedFile, setExtractedFile] = useState<File | null>(null);
    const [extractedText, setExtractedText] = useState("");
    const [isComparing, setIsComparing] = useState(false);
    const [error, setError] = useState("");
    const [compareResponse, setCompareResponse] =
        useState<CompareResponse | null>(null);

    const handleCompare = async () => {
        if (!originalFile) {
            setError("Please upload the original text file.");
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
            const message = extractedFile
                ? await extractedFile.text()
                : extractedText;

            const response = await compareMessages(originalFile, message);

            if (response.success === false) {
                setError(response.error);
                return;
            }

            setCompareResponse(response);

            setCompareResponse(response);
        } catch {
            setError("Unable to compare messages. Please try again.");
        } finally {
            setIsComparing(false);
        }
    };

    const clearComparison = () => {
        setOriginalFile(null);
        setExtractedFile(null);
        setExtractedText("");
        setCompareResponse(null);
        setError("");
    };

    return {
        originalFile,
        setOriginalFile,
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