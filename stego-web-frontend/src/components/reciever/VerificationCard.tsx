import { AlertTriangle, Search } from "lucide-react";

import type { VerificationResult } from "../../types/steganography";

import { VerificationStats } from "./VerificationStats";

interface VerificationCardProps {
  result: VerificationResult;
  isVerified: boolean;
  onVerify: () => void;
}

export const VerificationCard = ({
  result,
  isVerified,
}: VerificationCardProps) => {
  return (
    <section className="receiver-card verification-card">
      <div className="receiver-section-heading">
        <div className="receiver-section-icon">
          <Search size={20} />
        </div>

        <div>
          <h2>Verify the Message</h2>

          <p>
            Compare the extracted message with the original to check if it was
            transmitted without errors.
          </p>
        </div>
      </div>

      {isVerified && (
        <>
          <VerificationStats result={result} />

          <div className="verification-result">
            <AlertTriangle size={20} />

            <strong>Minor errors — Message mostly intact</strong>
          </div>
        </>
      )}
    </section>
  );
};
