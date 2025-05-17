import axios from "axios";

const API = "http://localhost:5027/api";

export const createTask = async ({ title }) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(
    `${API}/tasks`,
    {
      title,
      isCompleted: false,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};
