// types/embed.ts (inferred shape — verify against your actual file)
export type MediaType = string;

export interface EmbedFile {
  id: string;
  fileName: string;
  bytes: number;
  percentage: number; // embed progress, 0–100
  mediaType: MediaType;
  methodName: string;
  status: "pending" | "processing" | "done";
}

export interface SplitInfo {
  secretFileName: string;
  secretFileSize: number;
  totalParts: number;
  files: EmbedFile[]; // per-file breakdown of the split
}
