import api from "@/lib/axios";

//add new product
export const addProduct = async (productData) => {
  const response = await api.post("/add-product", productData);
  return response.data;
};

//get all products
export const getProducts = async ({ limit, sort } = {}) => {
    const response = await api.get("/products", {
      params: { limit, sort },
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
    });
    return response.data;
  };
