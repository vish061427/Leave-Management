import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import Leaves from './pages/Leaves';
import EmployeeList from './pages/EmployeeList';
import EmployeeHistory from './pages/EmployeeHistory';
import EmployeeDashboard from './pages/EmployeeDashboard';
import EmployeeRequests from './pages/EmployeeRequests';
import { LeaveProvider } from './context/LeaveContext';

export default function App() {
  const [role, setRole] = useState<'admin' | 'employee' | null>(null);

  return (
    <LeaveProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login setRole={setRole} />} />
          {role === 'admin' && (
            <>
              <Route path="/dashboard" element={<AdminDashboard />} />
              <Route path="/dashboard/leaves" element={<Leaves />} />
              <Route path="/dashboard/employees" element={<EmployeeList />} />
              <Route path="/dashboard/employees/:name" element={<EmployeeHistory />} />
            </>
          )}
          {role === 'employee' && (
            <>
            <Route path="/dashboard" element={<EmployeeDashboard />} />
            <Route path="/dashboard/requests" element={<EmployeeRequests />} />
            </>
          )}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </LeaveProvider>
  );
}
