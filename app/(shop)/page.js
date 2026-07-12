import Ads from "@/components/Ads";
import Banner from "@/components/Banner";
import FeaturedProduct from "@/components/FeaturedProduct";
import Features from "@/components/Features";
import NewArrival from "@/components/NewArrival";
import NewsLetter from "@/components/NewsLetter";
import ShopByCategory from "@/components/ShopByCategory";
import Trending from "@/components/Trending";

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
