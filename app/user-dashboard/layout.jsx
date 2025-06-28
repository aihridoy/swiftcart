import MyDashboardSidebar from "@/components/MyDashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <MyDashboardSidebar />
      <main className="flex-1 overflow-y-auto bg-gray-100">
        {children}
      </main>
    </div>
  );
}