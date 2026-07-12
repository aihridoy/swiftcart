import Ads from "@/components/Ads";
import Banner from "@/components/Banner";
import FeaturedProduct from "@/components/FeaturedProduct";
import Features from "@/components/Features";
import NewArrival from "@/components/NewArrival";
import NewsLetter from "@/components/NewsLetter";
import ShopByCategory from "@/components/ShopByCategory";
import Trending from "@/components/Trending";

export const metadata = {
  title: "Home Decor, Furniture & Lifestyle Products",
  description:
    "Shop the latest home decor, furniture, and lifestyle products at SwiftCart. New arrivals, trending picks, and seasonal deals.",
  openGraph: {
    title: "SwiftCart - Home Decor, Furniture & Lifestyle Products",
    description:
      "Shop the latest home decor, furniture, and lifestyle products at SwiftCart. New arrivals, trending picks, and seasonal deals.",
  },
};

export default function Home() {
  return (
    <>
      <Banner />
      <Features />
      <ShopByCategory />
      <NewArrival />
      <FeaturedProduct />
      <Ads />
      <Trending />
      <NewsLetter />
    </>
  );
}
