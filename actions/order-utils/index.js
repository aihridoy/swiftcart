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
export const getOrders = async ({ page = 1, limit = 10 } = {}) => {
  try {
    const result = await api.get(`/orders?page=${page}&limit=${limit}`, {
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

// Update order status
export const updateOrderStatus = async ({ orderId, status }) => {
  try {
    const response = await api.patch("/orders", { orderId, status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to update order status");
  }
};