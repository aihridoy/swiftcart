import api from "@/lib/axios";

// Fetch the user's wishlist
export const getWishlist = async () => {
  try {
    const response = await api.get("/wishlist", {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to fetch wishlist");
  }
};

// Clear the entire wishlist in a single atomic request
export const clearWishlist = async () => {
  try {
    const response = await api.delete("/wishlist", {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || "Failed to clear wishlist");
  }
};

// Add or remove a product from the wishlist
export const updateWishlist = async (productId, action) => {
  try {
    const response = await api.post(
      "/wishlist",
      { productId, action },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || error.message || "Failed to update wishlist");
  }
};