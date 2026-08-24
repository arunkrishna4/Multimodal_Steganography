import {
  Image,
  Video,
  Music,
  FileText,
  Download,
  LoaderCircle,
  type LucideIcon,
} from "lucide-react";

import type { EmbedFile, MediaType } from "../../types/embed";

interface EmbedFileCardProps {
  file: EmbedFile;
  psnr?: number;
  snr?: number;
  downloadUrl?: string;
  onDownload: (downloadUrl: string) => void;
}

const ICONS: Record<MediaType, LucideIcon> = {
  image: Image,
  video: Video,
  audio: Music,
  text: FileText,
};

export const EmbedFileCard = ({
  file,
  psnr,
  snr,
  downloadUrl,
  onDownload,
}: EmbedFileCardProps) => {
  const Icon = ICONS[file.mediaType];

  const isDone = file.status === "done";
  const isProcessing = file.status === "processing";

  const qualityMetric =
    file.mediaType === "image" && psnr !== undefined
      ? { label: "PSNR", value: `${psnr.toFixed(2)} dB` }
      : file.mediaType === "audio" && snr !== undefined
        ? { label: "SNR", value: `${snr.toFixed(2)} dB` }
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
                <span className="meta-label">
                  {qualityMetric.label}
                </span>

                <span className="meta-value">
                  {(qualityMetric.value)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="embed-status">
        {isDone && downloadUrl && (
          <button
            type="button"
            className="status-download"
            onClick={() => onDownload(downloadUrl)}
          >
            <Download size={16} />
            Download
          </button>
        )}

        {isProcessing && (
          <span className="status-processing">
            <LoaderCircle
              size={16}
              className="spin"
            />
            Embedding...
          </span>
        )}

        {!isDone && !isProcessing && (
          <span className="status-pending">
            Ready
          </span>
        )}
      </div>
    </div>
  );
};

const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};
