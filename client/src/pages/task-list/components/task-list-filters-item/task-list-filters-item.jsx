import cn from "classnames";

import "./task-list-filters-item.css";

export default function TaskListFiltersItem({
  isSelected,
  label,
  handleClick,
}) {
  return (
    <button
      className={cn("task-list-filters-item", {
        "task-list-filters-item--selected": isSelected,
      })}
      onClick={() => handleClick(label)}
    >
      {label}
    </button>
  );
}
