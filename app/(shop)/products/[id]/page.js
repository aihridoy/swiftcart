import { cache } from "react";
import { dbConnect } from "@/service/mongo";
import { Product } from "@/models/product-model";
import ProductDetails from "./ProductDetails";

const getProduct = cache(async (id) => {
  try {
    await dbConnect();
    const product = await Product.findById(id).lean();
    return product ? JSON.parse(JSON.stringify(product)) : null;
  } catch {
    return null;
  }
});

// Pre-render the top products at build time; anything else is rendered
// on first request and cached (ISR fallback), see `revalidate` below.
export async function generateStaticParams() {
  try {
    await dbConnect();
    const products = await Product.find({}, { _id: 1 })
      .sort({ popularityScore: -1 })
      .limit(50)
      .lean();
    return products.map((product) => ({ id: product._id.toString() }));
  } catch {
    return [];
  }
}

export const revalidate = 3600;

export async function generateMetadata({ params }) {
  const product = await getProduct(params.id);

  if (!product) {
    return { title: "Product not found" };
  }

  const description = product.description?.slice(0, 160);

  return {
    title: product.title,
    description,
    openGraph: {
      title: product.title,
      description,
      images: product.mainImage ? [product.mainImage] : [],
    },
  };
}

export default async function Page({ params }) {
  const product = await getProduct(params.id);
  return <ProductDetails params={params} initialProduct={product} />;
}
