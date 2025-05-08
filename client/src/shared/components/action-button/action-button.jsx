import "./action-button.css";

export default function ActionButton({ label, onClick, disabled = false }) {
  return (
    <button className="action-button" onClick={onClick} disabled={disabled}>
      {label}
    </button>
  );
}
