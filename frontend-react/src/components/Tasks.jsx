import { useState } from "react";
import "./Tasks.css";

function Tasks() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tasks, setTasks] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title === "") {
      alert("Title is required!");
      return;
    }

    const newTask = {
      id: Date.now(),
      title: title,
      description: description,
      status: "pending",
    };

    setTasks([...tasks, newTask]);

    //Clearing the form:
    setTitle("");
    setDescription("");
  };

  return (
    <div className="tasks-container">
      <h2 className="tasks-title">My Tasks</h2>

      <form onSubmit={handleSubmit} className="tasks-form">
        <div className="tasks-form-group">
          <label className="tasks-label">Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="tasks-input"
          />
        </div>

        <div className="tasks-form-group">
          <label className="tasks-label">Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="tasks-textarea"
          />
        </div>

        <button type="submit" className="tasks-button">
          Add Task
        </button>
      </form>
      <h3 className="tasks-list-title">Task List</h3>

      {tasks.length === 0 ? (
        <p className="tasks-empty">No tasks yet. Add your first task!</p>
      ) : (
        <ul className="tasks-list">
          {tasks.map((task) => (
            <li key={task.id} className="task-item">
              <strong className="task-title">{task.title}</strong>
              <span className="task-description">{task.description}</span>
              <span className="task-status"> ({task.status})</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Tasks;
