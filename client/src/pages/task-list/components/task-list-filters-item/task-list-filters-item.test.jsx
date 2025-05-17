import "@testing-library/jest-dom";
import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskListFiltersItem from "./task-list-filters-item";

describe("TaskListFiltersItem", () => {
  const mockLabel = "Test Filter";
  const mockHandleClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders filter button with correct label", () => {
    render(
      <TaskListFiltersItem
        label={mockLabel}
        isSelected={false}
        handleClick={mockHandleClick}
      />
    );

    expect(screen.getByText(mockLabel)).toBeInTheDocument();
  });

  it("applies selected class when filter is selected", () => {
    const { container } = render(
      <TaskListFiltersItem
        label={mockLabel}
        isSelected={true}
        handleClick={mockHandleClick}
      />
    );

    expect(container.firstChild).toHaveClass(
      "task-list-filters-item--selected"
    );
  });

  it("does not apply selected class when filter is not selected", () => {
    const { container } = render(
      <TaskListFiltersItem
        label={mockLabel}
        isSelected={false}
        handleClick={mockHandleClick}
      />
    );

    expect(container.firstChild).not.toHaveClass(
      "task-list-filters-item--selected"
    );
  });

  it("calls handleClick with label when clicked", async () => {
    render(
      <TaskListFiltersItem
        label={mockLabel}
        isSelected={false}
        handleClick={mockHandleClick}
      />
    );

    await userEvent.click(screen.getByText(mockLabel));

    expect(mockHandleClick).toHaveBeenCalledWith(mockLabel);
  });

  it("renders as a button element", () => {
    render(
      <TaskListFiltersItem
        label={mockLabel}
        isSelected={false}
        handleClick={mockHandleClick}
      />
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
