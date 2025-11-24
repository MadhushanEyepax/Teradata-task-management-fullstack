import Modal from "../../common/Modal/Modal";
import Badge from "../../common/Badge/Badge";
import Button from "../../common/Button/Button";
import { TASK_STATUS } from "../../../utils/constants";
import { formatDate, getInitials } from "../../../utils/formatters";

const TaskModal = ({ task, isOpen, onClose, onEdit, onDelete }) => {
  if (!task) return null;

  const getStatusVariant = (status) => {
    const colorMap = {
      [TASK_STATUS.PENDING]: "warning",
      [TASK_STATUS.IN_PROGRESS]: "primary",
      [TASK_STATUS.COMPLETED]: "success",
    };
    return colorMap[status] || "default";
  };

  const priorityColors = {
    low: "text-gray-600 bg-gray-100",
    medium: "text-blue-600 bg-blue-100",
    high: "text-orange-600 bg-orange-100",
    urgent: "text-red-600 bg-red-100",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={task.title}
      size="large"
      footer={
        <div className="flex gap-2">
          <Button variant="primary" onClick={() => onEdit && onEdit(task)}>
            Edit Task
          </Button>
          <Button variant="danger" onClick={() => onDelete && onDelete(task)}>
            Delete Task
          </Button>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Status and Priority */}
        <div className="flex items-center gap-3">
          <Badge variant={getStatusVariant(task.status)} size="medium">
            {task.status}
          </Badge>
          {task.priority && (
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                priorityColors[task.priority.toLowerCase()] ||
                priorityColors.low
              }`}
            >
              {task.priority} Priority
            </span>
          )}
        </div>

        {/* Description */}
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">
            Description
          </h3>
          <p className="text-gray-600">
            {task.description || "No description provided"}
          </p>
        </div>

        {/* Task Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">
              Created Date
            </h4>
            <p className="text-gray-600">
              {task.created_at
                ? formatDate(task.created_at, "MMM DD, YYYY HH:mm")
                : "N/A"}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">
              Due Date
            </h4>
            <p className="text-gray-600">
              {task.due_date
                ? formatDate(task.due_date, "MMM DD, YYYY")
                : "No due date"}
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">
              Assigned To
            </h4>
            {task.assigned_to ? (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                  {getInitials(task.assigned_to.username || "User")}
                </div>
                <div>
                  <p className="text-gray-900 font-medium">
                    {task.assigned_to.username}
                  </p>
                  <p className="text-xs text-gray-500">
                    {task.assigned_to.email}
                  </p>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">Unassigned</p>
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">
              Project
            </h4>
            <p className="text-gray-600">
              {task.project?.project_name || "No project"}
            </p>
          </div>
        </div>

        {/* Created By */}
        {task.created_by && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">
              Created By
            </h4>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white text-sm font-medium">
                {getInitials(task.created_by.username || "User")}
              </div>
              <div>
                <p className="text-gray-900 font-medium">
                  {task.created_by.username}
                </p>
                <p className="text-xs text-gray-500">{task.created_by.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default TaskModal;
