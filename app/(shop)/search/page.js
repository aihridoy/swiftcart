import SearchPage from "./SearchPage";
import { Suspense } from "react";

export const metadata = {
  title: "Search",
  description: "Search products at SwiftCart.",
};

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SearchPage />
    </Suspense>
  );
}
