// API Base URL
export const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8000/api";

// Task Status
export const TASK_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  COMPLETED: "completed",
};

export const TASK_STATUS_LABELS = {
  [TASK_STATUS.PENDING]: "Pending",
  [TASK_STATUS.IN_PROGRESS]: "In Progress",
  [TASK_STATUS.COMPLETED]: "Completed",
};

export const TASK_STATUS_COLORS = {
  [TASK_STATUS.PENDING]: "warning",
  [TASK_STATUS.IN_PROGRESS]: "info",
  [TASK_STATUS.COMPLETED]: "success",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: "authToken",
  AUTH_TOKEN: "authToken", // Alias for backward compatibility
  USER: "user",
  THEME: "theme",
};

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 30, 50];

// Date Formats
export const DATE_FORMAT = "YYYY-MM-DD";
export const DATETIME_FORMAT = "YYYY-MM-DD HH:mm:ss";
export const DISPLAY_DATE_FORMAT = "MMM DD, YYYY";
export const DISPLAY_DATETIME_FORMAT = "MMM DD, YYYY HH:mm";

// Validation
export const VALIDATION_RULES = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_MIN_LENGTH: 3,
  TITLE_MAX_LENGTH: 100,
  DESCRIPTION_MAX_LENGTH: 500,
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
};
