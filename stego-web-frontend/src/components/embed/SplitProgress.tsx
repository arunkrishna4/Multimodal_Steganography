import { Image, Video, Music, FileText, type LucideIcon } from "lucide-react";

import type { EmbedFile, MediaType } from "../../types/embed";

interface SplitProgressProps {
  files: EmbedFile[];
}

const ICONS: Record<MediaType, LucideIcon> = {
  image: Image,
  video: Video,
  audio: Music,
  text: FileText,
};

export const SplitProgress = ({ files }: SplitProgressProps) => {
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

      <div className="distribution-bar">
        {files.map((file) => (
          <div
            key={file.id}
            className={`distribution-segment ${file.mediaType}`}
            style={{
              width: `${file.percentage}%`,
            }}
          >
            {file.percentage >= 15 && <span>{getLabel(file.mediaType)}</span>}
          </div>
        ))}
      </div>

      <div className="split-file-list">
        {files.map((file) => {
          const Icon = ICONS[file.mediaType];

          return (
            <div key={file.id} className="split-file-row">
              <div className="split-file-icon">
                <Icon size={22} />
              </div>

              <div className="split-file-info">
                <strong>{file.mediaType}</strong>

                <span>
                  {file.bytes.toLocaleString()} bytes
                  {" · "}
                  Method: {file.methodName}
                </span>
              </div>

              <strong className="split-percentage">{file.percentage}%</strong>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const getLabel = (mediaType: EmbedFile["mediaType"]) => {
  switch (mediaType) {
    case "image":
      return "Image";

    case "video":
      return "Video";

    case "audio":
      return "Audio";

    case "text":
      return "Text";

    default:
      return "";
  }
};
