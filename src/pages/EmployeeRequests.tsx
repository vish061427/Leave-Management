
import React, { useMemo } from 'react'
import Sidebar from '../components/Sidebar'
import Breadcrumbs from '../components/Breadcrumbs'
import { useLeave } from '../context/LeaveContext'
import LeaveRequestForm from '../components/LeaveRequestForm'
import getDaysRequested from '../utils/getDaysRequested'
import type { LeaveRequest } from '../types'

export default function EmployeeRequests() {
  const { requests } = useLeave()

  // 1) Derive a list of unique employees from your dummy data
  const uniqueNames = useMemo(
    () => Array.from(new Set(requests.map(r => r.employeeName))),
    [requests]
  )
  // pick the first one (or you could let the user choose via the login form)
  const employeeName = uniqueNames[0] || '—'

  // 2) Filter their requests
  const myRequests = useMemo(
    () => requests.filter(r => r.employeeName === employeeName),
    [requests, employeeName]
  )

  // 3) Compute leave balances (you’ll probably want these numbers in your types/config)
  const allocation = {
    'Annual Leave': 20,
    'Casual/Medical Leave': 10,
    'Lieu Leave': 5,
  }
  const used = useMemo(() => {
    return myRequests.reduce<Record<string, number>>((acc, r) => {
      if (r.status === 'Approved') {
        acc[r.leaveType] = (acc[r.leaveType] || 0) + getDaysRequested(r)
      }
      return acc
    }, {})
  }, [myRequests])
  const remaining = {
    'Annual Leave': allocation['Annual Leave'] - (used['Annual Leave'] || 0),
    'Casual/Medical Leave':
      allocation['Casual/Medical Leave'] - (used['Casual/Medical Leave'] || 0),
    'Lieu Leave': allocation['Lieu Leave'] - (used['Lieu Leave'] || 0),
  }

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Employee', href: '/dashboard' },
  ]

  return (
    <div className="flex h-screen">
      <Sidebar role={'employee'} />
      <main className="flex-1 p-6 bg-gray-100 overflow-auto">
        <Breadcrumbs items={breadcrumbItems} />
        <h1 className="text-3xl font-bold mb-4">Welcome, {employeeName}</h1>

        {/* --- Employee Info & Balances --- */}
        <section className="bg-white p-4 rounded shadow mb-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            
          {(Object.keys(allocation) as Array<keyof typeof allocation>).map((type) => (
            <div key={type} className="text-center">
              <h3 className="font-medium">{type.split(' Leave')[0]}</h3>
              <p className="text-sm text-gray-600">
                Used: <strong>{used[type] || 0}</strong> / {allocation[type]}
              </p>
              <p className="text-sm text-green-600">
                Remaining:{' '}
                <strong>
                  {remaining[type] >= 0 ? remaining[type] : 0}
                </strong>
              </p>
            </div>
          ))}
        </section>

        {/* --- Leave Request Form --- */}
        <section className="mb-10">
          <LeaveRequestForm employeeName={employeeName} />
        </section>

        {/* --- Leave History Table --- */}
        <section>
          <h2 className="text-2xl font-semibold mb-4">Your Leave History</h2>
          <table className="min-w-full bg-white rounded shadow overflow-hidden">
            <thead className="bg-gray-200 text-left">
              <tr>
                {[
                  'Type',
                  'Dates',
                  'Days',
                  'Status',
                  'Decision On',
                  'Reason',
                ].map((h) => (
                  <th key={h} className="px-4 py-2 border-b">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {myRequests.map((r: LeaveRequest) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{r.leaveType}</td>
                  <td className="px-4 py-2 border-b">
                    {r.from}
                    {r.to && ` → ${r.to}`}
                  </td>
                  <td className="px-4 py-2 border-b">{getDaysRequested(r)}</td>
                  <td className="px-4 py-2 border-b">{r.status}</td>
                  <td className="px-4 py-2 border-b">
                    {r.updatedAt?.slice(0, 10) || ''}
                  </td>
                  <td className="px-4 py-2 border-b">{r.reason}</td>
                </tr>
              ))}
              {myRequests.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-2 border-b text-center text-gray-500"
                  >
                    You have no leave requests yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  )
}
