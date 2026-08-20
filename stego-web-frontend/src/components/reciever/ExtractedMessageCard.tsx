import { CheckCircle2, FileText } from "lucide-react";

export const ExtractedMessageCard = () => {
  return (
    <div className="extracted-message-card">
      <div className="extracted-message-header">
        <CheckCircle2 size={21} />

        <strong>Message Extracted!</strong>
      </div>

      <p>The hidden message was found and reassembled from all 4 files.</p>

      <div className="extracted-file">
        <FileText size={17} />

        <span>extracted_message.txt · 2.1 KB</span>
      </div>
    </div>
  );
};
