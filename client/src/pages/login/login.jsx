import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "../../api/auth";
import { useAuth } from "../../stores/use-auth";
import ActionButton from "../../shared/components/action-button/action-button";

import "./login.css";

export default function LoginPage() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const navigate = useNavigate();
  const setToken = useAuth((state) => state.setToken);
  const token =
    useAuth((state) => state.token) || localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/tasks", { replace: true });
    }
  }, [token, navigate]);

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (token) => {
      setToken(token);
    },
    onError: (error) => {
      console.log("Login error", error);
      alert("Invalid data or user does not exist.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate({
      username: form.username,
      email: form.email,
      password: form.password,
    });
  };

  return (
    <div className="login">
      <div className="login-container">
        <h2 className="login-title">Login</h2>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="login-input"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="email"
            className="login-input"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <ActionButton
            disabled={mutation.isPending}
            label={`${mutation.isPending ? "Signing in..." : "Sign in"}`}
          />
        </form>
        <p className="login-text">
          Don’t have an account? <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
