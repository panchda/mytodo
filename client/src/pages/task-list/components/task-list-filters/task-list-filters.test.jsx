import "@testing-library/jest-dom";
import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TaskListFilters from "./task-list-filters";

jest.mock("../task-list-filters-item/task-list-filters-item", () => ({
  __esModule: true,
  default: ({ label, isSelected, handleClick }) => (
    <button
      data-testid={`filter-${label}`}
      data-selected={isSelected}
      onClick={() => handleClick(label)}
    >
      {label}
    </button>
  ),
}));

describe("TaskListFilters", () => {
  const mockFilters = [
    { label: "All Tasks" },
    { label: "Completed" },
    { label: "To Do" },
  ];
  const mockSelectedFilter = "All Tasks";
  const mockSetSelectedFilter = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all filter items", () => {
    render(
      <TaskListFilters
        filters={mockFilters}
        selectedFilter={mockSelectedFilter}
        setSelectedFilter={mockSetSelectedFilter}
      />
    );

    mockFilters.forEach((filter) => {
      expect(screen.getByTestId(`filter-${filter.label}`)).toBeInTheDocument();
    });
  });

  it("renders filters in a list", () => {
    const { container } = render(
      <TaskListFilters
        filters={mockFilters}
        selectedFilter={mockSelectedFilter}
        setSelectedFilter={mockSetSelectedFilter}
      />
    );

    expect(container.querySelector("ul")).toHaveClass("task-list-filters");
    expect(container.querySelectorAll("li")).toHaveLength(mockFilters.length);
  });

  it("passes correct selected state to filter items", () => {
    render(
      <TaskListFilters
        filters={mockFilters}
        selectedFilter={mockSelectedFilter}
        setSelectedFilter={mockSetSelectedFilter}
      />
    );

    const selectedFilter = screen.getByTestId(`filter-${mockSelectedFilter}`);
    expect(selectedFilter).toHaveAttribute("data-selected", "true");

    const unselectedFilters = mockFilters
      .filter((filter) => filter.label !== mockSelectedFilter)
      .map((filter) => screen.getByTestId(`filter-${filter.label}`));

    unselectedFilters.forEach((filter) => {
      expect(filter).toHaveAttribute("data-selected", "false");
    });
  });

  it("calls setSelectedFilter with correct label when filter is clicked", async () => {
    render(
      <TaskListFilters
        filters={mockFilters}
        selectedFilter={mockSelectedFilter}
        setSelectedFilter={mockSetSelectedFilter}
      />
    );

    const newFilter = mockFilters[1];
    await userEvent.click(screen.getByTestId(`filter-${newFilter.label}`));

    expect(mockSetSelectedFilter).toHaveBeenCalledWith(newFilter.label);
  });

  it("renders correct number of filter items", () => {
    const { container } = render(
      <TaskListFilters
        filters={mockFilters}
        selectedFilter={mockSelectedFilter}
        setSelectedFilter={mockSetSelectedFilter}
      />
    );

    const filterItems = container.querySelectorAll("li");
    expect(filterItems).toHaveLength(mockFilters.length);
  });

  it("maintains filter order as provided in props", () => {
    render(
      <TaskListFilters
        filters={mockFilters}
        selectedFilter={mockSelectedFilter}
        setSelectedFilter={mockSetSelectedFilter}
      />
    );

    const renderedFilters = screen.getAllByRole("button");
    mockFilters.forEach((filter, index) => {
      expect(renderedFilters[index]).toHaveTextContent(filter.label);
    });
  });
});
