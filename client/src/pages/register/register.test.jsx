import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import RegisterPage from "./register";
import { MemoryRouter } from "react-router-dom";

const mockSetToken = jest.fn();
const mockNavigate = jest.fn();
const mockMutate = jest.fn();

jest.mock("../../stores/use-auth", () => ({
  useAuth: () => ({
    token: null,
    setToken: mockSetToken,
  }),
}));

jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

jest.mock("@tanstack/react-query", () => ({
  useMutation: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

jest.mock("../../api/auth", () => ({
  registerUser: jest.fn(),
  loginUser: jest.fn(() => Promise.resolve("mocked-token")),
}));

describe("RegisterPage", () => {
  it("renders all input fields and submit button", () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/confirm password/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign up/i })
    ).toBeInTheDocument();
  });

  it("submits form when passwords match", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText(/username/i), "user");
    await user.type(screen.getByPlaceholderText(/email/i), "user@email.com");
    await user.type(screen.getByPlaceholderText("Password"), "123456");
    await user.type(screen.getByPlaceholderText(/confirm password/i), "123456");

    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(mockMutate).toHaveBeenCalledWith({
      username: "user",
      email: "user@email.com",
      password: "123456",
    });
  });

  it("shows alert when passwords do not match", async () => {
    const user = userEvent.setup();
    window.alert = jest.fn();

    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText("Password"), "123456");
    await user.type(screen.getByPlaceholderText(/confirm password/i), "654321");

    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(window.alert).toHaveBeenCalledWith("Passwords do not match");
    expect(mockMutate).not.toHaveBeenCalled();
  });
});
