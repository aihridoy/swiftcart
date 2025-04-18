import api from "@/lib/axios";

//add new product
export const addProduct = async (productData) => {
  const response = await api.post("/add-product", productData);
  return response.data;
};

//get all products
export const getProducts = async ({ limit, sort, category } = {}) => {
    const response = await api.get("/products", {
      params: { limit, sort, category },
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
    return response.data;
  };

  //get product by id
  export const getProductById = async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  };

  //delete product 
  export const deleteProduct = async (id) => {
    const response = await api.delete(`/products/${id}`);
    return response.data;
  }

  // Increment popularityScore for a product
export const incrementPopularity = async (id, incrementBy = 1) => {
  try {
    const response = await api.post(`/products/${id}/increment-popularity`, { incrementBy });
    return response.data;
  } catch (error) {
    console.error(`Error incrementing popularity for product ${id}:`, error);
    throw error;
  }
};

//search products
export const searchProducts = async (query) => {
  try {
    const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};
