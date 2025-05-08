import axios from "axios";

const API = "http://localhost:5027/api";

export const registerUser = async ({ username, email, password }) => {
  const res = await axios.post(`${API}/auth/register`, {
    username,
    email,
    passwordHash: password,
  });
  return res.data;
};

export const loginUser = async ({ username, email, password }) => {
  const res = await axios.post(`${API}/auth/login`, {
    username,
    email,
    passwordHash: password,
  });
  return res.data.token;
};
