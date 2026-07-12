import { dbConnect } from "@/service/mongo";
import { Product } from "@/models/product-model";
import Products from "./Products";

export const metadata = {
  title: "All Products",
  description: "Browse the full SwiftCart product catalog.",
};

async function getAllProducts() {
  try {
    await dbConnect();
    const products = await Product.find().lean();
    return JSON.parse(JSON.stringify(products));
  } catch {
    return [];
  }
}

export default async function Page() {
  const products = await getAllProducts();
  return <Products initialProducts={products} />;
}
