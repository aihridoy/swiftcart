import Account from "@/components/Account";
import Ads from "@/components/Ads";
import Banner from "@/components/Banner";
import Checkout from "@/components/Checkout";
import CopyRight from "@/components/CopyRight";
import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";
import NewArrival from "@/components/NewArrival";
import ProductDetails from "@/components/ProductDetails";
import Shop from "@/components/Shop";
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
      <Ads />
      <Trending />
      <Footer />
      <CopyRight />
      {/* <ProductDetails /> */}
      {/* <Account /> */}
      {/* <Checkout /> */}
      <Shop />
    </>
  );
}
