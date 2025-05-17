import TaskListFiltersItem from "../task-list-filters-item/task-list-filters-item";

import "./task-list-filters.css";

export default function TaskListFilters({
  filters,
  selectedFilter,
  setSelectedFilter,
}) {
  const handleFilterClick = (label) => {
    setSelectedFilter(label);
  };

  return (
    <ul className="task-list-filters">
      {filters.map((filter) => (
        <li key={filter.label}>
          <TaskListFiltersItem
            isSelected={selectedFilter === filter.label}
            label={filter.label}
            handleClick={handleFilterClick}
          />
        </li>
      ))}
    </ul>
  );
}
