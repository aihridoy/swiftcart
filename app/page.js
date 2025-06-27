import Ads from "@/components/Ads";
import Banner from "@/components/Banner";
import CopyRight from "@/components/CopyRight";
import FeaturedProduct from "@/components/FeaturedProduct";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import NewArrival from "@/components/NewArrival";
import ShopByCategory from "@/components/ShopByCategory";
import Trending from "@/components/Trending";

export default function Home() {
  return (
    <>
      <Header />
      <Navbar />
      <Banner />
      <Features />
      <ShopByCategory />
      <NewArrival />
      <FeaturedProduct />
      <Ads />
      <Trending />
      <Footer />
      <CopyRight />
    </>
  );
}
