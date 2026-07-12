import Ads from "@/components/Ads";
import Banner from "@/components/Banner";
import BestSellers from "@/components/BestSellers";
import Deals from "@/components/Deals";
import FAQHome from "@/components/FAQHome";
import FeaturedProduct from "@/components/FeaturedProduct";
import Features from "@/components/Features";
import NewArrival from "@/components/NewArrival";
import NewsLetter from "@/components/NewsLetter";
import ShopByCategory from "@/components/ShopByCategory";
import Testimonials from "@/components/Testimonials";
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
      <BestSellers />
      <FeaturedProduct />
      <Deals />
      <Ads />
      <Trending />
      <Testimonials />
      <FAQHome />
      <NewsLetter />
    </>
  );
}
