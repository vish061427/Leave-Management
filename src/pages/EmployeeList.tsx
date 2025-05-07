import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Breadcrumbs from '../components/Breadcrumbs';
import { useLeave } from '../context/LeaveContext';
import type { LeaveRequest } from '../types';
import getDaysRequested from '../utils/getDaysRequested';

const leaveAllowances: Record<string, number> = {
  'Annual Leave': 20,
  'Casual/Medical Leave': 10,
  'Lieu Leave': 5,
};

export default function EmployeeList() {
  const { requests } = useLeave();
  const [filterPending, setFilterPending] = useState(false);

  const employees = useMemo(() => {
    const map: Record<string, any> = {};
    requests.forEach((r: LeaveRequest) => {
      if (!map[r.employeeName]) {
        map[r.employeeName] = {
          name: r.employeeName,
          pending: 0,
          approvedThisYear: 0,
          used: { 'Annual Leave':0, 'Casual/Medical Leave':0, 'Lieu Leave':0 }
        };
      }
      if (r.status === 'Pending') map[r.employeeName].pending++;
      if (r.status === 'Approved' && new Date(r.from).getFullYear() === new Date().getFullYear()) {
        map[r.employeeName].approvedThisYear++;
        map[r.employeeName].used[r.leaveType] += getDaysRequested(r);
      }
    });
    return Object.values(map);
  }, [requests]);

  const filtered = filterPending ? employees.filter((e:any) => e.pending > 0) : employees;

  const breadcrumbItems = [
    { label:'Home', href:'/' },
    { label:'Admin', href:'/dashboard' },
    { label:'Employees' }
  ];

  return (
    <div className="flex h-screen">
      <Sidebar role={'admin'} />
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Breadcrumbs items={breadcrumbItems} />
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Employee Directory</h1>
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={filterPending}
              onChange={() => setFilterPending(p => !p)}
              className="form-checkbox"
            />
            <span className="ml-2">Show only with pending</span>
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((e:any, idx) => (
            <div key={e.name} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between">
                <h2 className="font-semibold">{e.name}</h2>
                <span className="text-sm text-gray-500">ID: {idx+1}</span>
              </div>
              <div className="text-sm text-gray-600 mb-2">Role: Employee</div>
              {Object.entries(leaveAllowances).map(([type,alloc]) => (
                <div key={type} className="text-sm">
                  <strong>{type.split(' Leave')[0]}:</strong> {e.used[type]} / {alloc}
                </div>
              ))}
              <div className="mt-2 text-sm">
                <div># Pending: {e.pending}</div>
                <div># Approved: {e.approvedThisYear}</div>
              </div>
              <Link to={`/dashboard/employees/${encodeURIComponent(e.name)}`} className="mt-4 inline-block px-3 py-1 bg-blue-500 text-white rounded">
                View Details
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}