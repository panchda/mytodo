import { useState } from "react";
import ActionButton from "../../../../shared/components/action-button/action-button";

import "./task-list-new-item.css";

export default function TaskListNewItem({ onAdd, onCancel }) {
  const [title, setTitle] = useState("");

  return (
    <div className="task-list-new-item">
    <input
      type="text"
      placeholder="Write a task.."
      value={title}
      onChange={(e) => setTitle(e.target.value)}
    />
   <ActionButton
      className="action-button--add"
      label="Add"
      onClick={onAdd}
    />
    <ActionButton
      className="action-button--cancel"
      label="Cancel"
      onClick={onCancel} 
      />
    </div>
  );
}
