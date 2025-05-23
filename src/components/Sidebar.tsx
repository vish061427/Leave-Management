import { useNavigate } from "react-router-dom";
import {
  LogOut,
  List,
  User,
  Calendar,
  FileText,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

export type Role = "admin" | "employee";

interface SidebarProps {
  role: Role;
}

const adminMenu = [
  { label: "Dashboard", to: "/dashboard", icon: List },
  { label: "Leaves", to: "/dashboard/leaves", icon: Calendar },
  { label: "Employees", to: "/dashboard/employees", icon: User },
];

const employeeMenu = [
  { label: "My Profile", to: "/dashboard", icon: User },
  { label: "My Requests", to: "/dashboard/requests", icon: FileText },
];

export default function Sidebar({ role }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const menu = role === "admin" ? adminMenu : employeeMenu;

  const handleLogout = () => {
    localStorage.clear(); // Clear session storage
    navigate("/");        // Redirect to login page
    window.location.reload(); // Optional: full reload if state not resetting properly
  };

  return (
    <aside
      className={`h-screen bg-gray-800 text-gray-100 flex flex-col transition-all duration-300 ${
        collapsed ? "w-16" : "w-64"
      }`}
    >
{/* fixed top-0 left-0 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && (
          <span className="text-xl font-bold">
            {role === "admin" ? "Admin Panel" : "Employee Panel"}
          </span>
        )}
        <button onClick={() => setCollapsed((c) => !c)}>
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </button>
      </div>

      <nav className="flex-1 px-2 mt-4 space-y-2">
        {menu.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            end={to === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 text-gray-100"
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {!collapsed && <span className="ml-4">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700 flex flex-col space-y-2">
        <NavLink
          to="/profile"
          className="flex items-center p-2 rounded-lg hover:bg-gray-700"
        >
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="ml-4">Settings</span>}
        </NavLink>
        <button
          onClick={handleLogout}
          className="flex items-center p-2 rounded-lg hover:bg-red-600 hover:text-white text-red-400"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="ml-4">Logout</span>}
        </button>
      </div>
    </aside>
  );
}
