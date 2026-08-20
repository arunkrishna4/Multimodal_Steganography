export interface EmbedFile {
  id: string;
  mediaType: "image" | "video" | "audio" | "text";
  fileName: string;
  methodName: string;
  bytes: number;
  percentage: number;
  status: "pending" | "processing" | "done" | "error";
}

export interface SplitInfo {
  secretFileName: string;
  secretFileSize: number;
  totalParts: number;
  files: EmbedFile[];
}
