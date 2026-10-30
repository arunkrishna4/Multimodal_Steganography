import {
    FileText,
    Upload,
    X,
    ClipboardPaste,
} from "lucide-react";

import { useId, useRef, useState } from "react";
import "../../styles/CompareDashboard.css";

interface CompareTextUploadProps {
    title: string;
    description: string;
    file: File | null;
    onFileChange: (file: File | null) => void;
    text: string;
    onTextChange: (text: string) => void;
}

type InputMode = "upload" | "paste";

export const CompareTextUpload = ({
    title,
    description,
    file,
    onFileChange,
    text,
    onTextChange,
}: CompareTextUploadProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const textareaId = useId();

    const [inputMode, setInputMode] = useState<InputMode>("upload");

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        const selectedFile = event.target.files?.[0];

        if (!selectedFile) return;

        if (
            !selectedFile.name.toLowerCase().endsWith(".txt") &&
            selectedFile.type !== "text/plain"
        ) {
            alert("Please upload a .txt file.");
            event.target.value = "";
            return;
        }

        onFileChange(selectedFile);
        onTextChange("");

        event.target.value = "";
    };

    const removeFile = () => {
        onFileChange(null);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    const handleModeChange = (mode: InputMode) => {
        setInputMode(mode);

        if (mode === "upload") {
            onTextChange("");
        } else {
            onFileChange(null);

            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    };

    return (
        <section className="compare-text-upload">
            <div className="compare-upload-heading">
                <div className="background-icon-box">
                    <div className="compare-upload-icon">
                        <FileText size={22} />
                    </div>
                </div>

                <div>
                    <h4>{title}</h4>
                    <p>{description}</p>
                </div>
            </div>

            <div
                className="compare-input-switch"
                role="group"
                aria-label={`Choose ${title} input method`}
            >
                <button
                    type="button"
                    className={inputMode === "upload" ? "active" : ""}
                    aria-pressed={inputMode === "upload"}
                    onClick={() => handleModeChange("upload")}
                >
                    <Upload size={16} />
                    Upload file
                </button>

                <button
                    type="button"
                    className={inputMode === "paste" ? "active" : ""}
                    aria-pressed={inputMode === "paste"}
                    onClick={() => handleModeChange("paste")}
                >
                    <ClipboardPaste size={16} />
                    Paste text
                </button>
            </div>

            {inputMode === "upload" && (
                <>
                    {file ? (
                        <div className="compare-selected-file">
                            <FileText size={20} />

                            <div className="compare-file-details">
                                <strong>{file.name}</strong>
                                <span>
                                    {(file.size / 1024).toFixed(1)} KB
                                </span>
                            </div>

                            <button
                                type="button"
                                onClick={removeFile}
                                aria-label="Remove selected file"
                            >
                                <X size={18} />
                            </button>
                        </div>
                    ) : (
                        <button
                            type="button"
                            className="compare-file-dropzone"
                            onClick={() => inputRef.current?.click()}
                        >
                            <Upload size={24} />
                            <strong>Choose text file</strong>
                            <span>TXT files only</span>
                        </button>
                    )}
                </>
            )}

            <input
                ref={inputRef}
                type="file"
                accept=".txt,text/plain"
                hidden
                onChange={handleFileChange}
            />

            {inputMode === "paste" && (
                <div className="compare-paste-section">

                    <textarea
                        id={textareaId}
                        value={text}
                        onChange={(event) =>
                            onTextChange(event.target.value)
                        }
                        placeholder={`Paste your ${title.toLowerCase()} here...`}
                        rows={7}
                    />
                </div>
            )}
        </section>
    );
};