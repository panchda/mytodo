import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import FeedbackState from "./feedback-state";

describe("FeedbackState", () => {
  it("renders title text", async () => {
    render(<FeedbackState title="No tasks found" />);

    expect(screen.getByText(/no tasks found/i)).toBeInTheDocument();
  });

  it("has correct CSS class", async () => {
    render(<FeedbackState title="Empty" />);

    expect(screen.getByText("Empty")).toHaveClass("feedback-state");
  });
});
