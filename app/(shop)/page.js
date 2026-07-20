import dynamic from "next/dynamic";
import Banner from "@/components/Banner";
import Features from "@/components/Features";
import ShopByCategory from "@/components/ShopByCategory";
import NewArrival from "@/components/NewArrival";
import BestSellers from "@/components/BestSellers";
import FeaturedProduct from "@/components/FeaturedProduct";

// Below-the-fold sections split into their own chunks instead of bundled
// with the above-the-fold ones. `ssr: false` isn't usable here (this page
// is a Server Component - Next.js only allows it from a Client Component),
// so this only trims initial bundle size, not time-to-first-byte.
const Deals = dynamic(() => import("@/components/Deals"));
const Ads = dynamic(() => import("@/components/Ads"));
const Trending = dynamic(() => import("@/components/Trending"));
const Testimonials = dynamic(() => import("@/components/Testimonials"));
const FAQHome = dynamic(() => import("@/components/FAQHome"));
const NewsLetter = dynamic(() => import("@/components/NewsLetter"));

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
