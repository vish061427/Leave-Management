import React, { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Breadcrumbs from '../components/Breadcrumbs';
import { useLeave } from '../context/LeaveContext';
import getDaysRequested from '../utils/getDaysRequested';
import type { LeaveRequest } from '../types';

export default function EmployeeHistory() {
  const { name } = useParams<{ name: string }>();
  const { requests, updateStatus } = useLeave();
  const myReqs = useMemo(
    () => requests.filter(r => r.employeeName === name),
    [requests, name]
  );
  const [tab, setTab] = useState<'Pending'|'History'>('Pending');

  const pending = myReqs.filter(r => r.status==='Pending');
  const history = myReqs.filter(r => r.status!=='Pending');

  const breadcrumbItems = [
    { label:'Home', href:'/' },
    { label:'Admin', href:'/dashboard' },
    { label:'Employees', href:'/dashboard/employees' },
    { label:name! }
  ];

  return (
    <div className="flex h-screen">
      <Sidebar role={'admin'} />
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-3xl font-bold mb-4">{name}</h1>
        <div className="mb-4 border-b">
          {['Pending','History'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t as 'Pending'|'History')}
              className={`px-4 py-2 ${tab===t?'border-b-2 text-blue-600':'text-gray-600'}`}
            >{t}</button>
          ))}
        </div>
        {tab==='Pending' ? (
          <table className="min-w-full bg-white rounded shadow overflow-hidden">
            <thead className="bg-gray-200 text-left">
              <tr>{['Type','Dates','Days','Actions'].map(h=> <th key={h} className="px-4 py-2 border-b">{h}</th>)}</tr>
            </thead>
            <tbody>
              {pending.map((r:LeaveRequest) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{r.leaveType}</td>
                  <td className="px-4 py-2 border-b">{r.from} → {r.to}</td>
                  <td className="px-4 py-2 border-b">{getDaysRequested(r)}</td>
                  <td className="px-4 py-2 border-b space-x-2">
                    <button onClick={()=>updateStatus(r.id,'Approved')} className="px-2 py-1 bg-green-500 text-white rounded">Approve</button>
                    <button onClick={()=>updateStatus(r.id,'Rejected')} className="px-2 py-1 bg-red-500 text-white rounded">Reject</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="min-w-full bg-white rounded shadow overflow-hidden">
            <thead className="bg-gray-200 text-left">
              <tr>{['Type','Dates','Days','Status','Decision On','Reason'].map(h=> <th key={h} className="px-4 py-2 border-b">{h}</th>)}</tr>
            </thead>
            <tbody>
              {history.map((r:LeaveRequest) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{r.leaveType}</td>
                  <td className="px-4 py-2 border-b">{r.from} → {r.to}</td>
                  <td className="px-4 py-2 border-b">{getDaysRequested(r)}</td>
                  <td className="px-4 py-2 border-b">{r.status}</td>
                  <td className="px-4 py-2 border-b">{r.updatedAt?.slice(0,10)}</td>
                  <td className="px-4 py-2 border-b">{r.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
}