import { useMemo, useState } from "react";
import { AxiosError } from "axios";

import type { SelectedMethod, MediaType } from "../types/steganography";
import { splitAndEmbed } from "../api/splitAndEmbed.api";
import type { SplitEmbedResponse, } from "../types/api/split-and-embed.types";
import { downloadFile } from "../api/download.api";
import { toast } from "sonner";
import { getMediaType } from "../utils/senderHelper";

export const useSenderSetup = () => {
  const [selectedMethods, setSelectedMethods] = useState<SelectedMethod[]>([]);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [secretFile, setSecretFile] = useState<File | null>(null);

  const [embeded, isEmbeded] = useState(false);

  const [loading, setLoading] = useState(false);

  const [response, setResponse] = useState<SplitEmbedResponse | null>(null);

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
      const sameTypeFiles = current.filter(
        (item) => getMediaType(item) === mediaType,
      );
      const otherFiles = current.filter(
        (item) => getMediaType(item) !== mediaType,
      );
      const nextFiles = [...sameTypeFiles];

      nextFiles[index] = file;

      return [...otherFiles, ...nextFiles];
    });
    toast.success("File uploaded successfully!");

    // Uploading a new file invalidates any previous embed result
    if (embeded) {
      isEmbeded(false);
      toast.error("Failed to embed file!");
    }
  };

  const uploadSecretFile = (file: File) => {
    setSecretFile(file);
    toast.success("File uploaded successfully!");

    if (embeded) {
      isEmbeded(false);
      toast.error("Failed to embed file!");
    }
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

  //api call for the split and embed button
  const handleSplitAndEmbed = async () => {
    if (!secretFile) return;
    if (selectedMethods.length === 0) {
      toast.error("Please select a steganography method.");
      return;
    }

    try {
      setLoading(true);

      const result =
        await splitAndEmbed(
          secretFile,
          uploadedFiles,
          selectedMethods,
        );

      setResponse(result);

      if (result.success) {
        isEmbeded(true);
        toast.success("File embedded successfully!");
      }

    } catch (error) {
      isEmbeded(false);

      const axiosError = error as AxiosError<{ error?: string }>;

      const message =
        axiosError.response?.data?.error ||
        axiosError.message ||
        "An unexpected error occurred.";

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (downloadUrl: string) => {
    if (!downloadUrl) {
      toast.error("Download URL is missing.");
      return;
    }

    try {
      await downloadFile(downloadUrl);
      toast.success("File downloaded successfully!");
    } catch (error) {
      const axiosError = error as AxiosError<{ error?: string }>;

      const message =
        axiosError.response?.data?.error ||
        axiosError.message ||
        "An unexpected error occurred.";

      toast.error(message);
    }
  };

  const clearWorkflow = () => {
    setSelectedMethods([]);
    setUploadedFiles([]);
    setSecretFile(null);

    isEmbeded(false);
    setResponse(null);
  };

  return {
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
    response,

    isReadyToContinue,
    loading,

    handleSplitAndEmbed,
    handleDownload,
    clearWorkflow,
  };
};

