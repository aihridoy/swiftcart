import { cache } from "react";
import { notFound } from "next/navigation";
import { escapeRegExp } from "@/lib/escape-regexp";
import { dbConnect } from "@/service/mongo";
import { Product } from "@/models/product-model";
import CategoryPage from "./CategoryPage";

// Errors deliberately propagate to the error boundary: swallowing them into an
// empty array would make a database blip look like a non-existent category.
const getCategoryProducts = cache(async (category) => {
  await dbConnect();
  const products = await Product.find()
    .where("category")
    .regex(new RegExp(`^${escapeRegExp(category)}$`, "i"))
    .lean();
  return JSON.parse(JSON.stringify(products));
});

export async function generateStaticParams() {
  try {
    await dbConnect();
    const categories = await Product.distinct("category");
    return categories.filter(Boolean).map((category) => ({ slug: category }));
  } catch {
    return [];
  }
}

export const revalidate = 3600;

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

  // Categories only exist by virtue of products carrying them, so an empty
  // result means the slug is bogus - 404 instead of an empty grid behind a 200.
  if (products.length === 0) {
    notFound();
  }

  return <CategoryPage params={params} initialProducts={products} />;
}
