import { dbConnect } from "@/service/mongo";
import { Product } from "@/models/product-model";
import ProductDetails from "./ProductDetails";

export async function generateMetadata({ params }) {
  try {
    await dbConnect();
    const product = await Product.findById(params.id).lean();

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
  } catch {
    return { title: "Product" };
  }
}

export default function Page({ params }) {
  return <ProductDetails params={params} />;
}
