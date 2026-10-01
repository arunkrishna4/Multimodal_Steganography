import { FolderOpen } from "lucide-react";

import "../../styles/ReceiverDashboard.css";
import { useReceiverWorkflow } from "../../hooks/useReceiverWorkflow";
import { useSenderSetup } from "../../hooks/useSenderSetup";

import { MethodSelector } from "../../components/sender/MethodSelector";
import { MediaUploadCard } from "../../components/sender/MediaUploadCard";
import { ExtractedMessageCard } from "../../components/reciever/ExtractedMessageCard";
import { ComparisonResultCard } from "../../components/reciever/ComparisonResultCard";
import { ClearWorkflowButton } from "../../components/common/ClearWorkflowButton";
import { getMediaType } from "../../utils/senderHelper";
import { useEffect, useRef } from "react";

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
    clearWorkflow,
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
    clearWorkflow: clearSetupWorkflow,
  } = useSenderSetup();

  const handleClearWorkflow = () => {
    clearSetupWorkflow();
    clearWorkflow();
  };

  const resultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isExtracted) {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [isExtracted, isVerified]);

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
            disabled={isExtracted}
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

      <button
        type="button"
        className="continue-button"
        disabled={
          isExtracting ||
          isExtracted ||
          uploadedFiles.length === 0
        }
        onClick={() => extractMessage(uploadedFiles, selectedMethods)}
      >
        {isExtracting
          ? "Extracting..."
          : "Extract Hidden Message"}

        {!isExtracting && <span>→</span>}
      </button>


      {isExtracted && extractResult && (
        <div ref={resultsRef}>
          <ExtractedMessageCard
            message={extractResult.extractedMessage}
            totalParts={extractResult.mediaFiles}

            originalFile={secretFile}
            onOriginalFileUpload={uploadSecretFile}

            onCompare={() => verifyMessage(secretFile)}

            isComparing={isComparing}
            disabled={isVerified || !secretFile}
            hasOriginalFile={!!secretFile}
          />
        </div>
      )}

      {isVerified && compareResult && (
        <div ref={resultsRef}>
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
        </div>
      )}

      <ClearWorkflowButton
        onClear={handleClearWorkflow}
        disabled={
          selectedMethods.length === 0 &&
          uploadedFiles.length === 0 &&
          !secretFile &&
          !isExtracted &&
          !isVerified
        }
      />

    </div>
  );
};


