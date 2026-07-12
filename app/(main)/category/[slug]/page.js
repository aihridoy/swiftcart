import CategoryPage from "./CategoryPage";

export async function generateMetadata({ params }) {
  const decodedSlug = decodeURIComponent(params.slug);
  const formattedCategoryName = decodedSlug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");

  return {
    title: formattedCategoryName,
    description: `Shop ${formattedCategoryName} products at SwiftCart.`,
  };
}

export default function Page({ params }) {
  return <CategoryPage params={params} />;
}
