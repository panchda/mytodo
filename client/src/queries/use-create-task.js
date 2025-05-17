import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const API = "http://localhost:5027/api/tasks";

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ title }) => {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        API,
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
    },
    onSuccess: () => {
      // Обновляем список задач после добавления
      queryClient.invalidateQueries(["tasks"]);
    },
  });
};
