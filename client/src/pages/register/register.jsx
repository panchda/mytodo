import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerUser, loginUser } from "../../api/auth";
import { useAuth } from "../../stores/use-auth";

export default function RegisterPage() {
  const navigate = useNavigate();
  const setToken = useAuth((state) => state.setToken);

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm: "",
  });

  const mutation = useMutation({
    mutationFn: registerUser,
    onSuccess: async (_, variables) => {
      try {
        const token = await loginUser({
          username: variables.username,
          password: variables.password,
        });
        setToken(token);
        navigate("/tasks");
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
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Sign Up</h2>
        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            style={styles.input}
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            style={styles.input}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            style={styles.input}
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Confirm password"
            style={styles.input}
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
            required
          />

          <button
            type="submit"
            style={styles.button}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Signing up..." : "Sign Up"}
          </button>
        </form>
        <p style={styles.text}>
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    backgroundColor: "#f6f5fc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    padding: "40px",
    borderRadius: "20px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
    width: "320px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginTop: "20px",
  },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
  },
  button: {
    backgroundColor: "#e49288",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius: "10px",
    fontSize: "16px",
    cursor: "pointer",
  },
  text: {
    marginTop: "15px",
    fontSize: "14px",
  },
};
