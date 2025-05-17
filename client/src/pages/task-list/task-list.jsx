import { useReducer, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../stores/use-auth";
import { useTasks } from "../../queries/use-tasks";
import { useDeleteTask } from "../../queries/use-delete-task";
import TaskListItem from "./components/task-list-item/task-list-item";
import TaskListFilters from "./components/task-list-filters/task-list-filters";
import ActionButton from "../../shared/components/action-button/action-button";
import TaskListNewItem from "./components/task-list-new-item/task-list-new-item";
import FeedbackState from "../../shared/components/feedback-state/feedback-state";

import "./task-list.css";

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
  const { mutate: deleteTask } = useDeleteTask();

  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);
  const { data: tasks, isLoading, isError } = useTasks();

  if (isLoading) return <FeedbackState title="Loading..." />;
  if (isError) return <FeedbackState title="Something went wrong..." />;

  const toggleSelected = (id) => {
    setIsSelectedTaskId(selectedTaskId === id ? null : id);
  };

  const handleDeleteItem = (id) => {
    deleteTask(id);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const filteredTasks = tasks.filter((taskItem) => {
    if (selectedFilter === "All Tasks") return true;
    if (selectedFilter === "Completed") return taskItem.isCompleted;
    if (selectedFilter === "To Do") return !taskItem.isCompleted;
    return true;
  });

  return (
    <div className="task-list">
      <button className="task-list__logout-action" onClick={handleLogout}>
        Log Out
      </button>
      <div className="task-list__wrapper">
        <div className="task-list__inner-wrapper">
          <h1 className="task-list__logo">MyTODO</h1>
          <ActionButton
            disabled={isNewTaskVisible}
            label="Add Task"
            onClick={setIsNewTaskVisible}
          />
        </div>
        {isNewTaskVisible && <TaskListNewItem onClose={setIsNewTaskVisible} />}
        <TaskListFilters
          filters={filters}
          selectedFilter={selectedFilter}
          setSelectedFilter={setSelectedFilter}
        />
        {filteredTasks.length ? (
          <ul className="task-list-items">
            {filteredTasks.map((taskItem) => (
              <li key={taskItem.id}>
                <TaskListItem
                  taskItem={taskItem}
                  isSelected={selectedTaskId === taskItem.id}
                  handleSelect={() => toggleSelected(taskItem.id)}
                  onDeleteItem={() => handleDeleteItem(taskItem.id)}
                />
              </li>
            ))}
          </ul>
        ) : (
          <FeedbackState title="No tasks found." />
        )}
      </div>
    </div>
  );
}
