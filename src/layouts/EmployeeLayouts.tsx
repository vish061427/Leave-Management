import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Breadcrumbs from "../components/Breadcrumbs";

export default function EmployeeLayout() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar role="employee" />

      <main className="flex-1 p-6">
        <Breadcrumbs  />
        <Outlet />
      </main>
    </div>
  );
}
