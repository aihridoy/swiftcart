import api from "@/lib/axios";

export async function sendEmail({ name, email, subject, message }) {
    try {
      const response = await api.post(`/send-email`, { name, email, subject, message });
      return response.data;
    } catch (error) {
      console.error("Error in sendEmail action:", error);
      throw error;
    }
  }
