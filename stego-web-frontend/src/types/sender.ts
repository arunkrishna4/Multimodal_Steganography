import type { SelectedMethod } from "./steganography";

export interface SenderState {
  selectedMethods: SelectedMethod[];
  uploadedFiles: File[];
  secretFile: File | null;
}
