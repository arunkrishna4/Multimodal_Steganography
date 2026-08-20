import { LockKeyhole, FileCheck, Upload } from "lucide-react";

interface SecretFileUploadProps {
  file: File | null;
  onUpload: (file: File) => void;
  title?: string;
  description?: string;
  emptyLabel?: string;
}

export const SecretFileUpload = ({
  file,
  onUpload,
  title = "Upload your secret message",
  description = "This text file contains the message you want to hide.",
  emptyLabel = "Choose your secret text file",
}: SecretFileUploadProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];

    if (!selectedFile) {
      return;
    }

    onUpload(selectedFile);
  };

  return (
    <section className="workflow-card secret-card">
      <div className="section-heading">
        <div className="section-icon">
          <LockKeyhole size={20} />
        </div>

        <div>
          <h2>{title}</h2>

          <p>{description}</p>
        </div>
      </div>

      <label className="secret-upload">
        <input type="file" accept=".txt,.text" onChange={handleChange} />

        {!file ? (
          <div className="secret-empty">
            <Upload size={24} />

            <span>{emptyLabel}</span>
          </div>
        ) : (
          <div className="secret-file">
            <div className="secret-file-icon">
              <FileCheck size={22} />
            </div>

            <div className="secret-file-info">
              <strong>{file.name}</strong>

              <span>
                {(file.size / 1024).toFixed(1)} KB
                {" — "}Ready to hide
              </span>
            </div>

            <span className="change-label">Change</span>
          </div>
        )}
      </label>
    </section>
  );
};
