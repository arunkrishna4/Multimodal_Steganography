import { FileText, Image, Music, Video } from "lucide-react";

import type { ReceivedMediaFile } from "../../types/steganography";

interface ReceivedMediaCardProps {
  file: ReceivedMediaFile;
}

export const ReceivedMediaCard = ({ file }: ReceivedMediaCardProps) => {
  const getIcon = () => {
    switch (file.mediaType) {
      case "image":
        return <Image size={23} />;

      case "video":
        return <Video size={23} />;

      case "audio":
        return <Music size={23} />;

      case "text":
        return <FileText size={23} />;

      default:
        return <FileText size={23} />;
    }
  };

  return (
    <div className="received-media-card">
      <div className={`received-media-icon ${file.mediaType}`}>{getIcon()}</div>

      <div className="received-media-info">
        <strong>{capitalize(file.mediaType)}</strong>

        <span>
          {file.fileName} · {formatFileSize(file.fileSize)}
        </span>
      </div>
    </div>
  );
};

const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
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
