import { useState, useMemo } from "react";
import Layout from "../../components/layout/Layout/Layout";
import TaskList from "../../components/task/TaskList/TaskList";
import TaskFilters from "../../components/task/TaskFilters/TaskFilters";
import TaskModal from "../../components/task/TaskModal/TaskModal";
import TaskForm from "../../components/task/TaskForm/TaskForm";
import Button from "../../components/common/Button/Button";
import Modal from "../../components/common/Modal/Modal";
import Alert from "../../components/common/Alert/Alert";
import { useTasks } from "../../hooks/useTasks";
import { filterBySearch } from "../../utils/helpers";

const Tasks = () => {
  const {
    tasks,
    users,
    projects,
    loading,
    error,
    createTask,
    updateTask,
    deleteTask,
    refreshTasks,
  } = useTasks();

  const [filters, setFilters] = useState({
    search: "",
    status: "",
    user: "",
    project: "",
  });

  const [selectedTask, setSelectedTask] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [alert, setAlert] = useState(null);

  // Filter tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search filter
    if (filters.search) {
      result = filterBySearch(result, filters.search, ["title", "description"]);
    }

    // Status filter
    if (filters.status) {
      result = result.filter((task) => task.status === filters.status);
    }

    // User filter
    if (filters.user) {
      result = result.filter(
        (task) => task.assigned_to?.user_id === parseInt(filters.user)
      );
    }

    // Project filter
    if (filters.project) {
      result = result.filter(
        (task) => task.project?.id === parseInt(filters.project)
      );
    }

    return result;
  }, [tasks, filters]);

  const handleViewTask = (task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setIsFormModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsFormModalOpen(true);
    setIsViewModalOpen(false);
  };

  const handleDeleteTask = async (task) => {
    if (!window.confirm(`Are you sure you want to delete "${task.title}"?`)) {
      return;
    }

    const result = await deleteTask(task.task_id);
    if (result.success) {
      setAlert({ type: "success", message: "Task deleted successfully" });
      setIsViewModalOpen(false);
    } else {
      setAlert({
        type: "error",
        message: result.error || "Failed to delete task",
      });
    }
  };

  const handleSubmitTask = async (taskData) => {
    let result;

    if (editingTask) {
      result = await updateTask(editingTask.task_id, taskData);
    } else {
      result = await createTask(taskData);
    }

    if (result.success) {
      setAlert({
        type: "success",
        message: editingTask
          ? "Task updated successfully"
          : "Task created successfully",
      });
      setIsFormModalOpen(false);
      setEditingTask(null);
    } else {
      setAlert({
        type: "error",
        message: result.error || "Failed to save task",
      });
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tasks</h1>
            <p className="mt-2 text-gray-600">
              Manage and track all your tasks
            </p>
          </div>
          <Button variant="primary" onClick={handleCreateTask}>
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Create Task
          </Button>
        </div>

        {/* Alert */}
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* Error Message */}
        {error && <Alert type="error" message={error} onClose={refreshTasks} />}

        {/* Filters */}
        <TaskFilters
          filters={filters}
          onFilterChange={setFilters}
          users={users}
          projects={projects}
        />

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          loading={loading}
          onView={handleViewTask}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />

        {/* View Task Modal */}
        <TaskModal
          task={selectedTask}
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
        />

        {/* Create/Edit Task Modal */}
        <Modal
          isOpen={isFormModalOpen}
          onClose={() => {
            setIsFormModalOpen(false);
            setEditingTask(null);
          }}
          title={editingTask ? "Edit Task" : "Create New Task"}
          size="large"
        >
          <TaskForm
            task={editingTask}
            users={users}
            projects={projects}
            onSubmit={handleSubmitTask}
            onCancel={() => {
              setIsFormModalOpen(false);
              setEditingTask(null);
            }}
          />
        </Modal>
      </div>
    </Layout>
  );
};

export default Tasks;
