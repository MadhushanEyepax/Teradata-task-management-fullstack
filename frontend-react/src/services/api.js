/**
 * API Service Module
 *
 * This file centralizes all API calls to the Symfony backend.
 * Benefits:
 * 1. Single source of truth for API endpoints
 * 2. Easy to maintain and update
 * 3. Reusable across components
 * 4. Easy error handling in one place
 */

import { API_BASE_URL, STORAGE_KEYS } from "../utils/constants";

/**
 * Generic fetch wrapper with error handling and authentication
 * This function handles common tasks like:
 * - Setting headers
 * - Adding authentication token
 * - Parsing JSON responses
 * - Error handling
 */
const fetchAPI = async (endpoint, options = {}) => {
  try {
    // Get token from localStorage for authenticated requests
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    // Check if response is ok (status 200-299)
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

/**
 * Authentication API Methods
 */
export const authAPI = {
  /**
   * Login user
   * @param {string} email - User email
   * @param {string} password - User password
   * @returns {Promise} - Token and user data
   */
  login: async (email, password) => {
    // TODO: Replace with actual Symfony login endpoint
    // For now, return mock data
    return {
      token: "mock-jwt-token",
      user: {
        user_id: 1,
        username: email.split("@")[0],
        email: email,
      },
    };
  },

  /**
   * Register new user
   * @param {Object} userData - User registration data
   * @returns {Promise} - Created user
   */
  register: async (userData) => {
    return fetchAPI("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  /**
   * Logout user (clear local storage)
   */
  logout: () => {
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
  },
};

/**
 * Task API Methods
 */
export const taskAPI = {
  /**
   * Get all tasks with optional filters
   * @param {Object} params - Query parameters (status, page, etc.)
   * @returns {Promise} - API response with tasks
   */
  getAll: async (params = {}) => {
    // Build query string from params object
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/tasks?${queryString}` : "/tasks";
    return fetchAPI(endpoint);
  },

  /**
   * Get a single task by ID
   * @param {number} id - Task ID
   * @returns {Promise} - Task data
   */
  getById: async (id) => {
    return fetchAPI(`/tasks/${id}`);
  },

  /**
   * Create a new task
   * @param {Object} taskData - Task data (title, description, status, etc.)
   * @returns {Promise} - Created task
   */
  create: async (taskData) => {
    return fetchAPI("/tasks", {
      method: "POST",
      body: JSON.stringify(taskData),
    });
  },

  /**
   * Update an existing task
   * @param {number} id - Task ID
   * @param {Object} taskData - Updated task data
   * @returns {Promise} - Updated task
   */
  update: async (id, taskData) => {
    return fetchAPI(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(taskData),
    });
  },

  /**
   * Delete a task
   * @param {number} id - Task ID
   * @returns {Promise} - Deletion confirmation
   */
  delete: async (id) => {
    return fetchAPI(`/tasks/${id}`, {
      method: "DELETE",
    });
  },
};

/**
 * Project API Methods
 */
export const projectAPI = {
  getAll: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/projects?${queryString}` : "/projects";
    return fetchAPI(endpoint);
  },

  getById: async (id) => {
    return fetchAPI(`/projects/${id}`);
  },

  create: async (projectData) => {
    return fetchAPI("/projects", {
      method: "POST",
      body: JSON.stringify(projectData),
    });
  },

  update: async (id, projectData) => {
    return fetchAPI(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(projectData),
    });
  },

  delete: async (id) => {
    return fetchAPI(`/projects/${id}`, {
      method: "DELETE",
    });
  },
};

/**
 * User API Methods
 */
export const userAPI = {
  getAll: async () => {
    return fetchAPI("/users");
  },

  getById: async (id) => {
    return fetchAPI(`/users/${id}`);
  },
};

/**
 * Comment API Methods
 */
export const commentAPI = {
  getAll: async () => {
    return fetchAPI("/comments");
  },

  create: async (commentData) => {
    return fetchAPI("/comments", {
      method: "POST",
      body: JSON.stringify(commentData),
    });
  },

  delete: async (id) => {
    return fetchAPI(`/comments/${id}`, {
      method: "DELETE",
    });
  },
};

export default {
  authAPI,
  taskAPI,
  projectAPI,
  userAPI,
  commentAPI,
};
