import { CheckCircle2 } from "lucide-react";
import "../../styles/SplitEmbed.css";
interface EmbedSuccessProps {
  fileCount: number;
}

export const EmbedSuccess = ({ fileCount }: EmbedSuccessProps) => {
  return (
    <div className="embed-success">
      <div className="success-icon">
        <CheckCircle2 size={38} />
      </div>

      <h2>Message Hidden Successfully!</h2>

      <p>
        Your secret is now embedded in <strong>{fileCount} files</strong>. Send
        those files to the receiver.
      </p>
    </div>
  );
};
