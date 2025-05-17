import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const API = "http://localhost:5027/api";

const fetchTasks = async () => {
  const token = localStorage.getItem("token");
  const res = await axios.get(`${API}/tasks`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const useTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });
};
