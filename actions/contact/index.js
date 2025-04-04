import api from "@/lib/axios";

export async function sendEmail({ to, subject, html }) {
    try {
      const response = await api.post(`/send-email`, { to, subject, html });
      return response.data; 
    } catch (error) {
      console.error("Error in sendEmail action:", error);
      throw error; 
    }
  }