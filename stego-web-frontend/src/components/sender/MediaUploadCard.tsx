import { Image, Video, Music, FileText, Upload } from "lucide-react";
import { useEffect, useMemo } from "react";

import "../../styles/MediaUpload.css";
import type { MediaType } from "../../types/steganography";

interface MediaUploadCardProps {
  mediaType: MediaType;
  uploadedFile?: File;
  fileIndex?: number;
  onUpload: (mediaType: MediaType, file: File, index?: number) => void;
}

export const MediaUploadCard = ({
  mediaType,
  uploadedFile,
  fileIndex = 0,
  onUpload,
}: MediaUploadCardProps) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    onUpload(mediaType, file, fileIndex);
  };

  const fileUrl = useMemo(
    () => (uploadedFile ? URL.createObjectURL(uploadedFile) : ""),
    [uploadedFile],
  );

  useEffect(() => {
    return () => {
      if (fileUrl) {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl]);

  const getAcceptType = () => {
    switch (mediaType) {
      case "image":
        return "image/*";

      case "video":
        return "video/*";

      case "audio":
        return "audio/*";

      case "text":
        return ".txt,text/plain";

      default:
        return "*/*";
    }
  };

  const getIcon = () => {
    switch (mediaType) {
      case "image":
        return <Image size={22} />;

      case "video":
        return <Video size={22} />;

      case "audio":
        return <Music size={22} />;

      case "text":
        return <FileText size={22} />;

      default:
        return <Upload size={22} />;
    }
  };

  const isImage = uploadedFile?.type.startsWith("image/");
  const isVideo = uploadedFile?.type.startsWith("video/");
  const isAudio = uploadedFile?.type.startsWith("audio/");

  return (
    <div
      className={`media-upload-card ${uploadedFile ? "media-upload-card-uploaded" : ""
        }`}
    >
      <div className="media-upload-header">
        <div className="media-upload-icon">{getIcon()}</div>

        <div>
          <h3>{capitalize(mediaType)} file</h3>

          <p>
            {uploadedFile
              ? "File uploaded successfully"
              : `Upload your ${mediaType} file`}
          </p>
        </div>
      </div>

      {uploadedFile ? (
        <div
          className={`uploaded-file-preview ${isAudio ? "audio-uploaded" : ""}`}
        >
          {(isImage || isVideo) && (
            <div className="media-preview">
              {isImage && <img src={fileUrl} alt={uploadedFile.name} />}

              {isVideo && <video controls preload="metadata" src={fileUrl} />}
            </div>
          )}

          {isAudio && (
            <div className="audio-preview">
              <audio controls preload="metadata" src={fileUrl} />
            </div>
          )}

          <div className="uploaded-file-details">
            <strong>{uploadedFile.name}</strong>

            <span>{formatFileSize(uploadedFile.size)}</span>
          </div>

          <label className="replace-file-button">
            Replace
            <input
              type="file"
              accept={getAcceptType()}
              onChange={handleFileChange}
              hidden
            />
          </label>
        </div>
      ) : (
        <label className="media-upload-dropzone">
          <Upload size={24} />

          <span>Choose {mediaType} file</span>

          <small>Click to browse</small>

          <input
            type="file"
            accept={getAcceptType()}
            onChange={handleFileChange}
            hidden
          />
        </label>
      )}
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
