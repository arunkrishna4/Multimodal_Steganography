import { LockKeyhole } from "lucide-react";

import "../../styles/SplitEmbed.css";
import { SplitSummary } from "../../components/embed/SplitSummary";
import { SplitProgress } from "../../components/embed/SplitProgress";
import { EmbedFileCard } from "../../components/embed/EmbedFileCard";
import { EmbedSuccess } from "../../components/embed/EmbedSuccess";

import { useEmbedProcess } from "../../hooks/useEmbedProcess";

import type { SplitInfo } from "../../types/embed";

interface SplitEmbedProps {
  splitInfo: SplitInfo;
  onBack: () => void;
}

export const SplitEmbed = ({ splitInfo, onBack }: SplitEmbedProps) => {
  const { files, isEmbedding, isComplete, startEmbedding } = useEmbedProcess({
    splitInfo,
  });

  return (
    <div className="embed-page">
      {/* PAGE HEADER */}

      <header className="page-header">
        <p className="eyebrow">SENDER</p>

        <h1>Split & Embed</h1>

        <p className="page-description">
          Divide your secret message and securely embed each part into your
          selected media.
        </p>
      </header>

      {/* MAIN CONTENT */}

      <div className="embed-grid">
        {/* LEFT */}

        <div className="embed-column">
          <SplitSummary
            splitInfo={{
              ...splitInfo,
              files,
            }}
          />

          <SplitProgress files={files} />
        </div>

        {/* RIGHT */}

        <div className="embed-column">
          <section className="embed-card">
            <div className="embed-section-heading">
              <div className="embed-section-icon">
                <LockKeyhole size={21} />
              </div>

              <div>
                <h2>Embed data into your files</h2>

                <p>
                  Click the button below to hide the split message inside each
                  of your media files.
                </p>
              </div>
            </div>

            <div className="embed-file-list">
              {files.map((file) => (
                <EmbedFileCard key={file.id} file={file} />
              ))}
            </div>

            {!isComplete && (
              <button
                className="embed-start-button"
                onClick={startEmbedding}
                disabled={isEmbedding}
              >
                {isEmbedding
                  ? "Embedding message..."
                  : "🔐 Hide Message in Files"}
              </button>
            )}

            {isComplete && <EmbedSuccess fileCount={files.length} />}
          </section>
        </div>
      </div>

      {/* BACK */}

      <button className="embed-back-button" onClick={onBack}>
        ← Back to Setup
      </button>
    </div>
  );
};
