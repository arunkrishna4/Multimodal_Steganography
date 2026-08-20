import { FileText, Scissors, HardDrive } from "lucide-react";

import type { SplitInfo } from "../../types/embed";

interface SplitSummaryProps {
  splitInfo: SplitInfo;
}

export const SplitSummary = ({ splitInfo }: SplitSummaryProps) => {
  return (
    <section className="embed-card">
      <div className="embed-section-heading">
        <div className="embed-section-icon">
          <Scissors size={21} />
        </div>

        <div>
          <h2>How your message will be split</h2>

          <p>
            Your secret file will be divided across the selected media files as
            shown below.
          </p>
        </div>
      </div>

      <div className="split-summary-grid">
        <div className="split-summary-item">
          <FileText size={20} />

          <span>Secret file</span>

          <strong>{splitInfo.secretFileName}</strong>
        </div>

        <div className="split-summary-item">
          <HardDrive size={20} />

          <span>File size</span>

          <strong>{formatFileSize(splitInfo.secretFileSize)}</strong>
        </div>

        <div className="split-summary-item">
          <Scissors size={20} />

          <span>Split into</span>

          <strong>{splitInfo.totalParts} parts</strong>
        </div>
      </div>
    </section>
  );
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};
