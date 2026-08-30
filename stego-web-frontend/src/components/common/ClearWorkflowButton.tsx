import { RotateCcw } from "lucide-react";
import "../../styles/ClearWorkflowButton.css";

interface ClearWorkflowButtonProps {
    onClear: () => void;
    disabled?: boolean;
}

export const ClearWorkflowButton = ({
    onClear,
    disabled = false,
}: ClearWorkflowButtonProps) => {
    const handleClear = () => {
        if (disabled) {
            return;
        }

        const confirmed = window.confirm(
            "Start a new operation?\n\nThis will remove your selected methods, uploaded files, and current results.",
        );

        if (!confirmed) {
            return;
        }

        onClear();
    };

    return (
        <button
            type="button"
            className="clear-workflow-button"
            onClick={handleClear}
            disabled={disabled}
            title="Clear current workflow"
        >
            <RotateCcw size={16} />
            <span>Clear</span>
        </button>
    );
};