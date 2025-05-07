import React, { useState, useMemo } from 'react';
import Sidebar from '../components/Sidebar';
import Breadcrumbs from '../components/Breadcrumbs';
import { useLeave } from '../context/LeaveContext';
import getDaysRequested from '../utils/getDaysRequested';
import type { LeaveRequest } from '../types';

export default function Leaves() {
  const { requests, updateStatus } = useLeave();
  const [page, setPage] = useState(1);
  const perPage = 10;

  const pending = useMemo(
    () => requests.filter(r => r.status === 'Pending'),
    [requests]
  );
  const sorted = useMemo(
    () => [...pending].sort((a, b) => new Date(b.from).getTime() - new Date(a.from).getTime()),
    [pending]
  );
  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = useMemo(
    () => sorted.slice((page - 1) * perPage, page * perPage),
    [sorted, page]
  );

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Admin', href: '/dashboard' },
    { label: 'Leaves' },
  ];

  return (
    <div className="flex h-screen">
      <Sidebar role={'admin'} />
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-3xl font-bold mb-4">Pending Leave Requests</h1>
        <table className="min-w-full bg-white rounded shadow overflow-hidden">
          <thead className="bg-gray-200 text-left">
            <tr>
              {['Employee','Type','Dates','Days','Actions'].map(h => (
                <th key={h} className="px-4 py-2 border-b">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginated.map((r: LeaveRequest) => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border-b">{r.employeeName}</td>
                <td className="px-4 py-2 border-b">{r.leaveType}</td>
                <td className="px-4 py-2 border-b">{r.from}{r.to && ` → ${r.to}`}</td>
                <td className="px-4 py-2 border-b">{getDaysRequested(r)}</td>
                <td className="px-4 py-2 border-b space-x-2">
                  <button
                    onClick={() => updateStatus(r.id, 'Approved')}
                    className="px-3 py-1 bg-green-500 text-white rounded"
                  >Approve</button>
                  <button
                    onClick={() => updateStatus(r.id, 'Rejected')}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >Reject</button>
                </td>
              </tr>
            ))}
            {paginated.length === 0 && (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No pending requests.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-between mt-4">
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >Previous</button>
          <span>Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >Next</button>
        </div>
      </main>
    </div>
  );
}