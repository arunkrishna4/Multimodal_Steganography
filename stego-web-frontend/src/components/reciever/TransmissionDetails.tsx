import { Send } from "lucide-react";

import type { TransmissionDetails as TransmissionDetailsType } from "../../types/steganography";

interface TransmissionDetailsProps {
  details: TransmissionDetailsType;
}

export const TransmissionDetails = ({ details }: TransmissionDetailsProps) => {
  return (
    <section className="receiver-card">
      <div className="receiver-section-heading">
        <div className="receiver-section-icon">
          <Send size={20} />
        </div>

        <div>
          <h2>Transmission Details</h2>
        </div>
      </div>

      <div className="transmission-list">
        <div className="transmission-row">
          <span>Sent on</span>
          <strong>{details.sentOn}</strong>
        </div>

        <div className="transmission-row">
          <span>Sender hash</span>
          <strong>{details.senderHash}</strong>
        </div>

        <div className="transmission-row">
          <span>Protocol</span>
          <strong>{details.protocol}</strong>
        </div>

        <div className="transmission-row">
          <span>Channel</span>
          <strong>{details.channel}</strong>
        </div>
      </div>
    </section>
  );
};
