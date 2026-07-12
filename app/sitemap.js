import { dbConnect } from "@/service/mongo";
import { Product } from "@/models/product-model";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";

const staticRoutes = ["", "/products", "/about-us", "/contact", "/search"];

export default async function sitemap() {
  const staticEntries = staticRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
  }));

  try {
    await dbConnect();
    const products = await Product.find({}, { updatedAt: 1, category: 1 }).lean();

    const productEntries = products.map((product) => ({
      url: `${baseUrl}/products/${product._id}`,
      lastModified: product.updatedAt || new Date(),
    }));

    const categories = [...new Set(products.map((p) => p.category).filter(Boolean))];
    const categoryEntries = categories.map((category) => ({
      url: `${baseUrl}/category/${encodeURIComponent(category)}`,
      lastModified: new Date(),
    }));

    return [...staticEntries, ...productEntries, ...categoryEntries];
  } catch {
    return staticEntries;
  }
}
