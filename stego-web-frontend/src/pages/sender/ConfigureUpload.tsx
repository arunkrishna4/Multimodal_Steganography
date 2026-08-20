import { FolderOpen } from "lucide-react";

import { MethodSelector } from "../../components/sender/MethodSelector";
import { MediaUploadCard } from "../../components/sender/MediaUploadCard";
import { SecretFileUpload } from "../../components/sender/SecretFileUpload";
import { ContinueButton } from "../../components/sender/ContinueButton";

import { useSenderSetup } from "../../hooks/useSenderSetup";

interface ConfigureUploadProps {
  onContinue: () => void;
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

  return (
    <div className="sender-page">
      {/* =========================
          TOP WORKFLOW
          ========================= */}

      <div className="sender-grid">
        {/* LEFT COLUMN */}
        <div className="sender-column">
          <MethodSelector
            selectedMethods={selectedMethods}
            onToggle={toggleMediaType}
            onMethodChange={changeMethod}
            onNumberOfFilesChange={changeNumberOfFiles}
          />
        </div>

        {/* RIGHT COLUMN */}
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

      {/* =========================
          BOTTOM ACTION AREA
          ========================= */}

      <div className="sender-bottom-area">
        <div className="secret-upload-wrapper">
          <SecretFileUpload file={secretFile} onUpload={uploadSecretFile} />
        </div>

        <div className="continue-wrapper">
          <ContinueButton disabled={!isReadyToContinue} onClick={onContinue} />
        </div>
      </div>
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
