import { Poppins, Roboto } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ClientLayout from "./ClientLayout";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});
const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000"
  ),
  title: {
    default: "SwiftCart",
    template: "%s | SwiftCart",
  },
  description:
    "Shop the latest home decor, furniture, and lifestyle products at SwiftCart.",
  openGraph: {
    siteName: "SwiftCart",
    type: "website",
    title: "SwiftCart",
    description:
      "Shop the latest home decor, furniture, and lifestyle products at SwiftCart.",
  },
  twitter: {
    card: "summary_large_image",
    title: "SwiftCart",
    description:
      "Shop the latest home decor, furniture, and lifestyle products at SwiftCart.",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${roboto.variable} antialiased`}
      >
        <ReactQueryProvider>
          <ClientLayout>{children}</ClientLayout>
          <ToastContainer
            position="top-right"
            autoClose={3000}
            closeOnClick
            pauseOnHover={false}
            draggable
            theme="light"
            newestOnTop={false}
            limit={3}
            closeButton={false}
          />
        </ReactQueryProvider>
      </body>
    </html>
  );
}
