import { useMemo, useState } from "react";

import type { SelectedMethod, MediaType } from "../types/steganography";

export const useSenderSetup = () => {
  const [selectedMethods, setSelectedMethods] = useState<SelectedMethod[]>([]);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [secretFile, setSecretFile] = useState<File | null>(null);

  const toggleMediaType = (mediaType: MediaType) => {
    setSelectedMethods((current) => {
      const exists = current.some((item) => item.mediaType === mediaType);

      if (exists) {
        return current.filter((item) => item.mediaType !== mediaType);
      }

      return [
        ...current,
        {
          mediaType,
          methodId: "",
          methodName: "",
          numberOfFiles: 1,
        },
      ];
    });
  };

  const changeMethod = (mediaType: MediaType, methodId: string) => {
    setSelectedMethods((current) =>
      current.map((item) => {
        if (item.mediaType !== mediaType) {
          return item;
        }

        return {
          ...item,
          methodId,
          methodName: methodId,
        };
      }),
    );
  };

  const changeNumberOfFiles = (mediaType: MediaType, count: number) => {
    const nextCount = Math.max(1, Number.isFinite(count) ? count : 1);

    setSelectedMethods((current) =>
      current.map((item) => {
        if (item.mediaType !== mediaType) {
          return item;
        }

        return {
          ...item,
          numberOfFiles: nextCount,
        };
      }),
    );
  };

  const uploadMediaFile = (mediaType: MediaType, file: File, index = 0) => {
    setUploadedFiles((current) => {
      const sameTypeFiles = current.filter((item) => getMediaType(item) === mediaType);
      const otherFiles = current.filter((item) => getMediaType(item) !== mediaType);
      const nextFiles = [...sameTypeFiles];

      nextFiles[index] = file;

      return [...otherFiles, ...nextFiles];
    });
  };

  const uploadSecretFile = (file: File) => {
    setSecretFile(file);
  };

  const isReadyToContinue = useMemo(() => {
    if (selectedMethods.length === 0) {
      return false;
    }

    const everyMethodSelected = selectedMethods.every(
      (item) => item.methodId !== "",
    );

    if (!everyMethodSelected) {
      return false;
    }

    const everyMediaUploaded = selectedMethods.every((item) => {
      const uploadedForType = uploadedFiles.filter(
        (file) => getMediaType(file) === item.mediaType,
      );

      return uploadedForType.length >= item.numberOfFiles;
    });

    if (!everyMediaUploaded) {
      return false;
    }

    return secretFile !== null;
  }, [selectedMethods, uploadedFiles, secretFile]);

  return {
    selectedMethods,
    uploadedFiles,
    secretFile,

    toggleMediaType,
    changeMethod,
    changeNumberOfFiles,
    uploadMediaFile,
    uploadSecretFile,

    isReadyToContinue,
  };
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
