import React from 'react';
import Sidebar from '../components/Sidebar';
import Breadcrumbs from '../components/Breadcrumbs';

export default function EmployeeDashboard() {
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Employee', href: '/dashboard' },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar role={'employee'} />
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-3xl font-bold mt-4">Employee Dashboard</h1>
        <p className="text-gray-600 mt-2">Select an option from the sidebar.</p>
      </main>
    </div>
  );
}