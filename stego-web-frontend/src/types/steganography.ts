export type MediaType = "image" | "video" | "audio" | "text";

export interface HidingMethod {
  id: string;
  name: string;
  description: string;
}

export interface MediaOption {
  type: MediaType;
  label: string;
  description: string;
  icon: string;
  methods: HidingMethod[];
}

export interface SelectedMethod {
  mediaType: MediaType;
  methodId: string;
  numberOfFiles: number;
}

export interface UploadedMediaFile {
  type: MediaType;
  file: File | null;
  previewUrl?: string;
}

export interface SecretFile {
  file: File | null;
}

export interface ReceivedMediaFile {
  id: string;
  mediaType: MediaType;
  fileName: string;
  fileSize: number;
}

export interface ExtractionItem {
  id: string;
  mediaType: MediaType;
  methodName: string;
  status: "pending" | "processing" | "done";
}

export interface TransmissionDetails {
  sentOn: string;
  senderHash: string;
  protocol: string;
  channel: string;
}

export interface VerificationResult {
  errorRate: number;
  integrity: number;
  charsMatched: number;
  totalChars: number;
}
