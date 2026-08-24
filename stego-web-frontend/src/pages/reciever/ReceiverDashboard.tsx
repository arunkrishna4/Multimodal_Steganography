import { FolderOpen } from "lucide-react";

import "../../styles/ReceiverDashboard.css";
import { useReceiverWorkflow } from "../../hooks/useReceiverWorkflow";
import { useSenderSetup } from "../../hooks/useSenderSetup";

import { MethodSelector } from "../../components/sender/MethodSelector";
import { MediaUploadCard } from "../../components/sender/MediaUploadCard";
import { SecretFileUpload } from "../../components/sender/SecretFileUpload";
import { ExtractedMessageCard } from "../../components/reciever/ExtractedMessageCard";
import { ComparisonResultCard } from "../../components/reciever/ComparisonResultCard";

export const ReceiverDashboard = () => {
  const {
    isExtracting,
    isExtracted,
    isVerified,
    isComparing,

    extractMessage,
    verifyMessage,

    extractResult,
    compareResult,
  } = useReceiverWorkflow();

  const {
    selectedMethods,
    uploadedFiles,
    secretFile,
    toggleMediaType,
    changeMethod,
    changeNumberOfFiles,
    uploadMediaFile,
    uploadSecretFile,
  } = useSenderSetup();

  return (
    <div className="sender-page receiver-page">
      <div className="sender-header">
        Receiver
        <div className="sender-description">
          Extract hidden message from media files using steganography.
        </div>
      </div>

      <div className="sender-grid">
        <div className="sender-column">
          <MethodSelector
            selectedMethods={selectedMethods}
            onToggle={toggleMediaType}
            onMethodChange={changeMethod}
            onNumberOfFilesChange={changeNumberOfFiles}
            heading="Select the methods used to hide the message"
            description="Choose the types of files that were used to hide the message."
          />
        </div>

        <div className="sender-column">
          <section className="workflow-card">
            <div className="section-heading">
              <div className="section-icon">
                <FolderOpen size={20} />
              </div>

              <div>
                <h2>Upload your received media files</h2>

                <p>
                  Add the files you want to scan for the hidden message.
                </p>
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

                  <p>Select at least one hiding method to upload received media.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </div>


      <div className="secret-upload-wrapper">
        <SecretFileUpload
          file={secretFile}
          onUpload={uploadSecretFile}
          title="Upload original text to confirm extracted message"
          description="Add the original text file so the extracted output can be compared and verified."
          emptyLabel="Choose the original text file"
        />
      </div>

      {!isExtracted && (
        <button
          type="button"
          className="continue-button"
          disabled={isExtracting || isExtracted || uploadedFiles.length === 0}
          onClick={() => extractMessage(uploadedFiles)}
        >
          {isExtracting
            ? "Extracting..."
            : "Extract Hidden Message"}

          {!isExtracting && <span>→</span>}
        </button>
      )}

      {isExtracted && extractResult && (
        <ExtractedMessageCard
          message={extractResult.extractedMessage}
          totalParts={extractResult.mediaFiles}
          onCompare={() => verifyMessage(secretFile)}
          disabled={
            isVerified ||
            isComparing ||
            !secretFile
          }
        />
      )}

      {isVerified && compareResult && (
        <ComparisonResultCard
          result={{
            isMatch: compareResult.exactMatch,
            originalLength: compareResult.originalLength,
            extractedLength: compareResult.extractedLength,
            matchingCharacters: compareResult.matchingCharacters,
            errorCharacters: compareResult.errorCharacters,
            errorRate: compareResult.errorRate,
            accuracy: compareResult.accuracy,
          }}
        />
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
