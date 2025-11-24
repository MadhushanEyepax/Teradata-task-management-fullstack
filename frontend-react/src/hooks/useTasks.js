import { useState, useEffect } from "react";
import { taskAPI, userAPI, projectAPI } from "../services/api";

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInitialData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [tasksResponse, usersResponse, projectsResponse] =
        await Promise.all([
          taskAPI.getAll(),
          userAPI.getAll(),
          projectAPI.getAll(),
        ]);

      // Handle Symfony JSON-LD format
      const tasksData = tasksResponse["hydra:member"] || tasksResponse;
      const usersData = usersResponse["hydra:member"] || usersResponse;
      const projectsData = projectsResponse["hydra:member"] || projectsResponse;

      setTasks(tasksData);
      setUsers(usersData);
      setProjects(projectsData);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const createTask = async (taskData) => {
    try {
      const newTask = await taskAPI.create(taskData);
      setTasks((prev) => [...prev, newTask]);
      return { success: true, data: newTask };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const updatedTask = await taskAPI.update(id, taskData);
      setTasks((prev) =>
        prev.map((task) => (task.task_id === id ? updatedTask : task))
      );
      return { success: true, data: updatedTask };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteTask = async (id) => {
    try {
      await taskAPI.delete(id);
      setTasks((prev) => prev.filter((task) => task.task_id !== id));
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const refreshTasks = () => {
    fetchInitialData();
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  return {
    tasks,
    users,
    projects,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks,
  };
};
