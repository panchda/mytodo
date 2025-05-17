import "@testing-library/jest-dom";
import * as React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskListItem from "./task-list-item";
import { useUpdateTask } from "../../../../queries/use-update-task";

jest.mock("../../../../queries/use-update-task", () => ({
  useUpdateTask: jest.fn(),
}));

jest.mock("@mui/icons-material/Delete", () => () => <span>DeleteIcon</span>);
jest.mock("@mui/icons-material/Edit", () => () => <span>EditIcon</span>);
jest.mock("@mui/icons-material/Send", () => () => <span>SendIcon</span>);

describe("TaskListItem", () => {
  const mockTaskItem = {
    id: 1,
    title: "Test Task",
    isCompleted: false,
  };
  const mockHandleSelect = jest.fn();
  const mockOnDeleteItem = jest.fn();
  const mockUpdateTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useUpdateTask.mockReturnValue({ mutate: mockUpdateTask });
  });

  it("renders task item with correct title and checkbox", () => {
    render(
      <TaskListItem
        taskItem={mockTaskItem}
        isSelected={false}
        handleSelect={mockHandleSelect}
        onDeleteItem={mockOnDeleteItem}
      />
    );

    expect(screen.getByText("Test Task")).toBeInTheDocument();
    expect(screen.getByRole("checkbox")).not.toBeChecked();
  });

  it("applies completed class when task is completed", () => {
    const { container } = render(
      <TaskListItem
        taskItem={{ ...mockTaskItem, isCompleted: true }}
        isSelected={false}
        handleSelect={mockHandleSelect}
        onDeleteItem={mockOnDeleteItem}
      />
    );

    expect(container.firstChild).toHaveClass("task-list-item--completed");
  });

  it("applies selected class when task is selected", () => {
    const { container } = render(
      <TaskListItem
        taskItem={mockTaskItem}
        isSelected={true}
        handleSelect={mockHandleSelect}
        onDeleteItem={mockOnDeleteItem}
      />
    );

    expect(container.firstChild).toHaveClass("task-list-item--selected");
  });

  it("shows edit and delete buttons when selected", () => {
    render(
      <TaskListItem
        taskItem={mockTaskItem}
        isSelected={true}
        handleSelect={mockHandleSelect}
        onDeleteItem={mockOnDeleteItem}
      />
    );

    expect(screen.getByText("EditIcon")).toBeInTheDocument();
    expect(screen.getByText("DeleteIcon")).toBeInTheDocument();
  });

  it("calls handleSelect when clicking on task title", async () => {
    render(
      <TaskListItem
        taskItem={mockTaskItem}
        isSelected={false}
        handleSelect={mockHandleSelect}
        onDeleteItem={mockOnDeleteItem}
      />
    );

    await act(async () => {
      await userEvent.click(screen.getByText("Test Task"));
    });

    expect(mockHandleSelect).toHaveBeenCalled();
  });

  it("toggles task completion when checkbox is clicked", async () => {
    render(
      <TaskListItem
        taskItem={mockTaskItem}
        isSelected={false}
        handleSelect={mockHandleSelect}
        onDeleteItem={mockOnDeleteItem}
      />
    );

    await act(async () => {
      await userEvent.click(screen.getByRole("checkbox"));
    });

    expect(mockUpdateTask).toHaveBeenCalledWith({
      ...mockTaskItem,
      isCompleted: true,
    });
  });

  it("enters edit mode when edit button is clicked", async () => {
    render(
      <TaskListItem
        taskItem={mockTaskItem}
        isSelected={true}
        handleSelect={mockHandleSelect}
        onDeleteItem={mockOnDeleteItem}
      />
    );

    await act(async () => {
      await userEvent.click(screen.getByText("EditIcon"));
    });

    expect(screen.getByPlaceholderText("Write a task..")).toBeInTheDocument();
    expect(screen.getByText("SendIcon")).toBeInTheDocument();
  });

  it("updates task title when editing is complete", async () => {
    render(
      <TaskListItem
        taskItem={mockTaskItem}
        isSelected={true}
        handleSelect={mockHandleSelect}
        onDeleteItem={mockOnDeleteItem}
      />
    );

    await act(async () => {
      await userEvent.click(screen.getByText("EditIcon"));
    });

    await act(async () => {
      await userEvent.type(
        screen.getByPlaceholderText("Write a task.."),
        " Updated"
      );
      await userEvent.click(screen.getByText("SendIcon"));
    });

    expect(mockUpdateTask).toHaveBeenCalledWith({
      ...mockTaskItem,
      title: "Test Task Updated",
    });
    expect(mockHandleSelect).toHaveBeenCalled();
  });

  it("calls onDeleteItem when delete button is clicked", async () => {
    render(
      <TaskListItem
        taskItem={mockTaskItem}
        isSelected={true}
        handleSelect={mockHandleSelect}
        onDeleteItem={mockOnDeleteItem}
      />
    );

    await act(async () => {
      await userEvent.click(screen.getByText("DeleteIcon"));
    });

    expect(mockOnDeleteItem).toHaveBeenCalledWith(mockTaskItem.id);
  });

  it("does not update task if title hasn't changed", async () => {
    render(
      <TaskListItem
        taskItem={mockTaskItem}
        isSelected={true}
        handleSelect={mockHandleSelect}
        onDeleteItem={mockOnDeleteItem}
      />
    );

    await act(async () => {
      await userEvent.click(screen.getByText("EditIcon"));
    });

    await act(async () => {
      await userEvent.click(screen.getByText("SendIcon"));
    });

    expect(mockUpdateTask).not.toHaveBeenCalled();
    expect(mockHandleSelect).toHaveBeenCalled();
  });

  it("focuses input when entering edit mode", async () => {
    const { container } = render(
      <TaskListItem
        taskItem={mockTaskItem}
        isSelected={true}
        handleSelect={mockHandleSelect}
        onDeleteItem={mockOnDeleteItem}
      />
    );

    await act(async () => {
      await userEvent.click(screen.getByText("EditIcon"));
    });

    const input = container.querySelector(".task-list-item__title-input");
    expect(document.activeElement).toBe(input);
  });
});
