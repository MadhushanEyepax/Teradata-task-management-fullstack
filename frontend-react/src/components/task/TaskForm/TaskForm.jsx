import { useState, useEffect } from "react";
import Input from "../../common/Input/Input";
import Button from "../../common/Button/Button";
import Alert from "../../common/Alert/Alert";
import { TASK_STATUS } from "../../../utils/constants";
import { validateRequired, validateMaxLength } from "../../../utils/validators";

const TaskForm = ({
  task = null,
  users = [],
  projects = [],
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: TASK_STATUS.PENDING,
    priority: "medium",
    due_date: "",
    assigned_to: "",
    project_id: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || TASK_STATUS.PENDING,
        priority: task.priority || "medium",
        due_date: task.due_date || "",
        assigned_to: task.assigned_to?.["@id"] || "",
        project_id: task.project?.["@id"] || "",
      });
    }
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};

    const titleError =
      validateRequired(formData.title, "Title") ||
      validateMaxLength(formData.title, 255, "Title");
    if (titleError) newErrors.title = titleError;

    const descError = validateMaxLength(
      formData.description,
      1000,
      "Description"
    );
    if (descError) newErrors.description = descError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        due_date: formData.due_date || null,
      };

      // Add IRI references for Symfony API Platform
      if (formData.assigned_to) {
        submitData.assigned_to = formData.assigned_to;
      }
      if (formData.project_id) {
        submitData.project = formData.project_id;
      }

      await onSubmit(submitData);
    } catch (err) {
      setErrors({ submit: err.message || "Failed to save task" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {errors.submit && (
        <Alert
          type="error"
          message={errors.submit}
          onClose={() => setErrors((prev) => ({ ...prev, submit: "" }))}
        />
      )}

      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        error={errors.title}
        required
        placeholder="Enter task title"
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
            errors.description ? "border-red-500" : "border-gray-300"
          }`}
          placeholder="Enter task description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value={TASK_STATUS.PENDING}>Pending</option>
            <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
            <option value={TASK_STATUS.COMPLETED}>Completed</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Priority
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </div>

      <Input
        label="Due Date"
        name="due_date"
        type="date"
        value={formData.due_date}
        onChange={handleChange}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Assign To
          </label>
          <select
            name="assigned_to"
            value={formData.assigned_to}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Select user...</option>
            {users.map((user) => (
              <option key={user.user_id} value={user["@id"]}>
                {user.username}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project
          </label>
          <select
            name="project_id"
            value={formData.project_id}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="">Select project...</option>
            {projects.map((project) => (
              <option key={project.project_id} value={project["@id"]}>
                {project.project_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <Button type="submit" variant="primary" loading={loading}>
          {task ? "Update Task" : "Create Task"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
