import { create } from "zustand";

export const useAuth = create((set) => ({
  token: null,
  setToken: (token) => {
    localStorage.setItem("token", token);
    set({ token });
  },
  logout: () => {
    localStorage.removeItem("token");
    set({ token: null });
  },
}));
