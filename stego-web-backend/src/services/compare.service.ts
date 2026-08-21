import {
    CompareRequest,
    CompareResult,
} from "../types/compare.types";

export const compareMessages = (
    request: CompareRequest
): CompareResult => {
    const {
        originalMessage,
        extractedMessage,
    } = request;

    const originalLength = originalMessage.length;
    const extractedLength = extractedMessage.length;

    const exactMatch =
        originalMessage === extractedMessage;

    // -----------------------------------------------
    // Levenshtein Edit Distance
    // -----------------------------------------------

    const rows = originalLength + 1;
    const cols = extractedLength + 1;

    const matrix: number[][] = Array.from(
        { length: rows },
        () => Array(cols).fill(0)
    );

    for (let i = 0; i <= originalLength; i++) {
        matrix[i][0] = i;
    }

    for (let j = 0; j <= extractedLength; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= originalLength; i++) {
        for (let j = 1; j <= extractedLength; j++) {

            const cost =
                originalMessage[i - 1] === extractedMessage[j - 1]
                    ? 0
                    : 1;

            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }

    const editDistance =
        matrix[originalLength][extractedLength];

    // -----------------------------------------------
    // Character comparison
    // -----------------------------------------------

    const maxLength = Math.max(
        originalLength,
        extractedLength
    );

    let matchingCharacters = 0;

    const comparisonLength = Math.min(
        originalLength,
        extractedLength
    );

    for (let i = 0; i < comparisonLength; i++) {
        if (originalMessage[i] === extractedMessage[i]) {
            matchingCharacters++;
        }
    }

    const errorCharacters =
        maxLength - matchingCharacters;

    // -----------------------------------------------
    // Accuracy / Similarity
    // -----------------------------------------------

    const similarity =
        maxLength === 0
            ? 1
            : matchingCharacters / maxLength;

    const accuracy = similarity * 100;

    const errorRate =
        maxLength === 0
            ? 0
            : (errorCharacters / maxLength) * 100;

    return {
        exactMatch,
        originalLength,
        extractedLength,
        matchingCharacters,
        errorCharacters,
        editDistance,
        similarity,
        errorRate: Number(errorRate.toFixed(2)),
        accuracy: Number(accuracy.toFixed(2)),
    };
};