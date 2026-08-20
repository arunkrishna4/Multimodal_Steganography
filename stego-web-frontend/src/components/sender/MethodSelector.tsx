import { Puzzle } from "lucide-react";

import { STEGANOGRAPHY_MEDIA } from "../../data/steganographyMethods";
import type { MediaType, SelectedMethod } from "../../types/steganography";

import { MethodCard } from "./MethodCard";

interface MethodSelectorProps {
  selectedMethods: SelectedMethod[];
  onToggle: (mediaType: MediaType) => void;
  onMethodChange: (mediaType: MediaType, methodId: string) => void;
  onNumberOfFilesChange: (mediaType: MediaType, count: number) => void;
}

export const MethodSelector = ({
  selectedMethods,
  onToggle,
  onMethodChange,
  onNumberOfFilesChange,
}: MethodSelectorProps) => {
  return (
    <section className="workflow-card">
      <div className="section-heading">
        <div className="section-icon">
          <Puzzle size={20} />
        </div>

        <div>
          <h2>Choose your hiding methods</h2>

          <p>
            Select which types of files you want to use to hide your secret
            message.
          </p>
        </div>
      </div>

      <div className="method-list">
        {STEGANOGRAPHY_MEDIA.map((option) => {
          const selectedMethod = selectedMethods.find(
            (item) => item.mediaType === option.type,
          );

          return (
            <MethodCard
              key={option.type}
              option={option}
              selected={Boolean(selectedMethod)}
              selectedMethod={selectedMethod}
              onToggle={() => onToggle(option.type)}
              onMethodChange={(methodId) =>
                onMethodChange(option.type, methodId)
              }
              onNumberOfFilesChange={(count) =>
                onNumberOfFilesChange(option.type, count)
              }
            />
          );
        })}
      </div>
    </section>
  );
};
