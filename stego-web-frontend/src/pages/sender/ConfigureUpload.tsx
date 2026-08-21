import { FolderOpen } from "lucide-react";
import { useMemo, useState } from "react";

import { SplitProgress } from "../../components/embed/SplitProgress";
import { SplitSummary } from "../../components/embed/SplitSummary";
import { ContinueButton } from "../../components/sender/ContinueButton";
import { MediaUploadCard } from "../../components/sender/MediaUploadCard";
import { MethodSelector } from "../../components/sender/MethodSelector";
import { SecretFileUpload } from "../../components/sender/SecretFileUpload";
import { useSenderSetup } from "../../hooks/useSenderSetup";

import type { SplitInfo } from "../../types/embed";

interface ConfigureUploadProps {
  onContinue?: () => void;
}

export const ConfigureUpload = ({ onContinue }: ConfigureUploadProps) => {
  const {
    selectedMethods,
    uploadedFiles,
    secretFile,

    toggleMediaType,
    changeMethod,
    changeNumberOfFiles,
    uploadMediaFile,
    uploadSecretFile,

    isReadyToContinue,
  } = useSenderSetup();

  const [showSplitPreview, setShowSplitPreview] = useState(false);

  const splitPreview = useMemo<SplitInfo>(() => {
    const totalParts = selectedMethods.reduce(
      (sum, item) => sum + (item.numberOfFiles || 1),
      0,
    );

    const files = selectedMethods.flatMap((item) => {
      const filesForType = uploadedFiles.filter(
        (file) => getMediaType(file) === item.mediaType,
      );

      return Array.from({ length: item.numberOfFiles || 1 }, (_, index) => {
        const uploadedFile = filesForType[index];
        const bytes = uploadedFile?.size ?? secretFile?.size ?? 0;

        return {
          id: `${item.mediaType}-${index}`,
          mediaType: item.mediaType,
          fileName: uploadedFile?.name ?? `${item.mediaType}-${index + 1}`,
          methodName: item.methodId || "Selected method",
          bytes,
          percentage: totalParts > 0 ? 100 / totalParts : 0,
          status: "pending" as const,
        };
      });
    });

    return {
      secretFileName: secretFile?.name ?? "No secret file selected",
      secretFileSize: secretFile?.size ?? 0,
      totalParts,
      files,
    };
  }, [selectedMethods, uploadedFiles, secretFile]);

  const handleContinue = () => {
    if (!isReadyToContinue) {
      return;
    }

    setShowSplitPreview(true);
    onContinue?.();
  };

  return (
    <div className="sender-page">
      <div className="sender-grid">
        <div className="sender-column">
          <MethodSelector
            selectedMethods={selectedMethods}
            onToggle={toggleMediaType}
            onMethodChange={changeMethod}
            onNumberOfFilesChange={changeNumberOfFiles}
          />
        </div>

        <div className="sender-column">
          <section className="workflow-card">
            <div className="section-heading">
              <div className="section-icon">
                <FolderOpen size={20} />
              </div>

              <div>
                <h2>Upload your media files</h2>

                <p>These files will carry the hidden message inside them.</p>
              </div>
            </div>

            <div className="upload-list">
              {selectedMethods.map((item) => {
                const filesForType = uploadedFiles.filter(
                  (file) => getMediaType(file) === item.mediaType,
                );

                return Array.from({ length: item.numberOfFiles || 1 }).map(
                  (_, index) => (
                    <MediaUploadCard
                      key={`${item.mediaType}-${index}`}
                      mediaType={item.mediaType}
                      uploadedFile={filesForType[index]}
                      fileIndex={index}
                      onUpload={(mediaType, file, fileIndex) =>
                        uploadMediaFile(mediaType, file, fileIndex ?? index)
                      }
                    />
                  ),
                );
              })}

              {selectedMethods.length === 0 && (
                <div className="empty-upload-state">
                  <FolderOpen size={28} />

                  <p>Select at least one hiding method to upload your media.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>

      <div className="sender-bottom-area">
        <div className="secret-upload-wrapper">
          <SecretFileUpload file={secretFile} onUpload={uploadSecretFile} />
        </div>

        <div className="continue-wrapper">
          <ContinueButton disabled={!isReadyToContinue} onClick={handleContinue}>
            Split & Embed
          </ContinueButton>
        </div>
      </div>

      {showSplitPreview && isReadyToContinue && (
        <div className="split-preview-section">
          <div className="split-preview-grid">
            <SplitSummary splitInfo={splitPreview} />
            <SplitProgress files={splitPreview.files} />
          </div>
        </div>
      )}
    </div>
  );
};

const getMediaType = (file: File): "image" | "video" | "audio" | "text" => {
  if (file.type.startsWith("image/")) {
    return "image";
  }

  if (file.type.startsWith("video/")) {
    return "video";
  }

  if (file.type.startsWith("audio/")) {
    return "audio";
  }

  return "text";
};
