import { useMemo, useState } from "react";

import type {
  ExtractionItem,
  ReceivedMediaFile,
  TransmissionDetails,
  VerificationResult,
} from "../types/steganography";

export const useReceiverWorkflow = () => {
  const [isExtracting, setIsExtracting] = useState(false);
  const [isExtracted, setIsExtracted] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const receivedFiles: ReceivedMediaFile[] = useMemo(
    () => [
      {
        id: "image-1",
        mediaType: "image",
        fileName: "stego_image.png",
        fileSize: 2.4 * 1024 * 1024,
      },
      {
        id: "video-1",
        mediaType: "video",
        fileName: "stego_video.mp4",
        fileSize: 18.7 * 1024 * 1024,
      },
      {
        id: "audio-1",
        mediaType: "audio",
        fileName: "stego_audio.wav",
        fileSize: 5.1 * 1024 * 1024,
      },
      {
        id: "text-1",
        mediaType: "text",
        fileName: "stego_text.txt",
        fileSize: 48 * 1024,
      },
    ],
    [],
  );

  const extractionItems: ExtractionItem[] = useMemo(
    () => [
      {
        id: "image-extraction",
        mediaType: "image",
        methodName: "LSB Substitution",
        status: isExtracted ? "done" : "pending",
      },
      {
        id: "video-extraction",
        mediaType: "video",
        methodName: "Frame LSB",
        status: isExtracted ? "done" : "pending",
      },
      {
        id: "audio-extraction",
        mediaType: "audio",
        methodName: "Echo Hiding",
        status: isExtracted ? "done" : "pending",
      },
      {
        id: "text-extraction",
        mediaType: "text",
        methodName: "Zero-width Chars",
        status: isExtracted ? "done" : "pending",
      },
    ],
    [isExtracted],
  );

  const transmissionDetails: TransmissionDetails = {
    sentOn: "Aug 11, 2026 · 14:22 UTC",
    senderHash: "SHA-256: 3f8a...d291",
    protocol: "MStegh-v2 / AES-256",
    channel: "Secure / Encrypted",
  };

  const verificationResult: VerificationResult = {
    errorRate: 0.7995,
    integrity: 99.2005,
    charsMatched: 2031,
    totalChars: 2048,
  };

  const totalSize = receivedFiles.reduce(
    (total, file) => total + file.fileSize,
    0,
  );

  const extractMessage = async () => {
    if (isExtracting || isExtracted) {
      return;
    }

    setIsExtracting(true);

    // Temporary simulation.
    // Later this will call your Express backend.
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsExtracting(false);
    setIsExtracted(true);
  };

  const verifyMessage = () => {
    setIsVerified(true);
  };

  return {
    receivedFiles,
    extractionItems,
    transmissionDetails,
    verificationResult,

    totalSize,

    isExtracting,
    isExtracted,
    isVerified,

    extractMessage,
    verifyMessage,
  };
};
