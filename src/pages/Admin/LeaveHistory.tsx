// import { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import getDaysRequested from '../../helpers/getDaysRequested';
// import type { LeaveRequest } from '../../types';

// export default function LeaveHistory() {
//   const { id } = useParams<{ id: string }>();
//   const [requests, setRequests] = useState<LeaveRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [tab, setTab] = useState<'Pending' | 'History'>('Pending');
//   console.log('Fetching leave requests for employee id:', id);

//   useEffect(() => {
//     async function fetchLeaveRequests() {
//       try {
//         if (!id) return;
//         const token = localStorage.getItem('token');
//         const res = await fetch(`http://localhost:3000/leave-requests/employee/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (!res.ok) throw new Error('Failed to fetch leave requests');
//         const data = await res.json();
//         setRequests(data);
//       } catch (err: any) {
//         setError(err.message || 'Unknown error');
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchLeaveRequests();
//   }, [id]);

//   if (loading) return <div>Loading leave history...</div>;
//   if (error) return <div className="text-red-600">Error: {error}</div>;

//   const pending = requests.filter(r => r.status === 'Pending');
//   const history = requests.filter(r => r.status !== 'Pending');

//   return (
    
//     <div>
//       <h1 className="text-3xl font-bold mb-4">
//         {requests[0]?.employee?.displayName || `Employee ID: ${id}`}
//        </h1>


//       <div className="mb-4 border-b">
//         {['Pending', 'History'].map(t => (
//           <button
//             key={t}
//             onClick={() => setTab(t as 'Pending' | 'History')}
//             className={`px-4 py-2 ${
//               tab === t ? 'border-b-2 text-blue-600' : 'text-gray-600'
//             }`}
//           >
//             {t}
//           </button>
//         ))}
//       </div>

//       {tab === 'Pending' ? (
//         <table className="min-w-full bg-white rounded shadow overflow-hidden">
//           <thead className="bg-gray-200 text-left">
//             <tr>
//               {['Type', 'Dates', 'Days', 'Actions'].map(h => (
//                 <th key={h} className="px-4 py-2 border-b">
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {pending.map((r: LeaveRequest) => (
//               <tr key={r.id} className="hover:bg-gray-50">
//                 <td className="px-4 py-2 border-b">{r.leaveType}</td>
//                 <td className="px-4 py-2 border-b">{r.from} → {r.to}</td>
//                 <td className="px-4 py-2 border-b">{getDaysRequested(r)}</td>
//                 <td className="px-4 py-2 border-b space-x-2">
//                   <button
//                     onClick={() => {/* updateStatus to Approved */}}
//                     className="px-2 py-1 bg-green-500 text-white rounded"
//                   >
//                     Approve
//                   </button>
//                   <button
//                     onClick={() => {/* updateStatus to Rejected */}}
//                     className="px-2 py-1 bg-red-500 text-white rounded"
//                   >
//                     Reject
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <table className="min-w-full bg-white rounded shadow overflow-hidden">
//           <thead className="bg-gray-200 text-left">
//             <tr>
//               {['Type', 'Dates', 'Days', 'Status', 'Decision On', 'Reason'].map(h => (
//                 <th key={h} className="px-4 py-2 border-b">
//                   {h}
//                 </th>
//               ))}
//             </tr>
//           </thead>
//           <tbody>
//             {history.map((r: LeaveRequest) => (
//               <tr key={r.id} className="hover:bg-gray-50">
//                 <td className="px-4 py-2 border-b">{r.leaveType}</td>
//                 <td className="px-4 py-2 border-b">{r.from} → {r.to}</td>
//                 <td className="px-4 py-2 border-b">{getDaysRequested(r)}</td>
//                 <td className="px-4 py-2 border-b">{r.status}</td>
//                 <td className="px-4 py-2 border-b">{r.updatedAt?.slice(0, 10)}</td>
//                 <td className="px-4 py-2 border-b">{r.reason}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import getDaysRequested from '../../helpers/getDaysRequested';
import LeaveHistoryTable from '../../components/LeaveHistoryTable';
import type { LeaveRequest } from '../../types';

export default function LeaveHistory() {
  const { id } = useParams<{ id: string }>();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'Pending' | 'History'>('Pending');

  useEffect(() => {
    async function fetchLeaveRequests() {
      try {
        if (!id) return;
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:3000/leave-requests/employee/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch leave requests');
        const data = await res.json();
        setRequests(data);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }
    fetchLeaveRequests();
  }, [id]);

  if (loading) return <div>Loading leave history...</div>;
  if (error) return <div className="text-red-600">Error: {error}</div>;

  const pending = requests.filter(r => r.status === 'Pending');
  const history = requests.filter(r => r.status !== 'Pending');

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">
        {requests[0]?.employee?.displayName || `Employee ID: ${id}`}
      </h1>

      <div className="mb-4 border-b">
        {['Pending', 'History'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t as 'Pending' | 'History')}
            className={`px-4 py-2 ${
              tab === t ? 'border-b-2 text-blue-600' : 'text-gray-600'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <LeaveHistoryTable
        data={tab === 'Pending' ? pending : history}
        showActions={tab === 'Pending'}
        onAction={(id, action) => {
          console.log(`Updating request ${id} to ${action}`);
          // Optional: Add mutation logic to update backend here
        }}
      />
    </div>
  );
}
