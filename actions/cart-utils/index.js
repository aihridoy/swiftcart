import api from "@/lib/axios";

// Add product to cart
export const addToCart = async (productId, quantity = 1) => {
  try {
    const result = await api.post('/cart', {
      productId,
      quantity,
    }, {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    return result.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Fetch cart
export const getCart = async () => {
  try {
    const result = await api.get('/cart', {
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    return result.data; 
  } catch (error) {
    throw new Error(error.message);
  }
};

// Remove product from cart
export const removeFromCart = async (productId) => {
  try {
    const result = await api.delete('/cart', {
      data: { productId },
      headers: {
        "Cache-Control": "no-cache, no-store, must-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });
    return result.data;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Update product quantity in cart
export const updateCartQuantity = async (productId, quantity) => {
  try {
    const result = await api.put(
      "/cart",
      {
        productId,
        quantity,
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
    return result.data;
  } catch (error) {
    throw new Error(error.message);
  }
};