import api from "@/lib/axios";

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const result = await api.post("/orders", orderData, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    return result.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to create order");
  }
};

// Fetch all orders for the logged-in user
export const getOrders = async () => {
  try {
    const result = await api.get("/orders", {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    return result.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch orders");
  }
};