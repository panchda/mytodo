import cn from "classnames";

import "./action-button.css";

export default function ActionButton({
  label,
  onClick,
  className,
  disabled = false,
}) {
  return (
    <button
      className={cn("action-button", className, {
        "action-button--disabled": disabled,
      })}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
