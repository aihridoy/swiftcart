import api from "@/lib/axios";

export const registerUser = async (userData) => {
  try {
    const response = await api.post(`/register`, userData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
};