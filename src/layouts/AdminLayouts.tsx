import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Breadcrumbs from "../components/Breadcrumbs";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role="admin" />

      <main className="flex-1 p-6 overflow-auto">
        <Breadcrumbs />
        <Outlet />
      </main>
    </div>
  );
}
