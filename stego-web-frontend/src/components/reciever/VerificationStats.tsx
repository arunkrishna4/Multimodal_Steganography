import type { VerificationResult } from "../../types/steganography";

interface VerificationStatsProps {
  result: VerificationResult;
}

export const VerificationStats = ({ result }: VerificationStatsProps) => {
  return (
    <>
      <div className="verification-stat-grid">
        <div className="verification-stat">
          <span>Error Rate</span>

          <strong className="error-rate">{result.errorRate.toFixed(4)}%</strong>
        </div>

        <div className="verification-stat">
          <span>Integrity</span>

          <strong className="integrity-rate">
            {result.integrity.toFixed(4)}%
          </strong>
        </div>

        <div className="verification-stat">
          <span>Chars Matched</span>

          <strong className="matched-count">
            {result.charsMatched.toLocaleString()}
          </strong>
        </div>

        <div className="verification-stat">
          <span>Total Chars</span>

          <strong className="total-count">
            {result.totalChars.toLocaleString()}
          </strong>
        </div>
      </div>

      <div className="fidelity-header">
        <span>Message fidelity</span>

        <strong>{result.integrity.toFixed(4)}%</strong>
      </div>

      <div className="fidelity-bar">
        <div
          className="fidelity-progress"
          style={{
            width: `${result.integrity}%`,
          }}
        />
      </div>
    </>
  );
};
