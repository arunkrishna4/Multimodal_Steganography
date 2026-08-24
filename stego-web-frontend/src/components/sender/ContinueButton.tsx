import { IoMdGitNetwork } from "react-icons/io";

interface ContinueButtonProps {
  disabled?: boolean;
  loading?: boolean;
  onClick: () => void;
}

export const ContinueButton = ({
  disabled = false,
  loading = false,
  onClick,
}: ContinueButtonProps) => {
  return (
    <button
      type="button"
      className="continue-button"
      disabled={disabled || loading}
      style={{ cursor: disabled || loading ? "not-allowed" : "pointer" }}
      onClick={onClick}
    >
      {loading ? "Embedding..." : "Split & Embed"}
      {loading ? <div className="spinner"></div> : <IoMdGitNetwork size={20} />}
    </button>
  );
};
