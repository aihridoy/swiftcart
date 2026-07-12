import { cache } from "react";
import { dbConnect } from "@/service/mongo";
import { Product } from "@/models/product-model";
import CategoryPage from "./CategoryPage";

const getCategoryProducts = cache(async (category) => {
  try {
    await dbConnect();
    const products = await Product.find()
      .where("category")
      .regex(new RegExp(`^${category}$`, "i"))
      .lean();
    return JSON.parse(JSON.stringify(products));
  } catch {
    return [];
  }
});

function formatCategoryName(slug) {
  return decodeURIComponent(slug)
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export async function generateMetadata({ params }) {
  const formattedCategoryName = formatCategoryName(params.slug);

  return {
    title: formattedCategoryName,
    description: `Shop ${formattedCategoryName} products at SwiftCart.`,
  };
}

export default async function Page({ params }) {
  const decodedSlug = decodeURIComponent(params.slug);
  const products = await getCategoryProducts(decodedSlug);
  return <CategoryPage params={params} initialProducts={products} />;
}
