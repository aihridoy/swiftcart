import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
  // ponytail: 5s aborted first-hit requests while the DB connection was still
  // being established, surfacing as "Failed to load ..." that a reload fixed
  timeout: 20000,
});

// Optional: Add interceptors for request/response handling
api.interceptors.request.use(
  (config) => {
    // Add any request modifications here (e.g., attach auth tokens)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      return Promise.reject(new Error(error.response.data.error || "Server error"));
    } else if (error.request) {
      return Promise.reject(new Error("No response from server"));
    } else {
      return Promise.reject(new Error(error.message || "Request setup error"));
    }
  }
);

export default api;