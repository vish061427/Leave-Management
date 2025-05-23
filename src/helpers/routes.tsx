import { Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayouts";
import EmployeeLayout from "../layouts/EmployeeLayouts";

import Dashboard from "../pages/Admin/Dashboard";
import LeaveRequests from "../pages/Admin/Leaves";
import EmployeeList from "../pages/Admin/EmployeeList";
import EmployeeHistory from "../pages/Admin/LeaveHistory";

import EmpDashboard from "../pages/Employee/Dashboard";
import EmployeeRequests from "../pages/Employee/EmployeeRequests";

import type { User } from "../types";

export function getRoutes(user: User | null) {
  if (!user) {
    return [
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ];
  }

  if (user.role === "admin") {
    return [
      {
        path: "/",
        element: <AdminLayout />,
        children: [
          { path: "dashboard", element: <Dashboard /> },
          { path: "dashboard/leaves", element: <LeaveRequests /> },
          { path: "dashboard/employees", element: <EmployeeList /> },
          { path: "dashboard/employees/:id", element: <EmployeeHistory /> },
        ],
      },
    ];
  }

  if (user.role === "employee") {
    return [
      {
        path: "/",
        element: <EmployeeLayout />,
        children: [
          { path: "dashboard", element: <EmpDashboard /> },
          { path: "dashboard/requests", element: <EmployeeRequests /> },
        ],
      },
    ];
  }

  return [
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ];
}
