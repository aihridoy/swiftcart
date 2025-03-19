//add new product
import api from "@/lib/axios";

export const addProduct = async (productData) => {
  const response = await api.post("/products", productData);
  return response.data;
};
