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


    // -----------------------------------------------
    // Basic lengths
    // -----------------------------------------------

    const originalLength =
        originalMessage.length;

    const extractedLength =
        extractedMessage.length;


    // -----------------------------------------------
    // Exact match
    // -----------------------------------------------

    const exactMatch =
        originalMessage === extractedMessage;


    // -----------------------------------------------
    // Levenshtein Edit Distance
    //
    // Optimized implementation:
    // Uses O(n) memory instead of O(n²)
    // -----------------------------------------------

    let source = originalMessage;
    let target = extractedMessage;

    /*
     * Keep the shorter string as the target.
     * This minimizes memory usage.
     */
    if (source.length < target.length) {
        [source, target] =
            [target, source];
    }

    const sourceLength =
        source.length;

    const targetLength =
        target.length;


    let previousRow =
        new Array<number>(
            targetLength + 1,
        );

    let currentRow =
        new Array<number>(
            targetLength + 1,
        );


    // Initial row
    for (
        let j = 0;
        j <= targetLength;
        j++
    ) {
        previousRow[j] = j;
    }


    // Calculate distance
    for (
        let i = 1;
        i <= sourceLength;
        i++
    ) {

        currentRow[0] = i;


        for (
            let j = 1;
            j <= targetLength;
            j++
        ) {

            const cost =
                source[i - 1] === target[j - 1]
                    ? 0
                    : 1;


            currentRow[j] =
                Math.min(
                    currentRow[j - 1] + 1,
                    previousRow[j] + 1,
                    previousRow[j - 1] + cost,
                );
        }


        // Swap rows
        [
            previousRow,
            currentRow,
        ] = [
                currentRow,
                previousRow,
            ];
    }


    const editDistance =
        previousRow[targetLength];


    // -----------------------------------------------
    // Character comparison
    // -----------------------------------------------

    const maxLength =
        Math.max(
            originalLength,
            extractedLength,
        );


    const comparisonLength =
        Math.min(
            originalLength,
            extractedLength,
        );


    let matchingCharacters = 0;


    for (
        let i = 0;
        i < comparisonLength;
        i++
    ) {

        if (
            originalMessage[i] ===
            extractedMessage[i]
        ) {
            matchingCharacters++;
        }
    }


    // -----------------------------------------------
    // Error characters
    // -----------------------------------------------

    const errorCharacters =
        maxLength -
        matchingCharacters;


    // -----------------------------------------------
    // Similarity
    // -----------------------------------------------

    const similarity =
        maxLength === 0
            ? 1
            : matchingCharacters /
            maxLength;


    // -----------------------------------------------
    // Accuracy
    // -----------------------------------------------

    const accuracy =
        similarity * 100;


    // -----------------------------------------------
    // Error rate
    // -----------------------------------------------

    const errorRate =
        maxLength === 0
            ? 0
            : (errorCharacters /
                maxLength) * 100;


    // -----------------------------------------------
    // Return result
    // -----------------------------------------------

    return {

        exactMatch,

        originalLength,

        extractedLength,

        matchingCharacters,

        errorCharacters,

        editDistance,

        similarity,

        errorRate:
            Number(
                errorRate.toFixed(2),
            ),

        accuracy:
            Number(
                accuracy.toFixed(2),
            ),
    };
};