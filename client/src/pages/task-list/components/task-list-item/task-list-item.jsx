import { useState, useRef, useEffect } from "react";
import cn from "classnames";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SendIcon from "@mui/icons-material/Send";
import { useUpdateTask } from "../../../../queries/use-update-task";

import "./task-list-item.css";

export default function TaskListItem({
  taskItem,
  isSelected,
  handleSelect,
  onDeleteItem,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(taskItem.title);
  const inputRef = useRef(null);
  const { mutate: updateTask } = useUpdateTask();

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
    }
  }, [isEditing]);

  const handleTitleUpdate = () => {
    if (taskItem.title !== editedTitle) {
      updateTask({ ...taskItem, title: editedTitle });
    }
    setIsEditing(false);
    handleSelect();
  };

  const handleCheckUpdate = () => {
    updateTask({
      ...taskItem,
      isCompleted: !taskItem.isCompleted,
    });
  };

  return (
    <div
      className={cn("task-list-item", {
        "task-list-item--completed": taskItem.isCompleted,
        "task-list-item--selected": isSelected,
      })}
    >
      <input
        type="checkbox"
        className="task-list-item__checkbox"
        checked={taskItem.isCompleted}
        onChange={handleCheckUpdate}
      />

      <div className="task-list-item__title">
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            className="task-list-item__title-input"
            placeholder="Write a task.."
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onBlur={handleTitleUpdate}
          />
        ) : (
          <button
            className="task-list-item__title-button"
            onClick={handleSelect}
          >
            {taskItem.title}
          </button>
        )}

        {isSelected && (
          <div className="task-list-item__actions">
            <button
              onClick={() => {
                isEditing ? handleTitleUpdate() : setIsEditing(true);
              }}
            >
              {isEditing ? (
                <SendIcon fontSize="large" />
              ) : (
                <EditIcon fontSize="large" />
              )}
            </button>
            <button onClick={() => onDeleteItem(taskItem.id)}>
              <DeleteIcon fontSize="large" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
