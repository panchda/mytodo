import { useState } from "react";
import cn from "classnames";
import "./task-list-item.css";

export default function TaskListItem({
  taskItem,
  isSelected,
  onTitleClick,
  onDeleteItem,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(taskItem.title);

  const handleTitleUpdate = () => {
    // TODO: Send to BE new title

    setIsEditing(false);
  };

  const handleCheckUpdate = () => {
    // TODO: Send to BE new state of checbox
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
        className="task-checkbox"
        checked={taskItem.isCompleted}
        onChange={handleCheckUpdate}
      />

      {isEditing ? (
        <input
          type="text"
          placeholder="Write a task.."
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onBlur={handleTitleUpdate}
        />
      ) : (
        <button className="task-title" onClick={onTitleClick}>
          {taskItem.title}
        </button>
      )}

      {isSelected && (
        <div className="task-actions">
          <button
            onClick={() => {
              isEditing ? handleTitleUpdate() : setIsEditing(true);
            }}
          >
            {isEditing ? "save" : "edit"}
          </button>
          <button onClick={onDeleteItem}>🗑️</button>
        </div>
      )}
    </div>
  );
}
