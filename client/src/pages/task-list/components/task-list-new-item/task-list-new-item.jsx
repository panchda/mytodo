import { useState, useEffect, useRef } from "react";
import ActionButton from "../../../../shared/components/action-button/action-button";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import { useCreateTask } from "../../../../queries/use-create-task";

import "./task-list-new-item.css";

export default function TaskListNewItem({ onClose }) {
  const [title, setTitle] = useState("");
  const inputRef = useRef(null);
  const { mutate: createTask } = useCreateTask();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleAdd = () => {
    if (!title.trim()) return;
    createTask({ title: title.trim() });
    setTitle("");
    onClose();
  };

  const handleCancel = () => {
    setTitle("");
    onClose();
  };

  return (
    <div className="task-list-new-item">
      <input
        ref={inputRef}
        type="text"
        className="task-list-new-item__input"
        placeholder="Write a task.."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <ActionButton
        className="task-list-new-item__action--add"
        label={<SendIcon fontSize="large" />}
        onClick={handleAdd}
      />
      <ActionButton
        className="task-list-new-item__action--cancel"
        label={<CloseIcon fontSize="large" />}
        onClick={handleCancel}
      />
    </div>
  );
}
