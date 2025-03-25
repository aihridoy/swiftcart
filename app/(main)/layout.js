import "react-toastify/dist/ReactToastify.css";
import Navbar from "@/components/Navbar";
import Header from "@/components/Header";
import ClientLayout from "../ClientLayout";
import Footer from "@/components/Footer";
import CopyRight from "@/components/CopyRight";

export default function MainLayout({ children }) {
  return (
    <ClientLayout>
      <Header />
      <Navbar />
      {children}
      <Footer />
      <CopyRight />
    </ClientLayout>
  );
}