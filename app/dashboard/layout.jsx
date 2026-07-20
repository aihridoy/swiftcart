import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen">
      <DashboardSidebar title="Admin" variant="admin" />
      <main className="flex-1 overflow-y-auto bg-gray-50 pb-16 md:pb-0">
        {children}
      </main>
    </div>
  );
}
