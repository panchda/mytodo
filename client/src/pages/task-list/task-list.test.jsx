import "@testing-library/jest-dom";
import * as React from "react";
import { render, screen } from "@testing-library/react";
import { act } from "react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { useTasks } from "../../queries/use-tasks";
import TaskListPage from "./task-list";

const mockLogout = jest.fn();
const mockNavigate = jest.fn();
const mockDeleteTask = jest.fn();

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});
jest.mock("../../stores/use-auth", () => ({
  useAuth: (selector) => selector({ logout: mockLogout }),
}));
jest.mock("../../queries/use-tasks", () => ({
  useTasks: jest.fn(),
}));
jest.mock("./components/task-list-item/task-list-item", () => () => (
  <div>TaskListItem</div>
));
jest.mock("./components/task-list-new-item/task-list-new-item", () => () => (
  <input placeholder="Add new task" />
));
jest.mock("./components/task-list-filters/task-list-filters", () => () => (
  <div>TaskListFilters</div>
));
jest.mock(
  "../../shared/components/action-button/action-button",
  () =>
    ({ label, onClick }) =>
      <button onClick={onClick}>{label}</button>
);
jest.mock(
  "../../shared/components/feedback-state/feedback-state",
  () =>
    ({ title }) =>
      <div>{title}</div>
);
jest.mock("../../queries/use-delete-task", () => ({
  useDeleteTask: () => ({
    mutate: mockDeleteTask,
  }),
}));

describe("TaskListPage", () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it("renders all task items", () => {
    useTasks.mockReturnValue({
      data: [
        { id: 1, title: "First task", isCompleted: false },
        { id: 2, title: "Second task", isCompleted: true },
      ],
      isLoading: false,
      isError: false,
    });

    render(
      <MemoryRouter>
        <TaskListPage />
      </MemoryRouter>
    );

    expect(screen.getByText("MyTODO")).toBeInTheDocument();
    expect(screen.getAllByText("TaskListItem")).toHaveLength(2);
    expect(
      screen.getByRole("button", { name: /add task/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /log out/i })
    ).toBeInTheDocument();
  });

  it("shows loading state", () => {
    useTasks.mockReturnValue({
      isLoading: true,
      isError: false,
      data: [],
    });

    render(
      <MemoryRouter>
        <TaskListPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("shows error state", () => {
    useTasks.mockReturnValue({
      isLoading: false,
      isError: true,
      data: [],
    });

    render(
      <MemoryRouter>
        <TaskListPage />
      </MemoryRouter>
    );

    expect(screen.getByText("Something went wrong...")).toBeInTheDocument();
  });

  it("calls logout and navigates on logout button click", async () => {
    useTasks.mockReturnValue({
      isLoading: false,
      isError: false,
      data: [],
    });

    render(
      <MemoryRouter>
        <TaskListPage />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: /Log Out/i }));

    expect(mockLogout).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("shows new task input when Add Task is clicked", async () => {
    useTasks.mockReturnValue({
      isLoading: false,
      isError: false,
      data: [],
    });

    render(
      <MemoryRouter>
        <TaskListPage />
      </MemoryRouter>
    );

    await userEvent.click(screen.getByRole("button", { name: /Add Task/i }));

    expect(screen.getByPlaceholderText(/add new task/i)).toBeInTheDocument();
  });
});
