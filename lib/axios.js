import axios from "axios";

const api = axios.create({
  baseURL: "/api", // Base URL for all API requests (relative to your Next.js app)
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // Optional: Set a timeout (10 seconds)
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
    // Handle errors globally (e.g., log them or redirect on 401)
    if (error.response) {
      // Server responded with a status code outside 2xx
      return Promise.reject(new Error(error.response.data.error || "Server error"));
    } else if (error.request) {
      // Request was made but no response received
      return Promise.reject(new Error("No response from server"));
    } else {
      // Something else caused the error
      return Promise.reject(new Error(error.message || "Request setup error"));
    }
  }
);

export default api;