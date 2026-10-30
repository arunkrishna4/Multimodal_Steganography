import { GitCompare, RotateCcw, LoaderCircle } from "lucide-react";
import { CompareTextUpload } from "../../components/compare/CompareTextUpload";
import { ComparisonResultCard } from "../../components/reciever/ComparisonResultCard";
import { useCompareWorkflow } from "../../hooks/useCompareWorkflow";
import "../../styles/CompareDashboard.css";

export const CompareDashboard = () => {
    const {
        originalFile,
        setOriginalFile,
        originalText,
        setOriginalText,
        extractedFile,
        setExtractedFile,
        extractedText,
        setExtractedText,
        isComparing,
        isCompleted,
        error,
        compareResponse,
        handleCompare,
        clearComparison,
    } = useCompareWorkflow();

    const result =
        compareResponse?.success ? compareResponse.result : null;

    const hasOriginalInput =
        originalFile !== null || originalText.trim().length > 0;

    const hasExtractedInput =
        extractedFile !== null || extractedText.trim().length > 0;

    return (
        <main className="compare-dashboard">
            <header className="compare-page-header">
                <div className="sender-header">
                    Compare Messages
                    <div className="sender-description">
                        Compare your original secret message with the extracted
                        message to measure its accuracy.
                    </div>
                </div>
            </header>

            <div className="compare-upload-grid">
                <CompareTextUpload
                    title="Original Message"
                    description="Upload the original secret text file or paste its contents."
                    file={originalFile}
                    onFileChange={setOriginalFile}
                    text={originalText}
                    onTextChange={setOriginalText}
                />

                <CompareTextUpload
                    title="Extracted Message"
                    description="Upload the extracted text file or paste its contents."
                    file={extractedFile}
                    onFileChange={setExtractedFile}
                    text={extractedText}
                    onTextChange={setExtractedText}
                />
            </div>

            {error && (
                <div className="compare-error" role="alert">
                    {error}
                </div>
            )}

            <div className="compare-actions">
                <button
                    type="button"
                    className="compare-submit-button"
                    onClick={handleCompare}
                    disabled={
                        isComparing ||
                        !hasOriginalInput ||
                        !hasExtractedInput ||
                        isCompleted

                    }
                >
                    {isComparing ? (
                        <>
                            <LoaderCircle
                                size={18}
                                className="compare-spinner"
                            />
                            Comparing...
                        </>
                    ) : (
                        <>
                            <GitCompare size={18} />
                            Compare Messages
                        </>
                    )}
                </button>

                <button
                    type="button"
                    className="compare-reset-button"
                    onClick={clearComparison}
                    disabled={isComparing}
                >
                    <RotateCcw size={17} />
                    Clear
                </button>
            </div>

            {result && (
                <div className="compare-result-container">
                    <ComparisonResultCard
                        result={{
                            isMatch: result.exactMatch,
                            originalLength: result.originalLength,
                            extractedLength: result.extractedLength,
                            matchingCharacters: result.matchingCharacters,
                            errorCharacters: result.errorCharacters,
                            errorRate: result.errorRate,
                            accuracy: result.accuracy,
                        }}
                    />
                </div>
            )}
        </main>
    );
};