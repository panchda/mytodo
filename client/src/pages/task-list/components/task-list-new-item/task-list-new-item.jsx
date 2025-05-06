import { useState } from "react";
import ActionButton from "../../../../shared/components/action-button/action-button";

import "./task-list-new-item.css";

export default function TaskListNewItem({ onAdd, onCancel }) {
  const [title, setTitle] = useState("");

  return (
    <div>
      <input
        type="text"
        placeholder="Write a task.."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <ActionButton label="add" onClick={onAdd} />
      <ActionButton label="cancel" onClick={onCancel} />
    </div>
  );
}
