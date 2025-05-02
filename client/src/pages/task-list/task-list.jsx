import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskListItem from "./components/task-list-item/task-list-item";
import TaskListFilters from "./components/task-list-filters/task-list-filters";
import ActionButton from "../../shared/components/action-button/action-button";
import TaskListNewItem from "./components/task-list-new-item/task-list-new-item";
import { useAuth } from "../../stores/use-auth";

const taskItems = [
  { id: 1, title: "Call and wish Mark a happy birthday!", isCompleted: false },
  { id: 2, title: "Shopping", isCompleted: true },
  { id: 3, title: "Read a book", isCompleted: false },
];
const filters = [
  { label: "All Tasks" },
  { label: "Completed" },
  { label: "To Do" },
];

export default function TaskListPage() {
  const [selectedTaskId, setIsSelectedTaskId] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState(filters[0].label);
  const [isNewTaskVisible, setIsNewTaskVisible] = useReducer(
    (state) => !state,
    false
  );

  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);

  const toggleSelected = (id) => {
    setIsSelectedTaskId(selectedTaskId === id ? null : id);
  };

  const handleDeleteItem = (id) => {
    // TODO: send delete event to BE
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleAddNewTask = () => {
    setIsNewTaskVisible();
  };

  const filteredTasks = taskItems.filter((taskItem) => {
    if (selectedFilter === "All Tasks") return true;
    if (selectedFilter === "Completed") return taskItem.isCompleted;
    if (selectedFilter === "To Do") return !taskItem.isCompleted;
    return true;
  });

  return (
    <div>
      <button onClick={handleLogout}>Log Out</button>
      <h1>MyTODO</h1>
      <ActionButton label="Add Task" onClick={handleAddNewTask} />

      {isNewTaskVisible && (
        <TaskListNewItem onAdd={() => {}} onCancel={() => {}} />
      )}

      <TaskListFilters
        filters={filters}
        selectedFilter={selectedFilter}
        setSelectedFilter={setSelectedFilter}
      />

      <ul>
        {filteredTasks.map((taskItem) => (
          <li key={taskItem.id}>
            <TaskListItem
              taskItem={taskItem}
              isSelected={selectedTaskId === taskItem.id}
              onTitleClick={() => toggleSelected(taskItem.id)}
              onDeleteItem={() => handleDeleteItem(taskItem.id)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
