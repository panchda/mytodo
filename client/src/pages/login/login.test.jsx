import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoginPage from "./login";
import { MemoryRouter } from "react-router-dom";

const mockSetToken = jest.fn();
const mockMutate = jest.fn();

jest.mock("../../stores/use-auth", () => ({
  useAuth: () => ({
    token: null,
    setToken: mockSetToken,
  }),
}));
jest.mock("../../api/auth", () => ({
  loginUser: jest.fn(),
}));
jest.mock("react-router-dom", () => {
  const actual = jest.requireActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => jest.fn(),
  };
});

jest.mock("@tanstack/react-query", () => ({
  useMutation: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}));

describe("LoginPage", () => {
  it("renders form fields and submit button", async () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );
    expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("submits form with entered values", async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    await user.type(screen.getByPlaceholderText(/username/i), "User");
    await user.type(screen.getByPlaceholderText(/email/i), "user@email.com");
    await user.type(screen.getByPlaceholderText(/password/i), "12345");

    await user.click(screen.getByRole("button", { name: /sign in/i }));

    expect(mockMutate).toHaveBeenCalledWith({
      username: "User",
      email: "user@email.com",
      password: "12345",
    });
  });
});
