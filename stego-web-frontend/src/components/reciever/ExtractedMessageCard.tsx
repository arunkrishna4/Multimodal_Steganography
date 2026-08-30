import { CheckCircle2, Copy, FileText, Files, LoaderCircle } from "lucide-react";
import { useState } from "react";
import { SecretFileUpload } from "../sender/SecretFileUpload";
import "../../styles/ExtractedMessageCard.css";

interface ExtractedMessageCardProps {
  message: string;
  totalParts: number;

  originalFile: File | null;
  onOriginalFileUpload: (file: File) => void;

  onCompare: () => void;

  disabled?: boolean;
  isComparing?: boolean;
  hasOriginalFile?: boolean;

}

export const ExtractedMessageCard = ({
  message,
  totalParts,
  originalFile,
  onOriginalFileUpload,
  onCompare,
  disabled = false,
  isComparing = false,
  hasOriginalFile = false,
}: ExtractedMessageCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Failed to copy message:", error);
    }
  };

  const isCompleted = disabled && hasOriginalFile && !isComparing;

  return (
    <section className="extracted-message-card">

      {/* Success Header */}
      <div className="extracted-message-header">
        <div className="extracted-success-icon">
          <CheckCircle2 size={22} />
        </div>

        <div>
          <h2>Message Extracted Successfully!</h2>

          <p>
            The hidden message has been reconstructed from your
            selected media files.
          </p>
        </div>
      </div>

      {/* Extraction Summary */}
      <div className="extraction-summary">

        <div className="extraction-summary-item">
          <div className="extraction-summary-icon">
            <Files size={18} />
          </div>

          <div>
            <span>Media files</span>
            <strong>{totalParts}</strong>
          </div>
        </div>

        <div className="extraction-summary-item">
          <div className="extraction-summary-icon">
            <FileText size={18} />
          </div>

          <div>
            <span>Message length</span>
            <strong>{message.length} characters</strong>
          </div>
        </div>

      </div>

      {/* Extracted Message */}
      <div className="extracted-message-section">

        <div className="extracted-message-title">
          <div>
            <h3>Extracted secret message</h3>

            <p>
              This is the message reconstructed from the stego files.
            </p>
          </div>

          <button
            type="button"
            className="copy-message-button"
            onClick={handleCopy}
          >
            <Copy size={15} />

            {copied ? "Copied" : "Copy"}
          </button>
        </div>

        <div className="extracted-message-box">
          {message}
        </div>

      </div>

      {/* Original Message */}
      <div className="original-message-upload">

        <SecretFileUpload
          file={originalFile}
          onUpload={onOriginalFileUpload}
          title="Upload original secret message"
          description="Add the original text file to verify the accuracy of the extracted message."
          emptyLabel="Choose the original text file"
          readyLabel="Ready to compare"
        />

      </div>

      {/* Compare */}
      <div className="compare-message-section">

        <div>
          <h3>Verify the extracted message</h3>

          <p>
            Compare the extracted message with the original
            secret message to measure extraction accuracy.
          </p>
        </div>

        <button
          type="button"
          className="compare-message-button"
          onClick={onCompare}
          disabled={!hasOriginalFile || isComparing || isCompleted}
          style={{
            opacity:
              !hasOriginalFile || isComparing || isCompleted
                ? 0.5
                : 1,
            cursor:
              !hasOriginalFile || isComparing || isCompleted
                ? "not-allowed"
                : "pointer",
          }}
        >
          {isComparing ? (
            <>
              <LoaderCircle size={15} className="spin" />
              Comparing...
            </>
          ) : isCompleted ? (
            "Compared"
          ) : !hasOriginalFile ? (
            "Upload Original Text"
          ) : (
            "Compare Text"
          )}
        </button>

      </div>

    </section>
  );
};