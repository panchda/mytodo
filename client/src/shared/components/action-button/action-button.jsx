import "./action-button.css";

export default function ActionButton({ label, onClick }) {
  return <button onClick={onClick}>{label}</button>;
}
