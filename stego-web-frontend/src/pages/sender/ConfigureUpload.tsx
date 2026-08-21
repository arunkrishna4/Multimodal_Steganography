import { FolderOpen } from "lucide-react";

import { MethodSelector } from "../../components/sender/MethodSelector";
import { MediaUploadCard } from "../../components/sender/MediaUploadCard";
import { SecretFileUpload } from "../../components/sender/SecretFileUpload";
import { ContinueButton } from "../../components/sender/ContinueButton";

import { useSenderSetup } from "../../hooks/useSenderSetup";
import { EmbedSuccess } from "../../components/embed/EmbedSuccess";
import { EmbedFileCard } from "../../components/embed/EmbedFileCard";
import { SplitSummary } from "../../components/embed/SplitSummary";

import type { EmbedFile } from "../../types/embed";
import type { MediaType } from "../../types/steganography";
import { SplitProgress } from "../../components/embed/SplitProgress";

export const ConfigureUpload = () => {
  const {
    selectedMethods,
    uploadedFiles,
    secretFile,

    toggleMediaType,
    changeMethod,
    changeNumberOfFiles,
    uploadMediaFile,
    uploadSecretFile,

    embeded,
    isEmbeded,

    isReadyToContinue,
  } = useSenderSetup();

  // Build one EmbedFile entry per uploaded carrier file
  const embedFiles: EmbedFile[] = selectedMethods.flatMap((item) => {
    const filesForType = uploadedFiles.filter(
      (file) => getMediaType(file) === item.mediaType,
    );

    return filesForType.map((file, index) => ({
      id: `${item.mediaType}-${index}`,
      fileName: file.name,
      bytes: file.size,
      percentage: 100, // set dynamically once real embed progress is wired up
      mediaType: item.mediaType,
      methodName: item.methodId, // swap for a display-name lookup if you have one
      status: "done" as const,
    }));
  });

  const splitInfo = secretFile
    ? {
      secretFileName: secretFile.name,
      secretFileSize: secretFile.size,
      totalParts: embedFiles.length || 1,
      files: embedFiles,
    }
    : null;

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


      <div className="secret-upload-wrapper">
        <SecretFileUpload file={secretFile} onUpload={uploadSecretFile} />
      </div>

      <div className="continue-wrapper">
        <ContinueButton
          disabled={!isReadyToContinue}
          onClick={() => {
            isEmbeded(true);
          }}
        />
      </div>


      {embeded && splitInfo ? (
        <div className="Results">
          <div style={{ marginTop: 20 }}>
            {/* // splitprogress is still visible after the condition */}
            {embedFiles.length !== 1 && (
              <>
                <SplitSummary splitInfo={splitInfo} />
                <div style={{ marginTop: 20 }}>
                  <SplitProgress files={embedFiles} />
                </div>
              </>
            )}
          </div>

          <div className="OuterEmbedFileCard">
            {embedFiles.map((file) => (
              <EmbedFileCard key={file.id} file={file} />
            ))}
          </div>
          <EmbedSuccess fileCount={embedFiles.length} />
        </div>
      ) : null}
    </div>
  );
};

const getMediaType = (file: File): MediaType => {
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
