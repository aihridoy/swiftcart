const { default: api } = require("@/lib/axios");

//forgot password 
export async function forgetPassword(email) {
    try {
        const response = await api.post(`/forgot-password`, { email });
        return response.data;   
    }
    catch (error) {
        console.error("Error in forgetPassword action:", error);
        throw error; 
    }
}

//reset password
export async function resetPassword(token, newPassword) {
    try {
        const response = await api.post(`/reset-password`, { token, newPassword });
        return response.data;   
    }
    catch (error) {
        console.error("Error in resetPassword action:", error);
        throw error; 
    }
}