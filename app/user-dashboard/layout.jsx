import DashboardSidebar from "@/components/DashboardSidebar";

export default function UserDashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <DashboardSidebar title="My Account" variant="user" />
      <main className="flex-1 overflow-y-auto bg-gray-50 pb-16 md:pb-0">
        {children}
      </main>
    </div>
  );
}
