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
