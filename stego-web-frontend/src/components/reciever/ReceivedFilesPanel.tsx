import { Inbox } from "lucide-react";

import type { ReceivedMediaFile } from "../../types/steganography";

import { ReceivedMediaCard } from "./ReceivedMediaCard";

interface ReceivedFilesPanelProps {
  files: ReceivedMediaFile[];
  totalSize: number;
}

export const ReceivedFilesPanel = ({
  files,
  totalSize,
}: ReceivedFilesPanelProps) => {
  return (
    <section className="receiver-card">
      <div className="receiver-section-heading">
        <div className="receiver-section-icon">
          <Inbox size={20} />
        </div>

        <div>
          <h2>Received Media Files</h2>
          <p>
            These are the files you received that contain the hidden message.
          </p>
        </div>
      </div>

      <div className="received-file-list">
        {files.map((file) => (
          <ReceivedMediaCard key={file.id} file={file} />
        ))}
      </div>

      <div className="received-summary">
        <div className="received-summary-item">
          <span>Total files</span>
          <strong>{files.length}</strong>
        </div>

        <div className="received-summary-item">
          <span>Total size</span>
          <strong>{formatFileSize(totalSize)}</strong>
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
