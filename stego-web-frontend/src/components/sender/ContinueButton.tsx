interface ContinueButtonProps {
  disabled?: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

export const ContinueButton = ({
  disabled = false,
  onClick,
  children = "Continue",
}: ContinueButtonProps) => {
  return (
    <button
      type="button"
      className="continue-button"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
      <span>→</span>
    </button>
  );
};
