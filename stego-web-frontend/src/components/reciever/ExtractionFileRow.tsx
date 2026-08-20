import {
  CheckCircle2,
  FileText,
  Image,
  LoaderCircle,
  Music,
  Video,
} from "lucide-react";

import type { ExtractionItem } from "../../types/steganography";

interface ExtractionFileRowProps {
  item: ExtractionItem;
  isExtracting: boolean;
}

export const ExtractionFileRow = ({
  item,
  isExtracting,
}: ExtractionFileRowProps) => {
  const getIcon = () => {
    switch (item.mediaType) {
      case "image":
        return <Image size={22} />;

      case "video":
        return <Video size={22} />;

      case "audio":
        return <Music size={22} />;

      case "text":
        return <FileText size={22} />;

      default:
        return <FileText size={22} />;
    }
  };

  const processing = isExtracting && item.status === "pending";

  return (
    <div
      className={`extraction-file-row ${
        item.status === "done" ? "extraction-done" : ""
      }`}
    >
      <div className={`extraction-file-icon ${item.mediaType}`}>
        {getIcon()}
      </div>

      <div className="extraction-file-info">
        <strong>{capitalize(item.mediaType)}</strong>

        <span>{item.methodName}</span>
      </div>

      {processing ? (
        <div className="extraction-processing">
          <LoaderCircle size={17} className="spin" />
          <span>Processing</span>
        </div>
      ) : item.status === "done" ? (
        <div className="extraction-done-badge">
          <CheckCircle2 size={16} />
          Done
        </div>
      ) : (
        <div className="extraction-pending">Pending</div>
      )}
    </div>
  );
};

const capitalize = (value: string) => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};
