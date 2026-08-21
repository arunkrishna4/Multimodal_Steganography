import {
    CheckCircle2,
    CircleAlert,
    BarChart3,
    ShieldCheck,
} from "lucide-react";
import "../../styles/ComparisonResultCard.css";

interface ComparisonResult {
    isMatch: boolean;

    originalLength: number;
    extractedLength: number;

    matchingCharacters: number;
    errorCharacters: number;

    errorRate: number;
    accuracy: number;

    psnr?: number;
    snr?: number;
}

interface ComparisonResultCardProps {
    result: ComparisonResult;
}

export const ComparisonResultCard = ({
    result,
}: ComparisonResultCardProps) => {
    return (
        <section className="comparison-result-card">

            {/* Header */}
            <div className="comparison-result-header">

                <div
                    className={`comparison-status-icon ${result.isMatch
                        ? "comparison-success"
                        : "comparison-warning"
                        }`}
                >
                    {result.isMatch ? (
                        <CheckCircle2 size={23} />
                    ) : (
                        <CircleAlert size={23} />
                    )}
                </div>

                <div>
                    <h2>
                        {result.isMatch
                            ? "Messages Match"
                            : "Messages Do Not Match"}
                    </h2>

                    <p>
                        {result.isMatch
                            ? "The extracted message is identical to the original secret message."
                            : "Differences were detected between the original and extracted messages."}
                    </p>
                </div>

            </div>


            {/* Accuracy */}
            <div className="comparison-accuracy">

                <div className="accuracy-icon">
                    <ShieldCheck size={22} />
                </div>

                <div className="accuracy-content">

                    <div className="accuracy-label">
                        Extraction Accuracy
                    </div>

                    <div className="accuracy-value">
                        {result.accuracy.toFixed(2)}%
                    </div>

                </div>

                <div className="accuracy-bar">

                    <div
                        className="accuracy-bar-fill"
                        style={{
                            width: `${Math.min(result.accuracy, 100)}%`,
                        }}
                    />

                </div>

            </div>


            {/* Statistics */}
            <div className="comparison-section">

                <div className="comparison-section-heading">
                    <BarChart3 size={18} />

                    <h3>Comparison Details</h3>
                </div>


                <div className="comparison-stats-grid">

                    <Stat
                        label="Original length"
                        value={`${result.originalLength} chars`}
                    />

                    <Stat
                        label="Extracted length"
                        value={`${result.extractedLength} chars`}
                    />

                    <Stat
                        label="Matching characters"
                        value={result.matchingCharacters}
                    />

                    <Stat
                        label="Error characters"
                        value={result.errorCharacters}
                    />

                    <Stat
                        label="Error rate"
                        value={`${result.errorRate.toFixed(2)}%`}
                    />

                    <Stat
                        label="Accuracy"
                        value={`${result.accuracy.toFixed(2)}%`}
                    />

                </div>

            </div>


            {/* Media Quality */}
            <div className="comparison-section">

                <div className="comparison-section-heading">
                    <BarChart3 size={18} />

                    <h3>Media Quality</h3>
                </div>


                <div className="comparison-stats-grid">

                    {result.psnr !== undefined && (
                        <Stat
                            label="Image PSNR"
                            value={`${result.psnr.toFixed(2)} dB`}
                        />
                    )}

                    {result.snr !== undefined && (
                        <Stat
                            label="Audio SNR"
                            value={`${result.snr.toFixed(2)} dB`}
                        />
                    )}

                </div>

            </div>

        </section>
    );
};


/* =========================================
   STAT COMPONENT
   ========================================= */

interface StatProps {
    label: string;
    value: string | number;
}

const Stat = ({ label, value }: StatProps) => {
    return (
        <div className="comparison-stat">

            <span>{label}</span>

            <strong>{value}</strong>

        </div>
    );
};