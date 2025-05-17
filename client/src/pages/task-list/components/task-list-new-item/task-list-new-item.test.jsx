import "@testing-library/jest-dom";
import * as React from "react";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskListNewItem from "./task-list-new-item";
import { useCreateTask } from "../../../../queries/use-create-task";

jest.mock("../../../../queries/use-create-task", () => ({
  useCreateTask: jest.fn(),
}));
jest.mock("../../../../shared/components/action-button/action-button", () => ({
  __esModule: true,
  default: ({ label, onClick, className }) => (
    <button className={className} onClick={onClick}>
      {label}
    </button>
  ),
}));

jest.mock("@mui/icons-material/Send", () => () => <span>SendIcon</span>);
jest.mock("@mui/icons-material/Close", () => () => <span>CloseIcon</span>);

describe("TaskListNewItem", () => {
  const mockOnClose = jest.fn();
  const mockCreateTask = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useCreateTask.mockReturnValue({ mutate: mockCreateTask });
  });

  it("renders input and action buttons", () => {
    render(<TaskListNewItem onClose={mockOnClose} />);

    expect(screen.getByPlaceholderText("Write a task..")).toBeInTheDocument();
    expect(screen.getByText("SendIcon")).toBeInTheDocument();
    expect(screen.getByText("CloseIcon")).toBeInTheDocument();
  });

  it("focuses input on mount", () => {
    const { container } = render(<TaskListNewItem onClose={mockOnClose} />);
    const input = container.querySelector("input");

    expect(document.activeElement).toBe(input);
  });

  it("updates input value when typing", async () => {
    render(<TaskListNewItem onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText("Write a task..");

    await act(async () => {
      await userEvent.type(input, "New Task");
    });

    expect(input).toHaveValue("New Task");
  });

  it("calls createTask and onClose when adding a task", async () => {
    render(<TaskListNewItem onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText("Write a task..");
    const addButton = screen.getByText("SendIcon");

    await act(async () => {
      await userEvent.type(input, "New Task");
      await userEvent.click(addButton);
    });

    expect(mockCreateTask).toHaveBeenCalledWith({ title: "New Task" });
    expect(mockOnClose).toHaveBeenCalled();
    expect(input).toHaveValue("");
  });

  it("does not create task when input is empty", async () => {
    render(<TaskListNewItem onClose={mockOnClose} />);
    const addButton = screen.getByText("SendIcon");

    await act(async () => {
      await userEvent.click(addButton);
    });

    expect(mockCreateTask).not.toHaveBeenCalled();
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("clears input and calls onClose when canceling", async () => {
    render(<TaskListNewItem onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText("Write a task..");
    const cancelButton = screen.getByText("CloseIcon");

    await act(async () => {
      await userEvent.type(input, "New Task");
      await userEvent.click(cancelButton);
    });

    expect(mockCreateTask).not.toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
    expect(input).toHaveValue("");
  });

  it("trims whitespace when adding a task", async () => {
    render(<TaskListNewItem onClose={mockOnClose} />);
    const input = screen.getByPlaceholderText("Write a task..");
    const addButton = screen.getByText("SendIcon");

    await act(async () => {
      await userEvent.type(input, "  New Task  ");
      await userEvent.click(addButton);
    });

    expect(mockCreateTask).toHaveBeenCalledWith({ title: "New Task" });
    expect(mockOnClose).toHaveBeenCalled();
  });
});
