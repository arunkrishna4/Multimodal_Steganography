import { useMemo, useState } from "react";

import type {
  ExtractionItem,
  ReceivedMediaFile,
  SelectedMethod,
  TransmissionDetails,
  VerificationResult,

} from "../types/steganography";

import type {
  ExtractResult,
} from "../types/receiver";

import { extractMessage as extractMessageApi } from "../api/extract.api";
import { compareMessages as compareMessagesApi } from "../api/compare.api";
import type { CompareResult } from "../types/api/compare";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export const useReceiverWorkflow = () => {

  const [isExtracting, setIsExtracting] = useState(false);

  const [isExtracted, setIsExtracted] = useState(false);

  const [isVerified, setIsVerified] = useState(false);

  const [extractResult, setExtractResult] =
    useState<ExtractResult | null>(null);

  const [compareResult, setCompareResult] =
    useState<CompareResult | null>(null);

  const [isComparing, setIsComparing] =
    useState(false);


  // --------------------------------------------------
  // Existing placeholder data
  // --------------------------------------------------

  const receivedFiles: ReceivedMediaFile[] = useMemo(
    () => [],
    [],
  );


  const extractionItems: ExtractionItem[] = useMemo(
    () => [],
    [],
  );


  const transmissionDetails: TransmissionDetails = {
    sentOn: "",
    senderHash: "",
    protocol: "",
    channel: "",
  };


  const verificationResult: VerificationResult = {
    errorRate: 0,
    integrity: 100,
    charsMatched: 0,
    totalChars: 0,
  };


  const totalSize = receivedFiles.reduce(
    (total, file) => total + file.fileSize,
    0,
  );


  // --------------------------------------------------
  // Extract message
  // --------------------------------------------------

  const extractMessage = async (
    mediaFiles: File[],
    selectedMethods: SelectedMethod[],
  ) => {

    if (isExtracting || isExtracted) {
      toast.error("Already extracting or extracted!");
      return;
    }


    if (!mediaFiles || mediaFiles.length === 0) {

      toast.error("No media files provided for extraction.");

      return;
    }


    try {

      setIsExtracting(true);

      setIsExtracted(false);

      setIsVerified(false);

      setExtractResult(null);


      const response = await extractMessageApi(
        mediaFiles,
        selectedMethods,
      ) as any;

      // --------------------------------------------------
      // Handle backend error response
      // --------------------------------------------------

      if (response.success === false) {
        toast.error("Failed to extract message!");
        return;
      }

      // --------------------------------------------------
      // Store actual extraction result (handle wrapped or unwrapped)
      // --------------------------------------------------

      const result = response.result !== undefined ? response.result : response;

      setExtractResult(result);

      setIsExtracted(true);

      toast.success("Message extracted successfully!");

    } catch (error) {

      const axiosError = error as AxiosError<{ error?: string }>;

      const message =
        axiosError.response?.data?.error ||
        axiosError.message ||
        "An unexpected error occurred.";

      toast.error(message);

      setIsExtracted(false);

    } finally {

      setIsExtracting(false);

    }
  };


  // --------------------------------------------------
  // Verification
  // --------------------------------------------------

  const verifyMessage = async (
    originalFile: File | null,
  ) => {
    if (
      isComparing ||
      !originalFile ||
      !extractResult
    ) {
      return;
    }

    try {
      setIsComparing(true);
      setIsVerified(false);
      setCompareResult(null);

      const response = await compareMessagesApi(
        originalFile,
        extractResult.extractedMessage,
      );

      if (response.success === false) {
        toast.error("Failed to compare messages!");
        return;
      }

      setCompareResult(response.result);
      setIsVerified(true);

      toast.success("Message compared successfully!");

    } catch (error) {

      const axiosError = error as AxiosError<{ error?: string }>;

      const message =
        axiosError.response?.data?.error ||
        axiosError.message ||
        "An unexpected error occurred.";

      toast.error(message);

      setIsVerified(false);

    } finally {
      setIsComparing(false);
    }
  };

  const clearWorkflow = () => {
    setIsExtracting(false);
    setIsExtracted(false);
    setIsVerified(false);

    setExtractResult(null);
    setCompareResult(null);
    setIsComparing(false);

    toast.success("Workflow cleared successfully!");
  };



  // --------------------------------------------------
  // Return workflow state
  // --------------------------------------------------

  return {
    receivedFiles,
    extractionItems,
    transmissionDetails,
    verificationResult,

    totalSize,

    isExtracting,
    isExtracted,
    isVerified,

    extractResult,

    compareResult,
    isComparing,

    extractMessage,
    verifyMessage,

    clearWorkflow,
  };
};
