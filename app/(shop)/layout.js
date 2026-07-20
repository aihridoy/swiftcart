import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import ClientLayout from "../ClientLayout";
import Footer from "@/components/Footer";
import CopyRight from "@/components/CopyRight";

export default function ShopLayout({ children }) {
  return (
    <ClientLayout>
      <div className="flex min-h-screen flex-col">
        <Header />
        <Navbar />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
        <CopyRight />
      </div>
    </ClientLayout>
  );
}