

import type { LeaveRequest } from "../types";
import getDaysRequested from "../helpers/getDaysRequested";

interface LeaveHistoryTableProps {
  data: LeaveRequest[];
  showActions?: boolean; // If true, show Approve/Reject buttons
  onAction?: (id: number, action: "Approved" | "Rejected") => void;
}

function formatDuration(request: LeaveRequest): string {
  if (request.dayLength === "firstHalf") return "First Half";
  if (request.dayLength === "secondHalf") return "Second Half";
  return "Full Day";
}

export default function LeaveHistoryTable({
  data,
  showActions = false,
  onAction,
}: LeaveHistoryTableProps) {
  // Decide columns based on showActions

  const headers = [
  "Employee",
  "Type",
  "Dates",
  "Days",
  "Duration",
  "Status",
  ...(showActions ? [] : ["Decision On"]), // <- conditional header
  "Reason",
  ...(showActions ? ["Actions"] : []),
];


  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-gray-200 text-left text-sm">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-2 border-b">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 text-sm">
                <td className="px-4 py-2 border-b">{r.employee?.displayName || "—"}</td>
                <td className="px-4 py-2 border-b">{r.leaveType}</td>
                <td className="px-4 py-2 border-b">
                   {new Date(r.from).toLocaleDateString('en-CA')}
                         {r.to && ` → ${new Date(r.to).toLocaleDateString('en-CA')}`}
                    </td>

                <td className="px-4 py-2 border-b">{getDaysRequested(r)}</td>
                <td className="px-4 py-2 border-b">{formatDuration(r)}</td>
                <td className="px-4 py-2 border-b">
                  <span
                    className={`inline-block px-2 py-1 text-xs rounded-full font-semibold
                      ${
                        r.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : r.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                  >
                    {r.status}
                  </span>
                </td>
        
                  {!showActions && (
    <td className="px-4 py-2 border-b">
      {r.updatedAt ? new Date(r.updatedAt).toLocaleDateString("en-CA") : "—"}
    </td>
  )}

                <td className="px-4 py-2 border-b">{r.reason}</td>
                {showActions && onAction && (
                  <td className="px-4 py-2 border-b space-x-2">
                    <button
                      onClick={() => onAction(r.id, "Approved")}
                      className="px-3 py-1 bg-green-500 text-white rounded"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onAction(r.id, "Rejected")}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Reject
                    </button>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={headers.length} className="px-4 py-2 border-b text-center text-gray-500">
                No leave requests found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
