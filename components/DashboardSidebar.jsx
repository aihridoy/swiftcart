import Link from "next/link";
import SignOut from "./SignOut";

export default function DashboardSidebar() {
  return (
    <aside className="w-64 bg-white shadow-md h-full">
      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-800">SwiftCart Admin</h1>
      </div>
      <nav className="mt-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/dashboard/add-product"
              className="block p-4 hover:bg-gray-200"
            >
              Add Product
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/products-list"
              className="block p-4 hover:bg-gray-200"
            >
              Products List
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/users"
              className="block p-4 hover:bg-gray-200"
            >
              Users List
            </Link>
          </li>
          <li>
            <Link
              href="/dashboard/orders"
              className="block p-4 hover:bg-gray-200"
            >
              Orders List
            </Link>
          </li>
          <li>
            <Link
              href="/"
              className="block p-4 hover:bg-gray-200"
            >
              Back Home
            </Link>
          </li>
          <li>
          <Link 
              href="/api/auth/signout" 
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 text-sm font-medium transition-colors duration-200"
            >
              Sign Out
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
