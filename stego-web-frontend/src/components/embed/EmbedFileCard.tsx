import {
  Image,
  Video,
  Music,
  FileText,
  Check,
  LoaderCircle,
} from "lucide-react";

import type { EmbedFile } from "../../types/embed";

interface EmbedFileCardProps {
  file: EmbedFile;
}

const ICONS = {
  image: Image,
  video: Video,
  audio: Music,
  text: FileText,
};

export const EmbedFileCard = ({ file }: EmbedFileCardProps) => {
  const Icon = ICONS[file.mediaType];

  const isDone = file.status === "done";
  const isProcessing = file.status === "processing";

  return (
    <div className={`embed-file-card ${isDone ? "embed-file-done" : ""}`}>
      <div className="embed-file-main">
        <div className="embed-file-icon">
          <Icon size={23} />
        </div>

        <div className="embed-file-details">
          <strong>{capitalize(file.mediaType)}</strong>

          <span>{file.methodName}</span>
        </div>
      </div>

      <div className="embed-status">
        {isDone && (
          <span className="status-done">
            Done <Check size={15} />
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
