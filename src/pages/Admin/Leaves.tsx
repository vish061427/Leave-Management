

// import { useState, useEffect, useMemo } from 'react';
// import LeaveHistoryTable from '../../components/LeaveHistoryTable';
// import type { LeaveRequest } from '../../types';

// export default function LeaveRequests() {
//   const [requests, setRequests] = useState<LeaveRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState('');
//   const [page, setPage] = useState(1);
//   const perPage = 10;

//   // Fetch pending leave requests from backend
//   useEffect(() => {
//     setLoading(true);
//     fetch('http://localhost:3000/leave-requests/pending') // Adjust API as needed
//       .then(res => {
//         if (!res.ok) throw new Error('Failed to fetch');
//         return res.json();
//       })
//       .then(data => {
//         setRequests(data);
//         setLoading(false);
//       })
//       .catch(err => {
//         setError(err.message || 'Unknown error');
//         setLoading(false);
//       });
//   }, []);

//   // Sort, paginate, etc. (same as before)
//   const sorted = useMemo(
//     () =>
//       [...requests].sort(
//         (a, b) => new Date(b.from).getTime() - new Date(a.from).getTime()
//       ),
//     [requests]
//   );

//   const totalPages = Math.ceil(sorted.length / perPage);

//   const paginated = useMemo(
//     () => sorted.slice((page - 1) * perPage, page * perPage),
//     [sorted, page]
//   );

//   // Approve/Reject handler (calls backend and refreshes data)
//   const handleAction = async (id: number, action: "Approved" | "Rejected") => {
//     const res = await fetch(`http://localhost:3000/leave-requests/${id}/status`, {
//       method: 'PATCH',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ status: action }),
//     });
//     if (res.ok) {
//       // Refresh data
//       setRequests(reqs => reqs.filter(r => r.id !== id)); // Optimistic update: remove from current page
//       // Optionally: Refetch the page for full consistency
//     } else {
//       alert('Failed to update status');
//     }
//   };

//   if (loading) return <div>Loading…</div>;
//   if (error) return <div className="text-red-500">{error}</div>;

//   return (
//     <div>
//       <h1 className="text-3xl font-bold mb-4">Pending Leave Requests</h1>

//       <LeaveHistoryTable
//         data={paginated}
//         showActions
//         onAction={handleAction}
//       />

//       {/* Pagination Controls */}
//       <div className="flex justify-between mt-4">
//         <button
//           onClick={() => setPage(p => Math.max(1, p - 1))}
//           disabled={page === 1}
//           className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//         >
//           Previous
//         </button>
//         <span>
//           Page {page} of {totalPages}
//         </span>
//         <button
//           onClick={() => setPage(p => Math.min(totalPages, p + 1))}
//           disabled={page === totalPages}
//           className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// }

import { useState, useEffect, useMemo } from 'react';
import LeaveHistoryTable from '../../components/LeaveHistoryTable';
import type { LeaveRequest } from '../../types';

export default function LeaveRequests() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'Pending' | 'History'>('Pending');
  const [page, setPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/leave-requests', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setRequests(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || 'Unknown error');
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return tab === 'Pending'
      ? requests.filter(r => r.status === 'Pending')
      : requests.filter(r => r.status !== 'Pending');
  }, [requests, tab]);

  const sorted = useMemo(() => {
    return [...filtered].sort(
      (a, b) => new Date(b.from).getTime() - new Date(a.from).getTime()
    );
  }, [filtered]);

  const totalPages = Math.ceil(sorted.length / perPage);
  const paginated = useMemo(() => sorted.slice((page - 1) * perPage, page * perPage), [sorted, page]);

  const handleAction = async (id: number, action: "Approved" | "Rejected") => {
    const res = await fetch(`http://localhost:3000/leave-requests/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: action }),
    });

    if (res.ok) {
      setRequests(prev => prev.map(r => r.id === id ? { ...r, status: action, updatedAt: new Date().toISOString() } : r));
    } else {
      alert('Failed to update status');
    }
  };

  if (loading) return <div>Loading…</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Leave Requests</h1>

      {/* Tabs */}
      <div className="mb-4 border-b">
        {['Pending', 'History'].map(t => (
          <button
            key={t}
            onClick={() => {
              setTab(t as 'Pending' | 'History');
              setPage(1); // reset pagination when switching tabs
            }}
            className={`px-4 py-2 ${
              tab === t ? 'border-b-2 text-blue-600' : 'text-gray-600'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Table */}
      <LeaveHistoryTable
        data={paginated}
        showActions={tab === 'Pending'}
        onAction={handleAction}
      />

      {/* Pagination */}
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
