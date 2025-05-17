import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ActionButton from "./action-button";

describe("ActionButton", () => {
  test("renders with label", () => {
    render(<ActionButton label="Click me" />);

    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  test("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(<ActionButton label="Click me" onClick={handleClick} />);

    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("applies disabled styles and prevents click when disabled", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();

    render(
      <ActionButton label="Disabled" disabled={true} onClick={handleClick} />
    );
    const button = screen.getByRole("button");

    expect(button).toBeDisabled();
    expect(button).toHaveClass("action-button--disabled");

    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });
});
