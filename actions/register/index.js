export const registerUser = async (userData) => {
  try {
    const response = await fetch(`/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, message: data.message || "Registration failed" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      success: false,
      message: error.message || "An unexpected error occurred",
    };
  }
};
