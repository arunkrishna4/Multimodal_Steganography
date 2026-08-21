import { IoMdGitNetwork } from "react-icons/io";

interface ContinueButtonProps {
  disabled?: boolean;
  onClick: () => void;
}

export const ContinueButton = ({
  disabled = false,
  onClick,
}: ContinueButtonProps) => {
  return (
    <button
      type="button"
      className="continue-button"
      disabled={disabled}
      onClick={onClick}
    >
      Split & Embed
      <IoMdGitNetwork size={20} />
    </button>
  );
};
