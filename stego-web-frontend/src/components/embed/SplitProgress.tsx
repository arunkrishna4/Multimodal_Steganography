import { Image, Video, Music, FileText, type LucideIcon } from "lucide-react";

import type { EmbedFile, MediaType } from "../../types/embed";
import type { SplitEmbedFileResult } from "../../types/api/split-and-embed.types";

interface SplitProgressProps {
  files: SplitEmbedFileResult[];
}

const ICONS: Record<MediaType, LucideIcon> = {
  image: Image,
  video: Video,
  audio: Music,
  text: FileText,
};

export const SplitProgress = ({ files }: SplitProgressProps) => {

  // Total number of message bits distributed across all files
  const totalMessageBits = files.reduce(
    (total, file) => total + file.messageBits,
    0,
  );

  return (
    <section className="embed-card">

      <div className="embed-section-heading">
        <div className="embed-section-icon">
          <span className="scissors-symbol">✂</span>
        </div>

        <div>
          <h2>Message distribution</h2>

          <p>
            The secret message was distributed across your selected media
            files.
          </p>
        </div>
      </div>


      {/* Distribution bar */}

      <div className="distribution-bar">

        {files.map((file) => {

          const percentage =
            totalMessageBits > 0
              ? (file.messageBits / totalMessageBits) * 100
              : 0;

          return (
            <div
              key={file.sequence}
              className={`distribution-segment ${file.mediaType}`}
              style={{
                width: `${percentage}%`,
              }}
            >
              {percentage >= 15 && (
                <span>
                  {getLabel(file.mediaType)}
                </span>
              )}
            </div>
          );

        })}

      </div>


      {/* File breakdown */}

      <div className="split-file-list">

        {files.map((file) => {

          const Icon = ICONS[file.mediaType];

          const percentage =
            totalMessageBits > 0
              ? (file.messageBits / totalMessageBits) * 100
              : 0;

          return (
            <div
              key={file.sequence}
              className="split-file-row"
            >

              <div className="split-file-icon">
                <Icon size={22} />
              </div>


              <div className="split-file-info">

                <strong>
                  {file.mediaType}
                </strong>

                <span>
                  {file.messageBits.toLocaleString()} message bits
                  {" · "}
                  {file.messageLength.toLocaleString()} characters
                </span>

              </div>


              <strong className="split-percentage">
                {percentage.toFixed(1)}%
              </strong>

            </div>
          );

        })}

      </div>

    </section>
  );
};

const getLabel = (mediaType: EmbedFile["mediaType"]) => { switch (mediaType) { case "image": return "Image"; case "video": return "Video"; case "audio": return "Audio"; case "text": return "Text"; default: return ""; } };