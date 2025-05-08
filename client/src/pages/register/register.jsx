import React from "react";
import { Link } from "react-router-dom";

import "./register.css";

export default function RegisterPage() {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Sign Up</h2>
        <form style={styles.form}>
          <input type="text" placeholder="Username" style={styles.input} />
          <input type="email" placeholder="Email" style={styles.input} />
          <input type="password" placeholder="Password" style={styles.input} />
          <input
            type="password"
            placeholder="Confirm password"
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Sign Up
          </button>
        </form>
        <p style={styles.text}>
          Already have an account? <Link to="/">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

