import { useState } from "react";

import type { EmbedFile, SplitInfo } from "../types/embed";

interface UseEmbedProcessProps {
  splitInfo: SplitInfo;
}

export const useEmbedProcess = ({ splitInfo }: UseEmbedProcessProps) => {
  const [files, setFiles] = useState<EmbedFile[]>(splitInfo.files);

  const [isEmbedding, setIsEmbedding] = useState(false);

  const [isComplete, setIsComplete] = useState(false);

  const startEmbedding = async () => {
    if (isEmbedding || isComplete) {
      return;
    }

    setIsEmbedding(true);

    for (const file of files) {
      setFiles((currentFiles) =>
        currentFiles.map((currentFile) =>
          currentFile.id === file.id
            ? {
                ...currentFile,
                status: "processing",
              }
            : currentFile,
        ),
      );

      await wait(1000);

      setFiles((currentFiles) =>
        currentFiles.map((currentFile) =>
          currentFile.id === file.id
            ? {
                ...currentFile,
                status: "done",
              }
            : currentFile,
        ),
      );
    }

    setIsEmbedding(false);
    setIsComplete(true);
  };

  return {
    files,
    isEmbedding,
    isComplete,
    startEmbedding,
  };
};

const wait = (milliseconds: number) => {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, milliseconds);
  });
};
