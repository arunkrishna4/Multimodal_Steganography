import { Image, Video, Music, FileText } from "lucide-react";

import type { MediaOption, SelectedMethod } from "../../types/steganography";

interface MethodCardProps {
  option: MediaOption;
  selected: boolean;
  selectedMethod?: SelectedMethod;
  onToggle: () => void;
  onMethodChange: (methodId: string) => void;
  onNumberOfFilesChange: (count: number) => void;
  disabled: boolean;
}

const ICONS = {
  image: Image,
  video: Video,
  audio: Music,
  text: FileText,
};

export const MethodCard = ({
  option,
  selected,
  selectedMethod,
  onToggle,
  onMethodChange,
  onNumberOfFilesChange,
  disabled,
}: MethodCardProps) => {
  const Icon = ICONS[option.icon as keyof typeof ICONS];

  const handleCardClick = () => {
    if (disabled) return;

    onToggle();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onToggle();
    }
  };

  return (
    <div
      className={`method-card ${selected ? "method-card-selected" : ""} ${disabled ? "method-card-disabled" : ""
        }`}
      role="checkbox"
      aria-checked={selected}
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
    >
      <div className="method-card-header">
        <div
          className={`custom-checkbox ${selected ? "custom-checkbox-checked" : ""
            }`}
          aria-hidden="true"
        />

        <div className="method-icon">
          <Icon size={22} />
        </div>

        <div className="method-info">
          <h3>{option.label}</h3>

          <p>{option.description}</p>
        </div>
      </div>

      {selected && (
        <div
          className="method-selector"
          onClick={(event) => {
            event.stopPropagation();
          }}
        >
          <div>
            <label htmlFor={`${option.type}-method`}>Hiding method</label>

            <select
              id={`${option.type}-method`}
              value={selectedMethod?.methodId ?? ""}
              disabled={disabled}
              onChange={(event) => onMethodChange(event.target.value)}
              onClick={(event) => event.stopPropagation()}
            >
              <option value="" disabled>
                Select a method
              </option>

              {option.methods.map((method) => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor={`${option.type}-file-count`}>Number of files</label>

            <input
              type="number"
              id={`${option.type}-file-count`}
              className="method-selector-input"
              min={1}
              value={selectedMethod?.numberOfFiles ?? 1}
              disabled={disabled}
              onChange={(event) => {
                const nextValue = Number(event.target.value) || 1;
                onNumberOfFilesChange(Math.max(1, nextValue));
              }}
              onClick={(event) => event.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};
