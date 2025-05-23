// import React, { useEffect, useState } from 'react';
// import LeaveHistoryTable from '../../components/LeaveHistoryTable';
// import type { LeaveRequest } from '../../types';

// export default function LeaveRequestHistory() {
//   // State to store the requests
//   const [requests, setRequests] = useState<LeaveRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const employeeId = localStorage.getItem('userId'); // Or get from your auth/user context

//   useEffect(() => {
//     // If no employeeId found, set error and stop
//     if (!employeeId) {
//       setError('No employee ID found.');
//       setLoading(false);
//       return;
//     }

//     // Fetch leave requests for this employee
//     fetch(`http://localhost:3000/leave-requests/employee/${employeeId}`)
//       .then(res => {
//         if (!res.ok) throw new Error('Failed to fetch');
//         return res.json();
//       })
//       .then(data => {
//         setRequests(data);
//         setLoading(false);
//       })
//       .catch(err => {
//         setError(err.message || 'Something went wrong');
//         setLoading(false);
//       });
//   }, [employeeId]);

//   // Show loading or error
//   if (loading) return <div>Loading leave requests…</div>;
//   if (error) return <div className="text-red-500">{error}</div>;

//   // Pass the loaded data to your table
//   return <LeaveHistoryTable data={requests} />;
// }
