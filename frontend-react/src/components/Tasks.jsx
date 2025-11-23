/**
 * Tasks Component - Integrated with Backend API
 *
 * Learning Points:
 * 1. useEffect Hook: Runs side effects (like API calls) after component renders
 * 2. useState Hook: Manages component state (form data, tasks, loading, errors)
 * 3. Async/Await: Modern way to handle asynchronous operations
 * 4. CRUD Operations: Create, Read, Update, Delete
 * 5. Error Handling: Try-catch blocks to handle API failures
 */

import { useState, useEffect } from "react";
import { taskAPI, userAPI, projectAPI } from "../services/api";
import "./Tasks.css";

function Tasks() {
  // Form state - stores input values
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");

  // Data state - stores API data
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedProject, setSelectedProject] = useState("");

  // UI state - manages loading and errors
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, pending, completed

  // Editing state
  const [editingTask, setEditingTask] = useState(null);

  /**
   * useEffect Hook - Runs when component mounts (loads)
   * The empty array [] means "run only once when component first appears"
   * This is perfect for initial data loading
   */
  useEffect(() => {
    fetchInitialData();
  }, []); // Empty dependency array = run once on mount

  /**
   * Fetch all required data from API
   * We need: tasks, users (for assignment), and projects
   */
  const fetchInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Promise.all runs multiple API calls in parallel (faster!)
      const [tasksResponse, usersResponse, projectsResponse] =
        await Promise.all([
          taskAPI.getAll(),
          userAPI.getAll(),
          projectAPI.getAll(),
        ]);

      // API Platform returns data in a specific format
      // The actual array of items is in the 'member' property
      setTasks(tasksResponse.member || []);
      setUsers(usersResponse.member || []);
      setProjects(projectsResponse.member || []);

      // Set default selections if data exists
      if (usersResponse.member?.length > 0) {
        setSelectedUser(usersResponse.member[0]["@id"]);
      }
      if (projectsResponse.member?.length > 0) {
        setSelectedProject(projectsResponse.member[0]["@id"]);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again later.");
    } finally {
      // finally block always runs, whether try succeeds or catch is triggered
      setLoading(false);
    }
  };

  /**
   * Handle form submission - Create new task
   * @param {Event} e - Form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload

    // Validation
    if (!title.trim()) {
      alert("Title is required!");
      return;
    }

    if (!selectedUser || !selectedProject) {
      alert("Please select a user and project!");
      return;
    }

    try {
      setLoading(true);

      // Prepare task data for API
      // API Platform expects IRI references for relationships (e.g., "/api/users/1")
      const taskData = {
        title: title.trim(),
        description: description.trim() || null,
        status: status,
        assignedTo: selectedUser, // IRI reference: "/api/users/1"
        project: selectedProject, // IRI reference: "/api/projects/1"
      };

      if (editingTask) {
        // Update existing task
        await taskAPI.update(editingTask.id, taskData);
        alert("Task updated successfully!");
        setEditingTask(null);
      } else {
        // Create new task
        await taskAPI.create(taskData);
        alert("Task created successfully!");
      }

      // Refresh the task list
      await fetchInitialData();

      // Clear form
      resetForm();
    } catch (err) {
      console.error("Error saving task:", err);
      alert("Failed to save task: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Delete a task
   * @param {number} taskId - ID of task to delete
   */
  const handleDelete = async (taskId) => {
    // Confirm before deleting
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    try {
      setLoading(true);
      await taskAPI.delete(taskId);
      alert("Task deleted successfully!");

      // Refresh the list
      await fetchInitialData();
    } catch (err) {
      console.error("Error deleting task:", err);
      alert("Failed to delete task: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Prepare task for editing
   * Populates form with task data
   */
  const handleEdit = (task) => {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description || "");
    setStatus(task.status);
    setSelectedUser(task.assignedTo["@id"]);
    setSelectedProject(task.project["@id"]);

    // Scroll to form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /**
   * Toggle task status between pending and completed
   */
  const handleToggleStatus = async (task) => {
    try {
      const newStatus = task.status === "pending" ? "completed" : "pending";

      await taskAPI.update(task.id, {
        title: task.title,
        description: task.description,
        status: newStatus,
        assignedTo: task.assignedTo["@id"],
        project: task.project["@id"],
      });

      // Refresh list
      await fetchInitialData();
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status: " + err.message);
    }
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("pending");
    setEditingTask(null);
    if (users.length > 0) setSelectedUser(users[0]["@id"]);
    if (projects.length > 0) setSelectedProject(projects[0]["@id"]);
  };

  /**
   * Filter tasks based on status
   */
  const filteredTasks =
    filter === "all" ? tasks : tasks.filter((task) => task.status === filter);

  // Show loading spinner while fetching data
  if (loading && tasks.length === 0) {
    return (
      <div className="tasks-container">
        <div className="loading">Loading tasks...</div>
      </div>
    );
  }

  return (
    <div className="tasks-container">
      <h2 className="tasks-title">Task Management</h2>

      {/* Error message display */}
      {error && <div className="error-message">{error}</div>}

      {/* Task Form */}
      <form onSubmit={handleSubmit} className="tasks-form">
        <div className="tasks-form-group">
          <label className="tasks-label">Title: *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="tasks-input"
            placeholder="Enter task title"
            disabled={loading}
          />
        </div>

        <div className="tasks-form-group">
          <label className="tasks-label">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="tasks-textarea"
            placeholder="Enter task description (optional)"
            disabled={loading}
          />
        </div>

        <div className="tasks-form-group">
          <label className="tasks-label">Status:</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="tasks-input"
            disabled={loading}
          >
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="tasks-form-group">
          <label className="tasks-label">Assign To: *</label>
          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="tasks-input"
            disabled={loading}
          >
            {users.map((user) => (
              <option key={user["@id"]} value={user["@id"]}>
                {user.username} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div className="tasks-form-group">
          <label className="tasks-label">Project: *</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="tasks-input"
            disabled={loading}
          >
            {projects.map((project) => (
              <option key={project["@id"]} value={project["@id"]}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-buttons">
          <button type="submit" className="tasks-button" disabled={loading}>
            {loading ? "Saving..." : editingTask ? "Update Task" : "Add Task"}
          </button>

          {editingTask && (
            <button
              type="button"
              onClick={resetForm}
              className="tasks-button-secondary"
              disabled={loading}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button
          className={`filter-btn ${filter === "all" ? "active" : ""}`}
          onClick={() => setFilter("all")}
        >
          All ({tasks.length})
        </button>
        <button
          className={`filter-btn ${filter === "pending" ? "active" : ""}`}
          onClick={() => setFilter("pending")}
        >
          Pending ({tasks.filter((t) => t.status === "pending").length})
        </button>
        <button
          className={`filter-btn ${filter === "completed" ? "active" : ""}`}
          onClick={() => setFilter("completed")}
        >
          Completed ({tasks.filter((t) => t.status === "completed").length})
        </button>
      </div>

      <h3 className="tasks-list-title">Task List</h3>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <p className="tasks-empty">
          {filter === "all"
            ? "No tasks yet. Add your first task!"
            : `No ${filter} tasks found.`}
        </p>
      ) : (
        <ul className="tasks-list">
          {filteredTasks.map((task) => (
            <li key={task.id} className={`task-item status-${task.status}`}>
              <div className="task-header">
                <strong className="task-title">{task.title}</strong>
                <span className={`task-badge ${task.status}`}>
                  {task.status}
                </span>
              </div>

              {task.description && (
                <p className="task-description">{task.description}</p>
              )}

              <div className="task-meta">
                <span className="task-meta-item">
                  👤 {task.assignedTo?.username || "Unassigned"}
                </span>
                <span className="task-meta-item">
                  📁 {task.project?.name || "No Project"}
                </span>
                <span className="task-meta-item">
                  💬 {task.comments?.length || 0} comments
                </span>
                <span className="task-meta-item">
                  📎 {task.attachments?.length || 0} files
                </span>
              </div>

              <div className="task-actions">
                <button
                  onClick={() => handleToggleStatus(task)}
                  className="btn-toggle"
                  disabled={loading}
                  title={`Mark as ${
                    task.status === "pending" ? "completed" : "pending"
                  }`}
                >
                  ✓
                </button>
                <button
                  onClick={() => handleEdit(task)}
                  className="btn-edit"
                  disabled={loading}
                  title="Edit task"
                >
                  ✎
                </button>
                <button
                  onClick={() => handleDelete(task.id)}
                  className="btn-delete"
                  disabled={loading}
                  title="Delete task"
                >
                  🗑
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Tasks;
