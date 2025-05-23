import React from 'react';

export default function Dashboard() {
  const userName = localStorage.getItem('userName') || 'Admin';

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome, {userName}</h1>
      <p className="text-gray-600 mt-2">Select an option from the sidebar.</p>
      {/* You can insert summary metrics or overview here */}
    </div>
  );
}
