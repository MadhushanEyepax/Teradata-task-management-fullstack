import Badge from "../../common/Badge/Badge";
import Button from "../../common/Button/Button";
import { TASK_STATUS, TASK_STATUS_COLORS } from "../../../utils/constants";
import { formatDate, getInitials } from "../../../utils/formatters";

const TaskCard = ({ task, onEdit, onDelete, onView }) => {
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
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-5 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <h3
          className="text-lg font-semibold text-gray-900 flex-1 cursor-pointer hover:text-blue-600 transition-colors"
          onClick={() => onView && onView(task)}
        >
          {task.title}
        </h3>
        <Badge variant={getStatusVariant(task.status)} size="small">
          {task.status}
        </Badge>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Meta Info */}
      <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
        {task.priority && (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              priorityColors[task.priority.toLowerCase()] || priorityColors.low
            }`}
          >
            {task.priority}
          </span>
        )}

        {task.due_date && (
          <div className="flex items-center gap-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{formatDate(task.due_date, "MMM DD, YYYY")}</span>
          </div>
        )}

        {task.assigned_to && (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
              {getInitials(task.assigned_to.username || "User")}
            </div>
            <span className="text-xs">{task.assigned_to.username}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-gray-200">
        <Button
          variant="outline"
          size="small"
          onClick={() => onView && onView(task)}
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          View
        </Button>

        <Button
          variant="outline"
          size="small"
          onClick={() => onEdit && onEdit(task)}
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
          Edit
        </Button>

        <Button
          variant="danger"
          size="small"
          onClick={() => onDelete && onDelete(task)}
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          Delete
        </Button>
      </div>
    </div>
  );
};

export default TaskCard;
