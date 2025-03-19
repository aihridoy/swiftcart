import api from "@/lib/axios";

//add new product
export const addProduct = async (productData) => {
  const response = await api.post("/add-product", productData);
  return response.data;
};

//get all products
export const getProducts = async () => {
    const response = await api.get("/products");
    return response.data;
}
