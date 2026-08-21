import {
  Image,
  Video,
  Music,
  FileText,
  Check,
  LoaderCircle,
  type LucideIcon,
} from "lucide-react";

import type { EmbedFile, MediaType } from "../../types/embed";

interface EmbedFileCardProps {
  file: EmbedFile;
}

const ICONS: Record<MediaType, LucideIcon> = {
  image: Image,
  video: Video,
  audio: Music,
  text: FileText,
};

export const EmbedFileCard = ({ file }: EmbedFileCardProps) => {
  const Icon = ICONS[file.mediaType];

  const isDone = file.status === "done";
  const isProcessing = file.status === "processing";

  const qualityMetric =
    file.mediaType === "image"
      ? { label: "PSNR", value: "20.5 dB" }
      : file.mediaType === "audio"
        ? { label: "SNR", value: "20.5 dB" }
        : null;

  return (
    <div className={`embed-file-card ${isDone ? "embed-file-done" : ""}`}>
      <div className="embed-file-main">
        <div className="embed-file-icon">
          <Icon size={23} />
        </div>

        <div className="embed-file-details">
          <strong>{capitalize(file.fileName)}</strong>

          <div className="embed-file-meta">
            <div className="detailsbox">
              <span className="meta-label">Method</span>
              <span className="meta-value">{file.methodName}</span>
            </div>

            {qualityMetric && (
              <div className="detailsbox">
                <span className="meta-label">{qualityMetric.label}</span>
                <span className="meta-value">{qualityMetric.value}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="embed-status">
        {isDone && (
          <span className="status-done">
            Embedding Done <Check size={15} />
          </span>
        )}

        {isProcessing && (
          <span className="status-processing">
            <LoaderCircle size={16} className="spin" />
            Embedding...
          </span>
        )}

        {!isDone && !isProcessing && (
          <span className="status-pending">Ready</span>
        )}
      </div>
    </div>
  );
};

const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};