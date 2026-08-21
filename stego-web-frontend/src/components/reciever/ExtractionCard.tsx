import { Search } from "lucide-react";

import type { ExtractionItem } from "../../types/steganography";

import { ExtractionFileRow } from "./ExtractionFileRow";
import { ExtractedMessageCard } from "./ExtractedMessageCard";

interface ExtractionCardProps {
  items: ExtractionItem[];
  isExtracting: boolean;
  isExtracted: boolean;
  onExtract: () => void;
  extractedMessage: string;
  totalParts: number;
  onCompare: () => void;
}

export const ExtractionCard = ({
  items,
  isExtracting,
  isExtracted,
  extractedMessage,
  totalParts,
  onCompare,
}: ExtractionCardProps) => {
  return (
    <section className="receiver-card">
      <div className="receiver-section-heading">
        <div className="receiver-section-icon">
          <Search size={20} />
        </div>

        <div>
          <h2>Extract Hidden Message</h2>

          <p>
            Scan all received files and reconstruct the hidden message from the
            selected media.
          </p>
        </div>
      </div>

      <div className="extraction-list">
        {items.map((item) => (
          <ExtractionFileRow
            key={item.id}
            item={item}
            isExtracting={isExtracting}
          />
        ))}
      </div>

      {isExtracted && (
        <ExtractedMessageCard
          message={extractedMessage}
          totalParts={totalParts}
          onCompare={onCompare}
        />
      )}
    </section>
  );
};