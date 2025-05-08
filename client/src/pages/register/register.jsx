import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerUser, loginUser } from "../../api/auth";
import { useAuth } from "../../stores/use-auth";
import ActionButton from "../../shared/components/action-button/action-button";

import "./register.css";

export default function RegisterPage() {
  const navigate = useNavigate();
  const setToken = useAuth((state) => state.setToken);
  const token =
    useAuth((state) => state.token) || localStorage.getItem("token");

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  useEffect(() => {
    if (token) {
      navigate("/tasks", { replace: true });
    }
  }, [token, navigate]);

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: async (_, variables) => {
      try {
        const token = await loginUser({
          username: variables.username,
          email: variables.email,
          password: variables.password,
        });
        setToken(token);
      } catch (err) {
        alert("Registration was succesful, but login is failed");
        navigate("/");
      }
    },
    onError: (error) => {
      alert(`Registration failed with data: ${error?.response?.data}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      return alert("Passwords do not match");
    }
    mutation.mutate({
      username: form.username,
      email: form.email,
      password: form.password,
    });
  };

  return (
    <div className="register">
      <div className="register-container">
        <h2 className="register-title">Sign Up</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="register-input"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="email"
            className="register-input"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            className="register-input"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <input
            type="password"
            className="register-input"
            placeholder="Confirm password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            required
          />

          <ActionButton
            disabled={mutation.isPending}
            label={`${mutation.isPending ? "Signing up..." : "Sign Up"}`}
          />
        </form>
      </div>
    </div>
  );
}
