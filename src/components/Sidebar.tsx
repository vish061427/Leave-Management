// src/components/Sidebar.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { List, User, Settings, ChevronLeft, ChevronRight, Calendar, FileText } from 'lucide-react';

export type Role = 'admin' | 'employee';

interface SidebarProps {
  role: Role;
}

interface MenuItem {
  label: string;
  to: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const adminMenu: MenuItem[] = [
  { label: 'Dashboard', to: '/dashboard',                icon: List       },
  { label: 'Leaves',    to: '/dashboard/leaves',       icon: Calendar   },
  { label: 'Employees', to: '/dashboard/employees',    icon: User       },
];

const employeeMenu: MenuItem[] = [
  { label: 'My Profile',    to: '/dashboard',             icon: User       },
  { label: 'My Requests',   to: '/dashboard/requests',    icon: FileText   },
];

export default function Sidebar({ role }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const menu = role === 'admin' ? adminMenu : employeeMenu;

  return (
    <aside className={`h-screen bg-gray-800 text-gray-100 flex flex-col transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {!collapsed && <span className="text-xl font-bold">{role === 'admin' ? 'Admin Panel' : 'Employee Panel'}</span>}
        <button onClick={() => setCollapsed(c => !c)} className="hover:text-gray-400">
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* <nav className="flex-1 px-2 mt-4 space-y-2">
        {menu.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={label}
            to={to}
            className={({ isActive }) =>
              `flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
                isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-100'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {!collapsed && <span className="ml-4 font-medium">{label}</span>}
          </NavLink>
        ))}
      </nav> */}
      <nav className="flex-1 px-2 mt-4 space-y-2">
        {menu.map(({ label, to, icon: Icon }) => (
          <NavLink to={to} end={to === '/dashboard'}
            className={({ isActive }) =>
              `flex items-center w-full p-3 rounded-lg transition-colors duration-200 ${
                isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700 text-gray-100'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {!collapsed && <span className="ml-4 font-medium">{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-700 flex flex-col space-y-2">
        <NavLink to="/profile" className="flex items-center p-2 rounded-lg hover:bg-gray-700 transition-colors">
          <Settings className="w-5 h-5" />
          {!collapsed && <span className="ml-4">Settings</span>}
        </NavLink>
      </div>
    </aside>
  );
}
