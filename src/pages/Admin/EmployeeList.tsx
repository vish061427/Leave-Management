
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import getDaysRequested from '../../helpers/getDaysRequested';
import type { LeaveRequest } from '../../types';

const leaveAllowances = {
  'Annual Leave': 20,
  'Casual/Medical Leave': 10,
  'Lieu Leave': 5,
};

type Employee = {
  id: number;
  displayName: string;
  role: string;
};



type EmployeeSummary = {
  id: number;
  name: string;
  role: string;
  pending: number;
  approvedThisYear: number;
  used: Record<string, number>;
};

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterPending, setFilterPending] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = localStorage.getItem('token');
  
        const [empRes, leaveRes] = await Promise.all([
          fetch('http://localhost:3000/employees', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('http://localhost:3000/leave-requests', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
  
        if (!empRes.ok) throw new Error('Failed to fetch employees');
        if (!leaveRes.ok) throw new Error('Failed to fetch leave requests');
  
        const empData: Employee[] = await empRes.json();
        const leaveData: LeaveRequest[] = await leaveRes.json();
  
        console.log('Employees:', empData);
        console.log('Leave Requests:', leaveData);
  
        setEmployees(empData);
        setLeaveRequests(leaveData);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Unknown error');
        }
      } finally {
        setLoading(false);
      }
    }
  
    fetchData();
  }, []);
  

 

  const employeeSummaries: EmployeeSummary[] = employees.map(emp => {
    const empLeaves = leaveRequests.filter(lr => lr.employeeId === emp.id);
  
    const pending = empLeaves.filter(lr => lr.status === 'Pending').length;
    const approvedThisYear = empLeaves.filter(
      lr => lr.status === 'Approved' && new Date(lr.from).getFullYear() === new Date().getFullYear()
    ).length;
  
    const used: Record<string, number> = {
      'Annual Leave': 0,
      'Casual/Medical Leave': 0,
      'Lieu Leave': 0,
    };
  
    empLeaves.forEach(lr => {
      if (lr.status === 'Approved') {
        used[lr.leaveType] = (used[lr.leaveType] || 0) + getDaysRequested(lr);
      }
    });
  
    return {
      id: emp.id,
      name: emp.displayName,
      role: emp.role,
      pending,
      approvedThisYear,
      used,
    };
  });
  

  const filtered = filterPending
    ? employeeSummaries.filter(e => e.pending > 0)
    : employeeSummaries;

  if (loading) return <div>Loading employees...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Employee Directory</h1>
        <label className="mt-4 sm:mt-0 inline-flex items-center space-x-2 text-sm text-gray-600">
          <input
            type="checkbox"
            checked={filterPending}
            onChange={() => setFilterPending(p => !p)}
            className="form-checkbox h-4 w-4 text-blue-600"
          />
          <span>Show only with pending requests</span>
        </label>
      </div>
  
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(e => (
          <div
            key={e.id}
            className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition duration-200 border border-gray-100"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{e.name}</h2>
                <p className="text-sm text-gray-500">Role: {e.role}</p>
              </div>
              <span className="text-xs bg-gray-100 text-gray-500 rounded px-2 py-1">ID: {e.id}</span>
            </div>
  
            <div className="mt-4 space-y-1 text-sm">
              {Object.entries(leaveAllowances).map(([type, alloc]) => {
                const used = e.used[type];
                const overLimit = used > alloc;
                return (
                  <div key={type} className="flex justify-between">
                    <span>{type.split(' Leave')[0]}</span>
                    <span className={overLimit ? "text-red-600" : "text-green-700"}>
                      {used} / {alloc}
                    </span>
                  </div>
                );
              })}
            </div>
  
            <div className="mt-4 text-sm text-gray-700 space-y-1">
              <div>Pending Requests: <strong>{e.pending}</strong></div>
              <div>Approved This Year: <strong>{e.approvedThisYear}</strong></div>
            </div>
  
            <Link
              to={`/dashboard/employees/${e.id}`}
              className="mt-5 inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
  
  // return (
  //   <div>
  //     <div className="flex justify-between mb-4">
  //       <h1 className="text-3xl font-bold">Employee Directory</h1>
  //       <label className="inline-flex items-center">
  //         <input
  //           type="checkbox"
  //           checked={filterPending}
  //           onChange={() => setFilterPending(p => !p)}
  //           className="form-checkbox"
  //         />
  //         <span className="ml-2">Show only with pending</span>
  //       </label>
  //     </div>

  //     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
  //       {filtered.map(e => (
  //         <div key={e.id} className="bg-white p-4 rounded shadow">
  //           <div className="flex justify-between">
  //             <h2 className="font-semibold">{e.name}</h2>
  //             <span className="text-sm text-gray-500">ID: {e.id}</span>
  //           </div>
  //           <div className="text-sm text-gray-600 mb-2">Role: {e.role}</div>
  //           {Object.entries(leaveAllowances).map(([type, alloc]) => (
  //             <div key={type} className="text-sm">
  //               <strong>{type.split(' Leave')[0]}:</strong> {e.used[type]} / {alloc}
  //             </div>
  //           ))}
  //           <div className="mt-2 text-sm">
  //             <div># Pending: {e.pending}</div>
  //             <div># Approved: {e.approvedThisYear}</div>
  //           </div>
  //           <Link
  //             to={`/dashboard/employees/${e.id}`}
  //             className="mt-4 inline-block px-3 py-1 bg-blue-500 text-white rounded"
  //           >
  //             View Details
  //           </Link>
  //         </div>
  //       ))}
  //     </div>
  //   </div>
  // );
}
