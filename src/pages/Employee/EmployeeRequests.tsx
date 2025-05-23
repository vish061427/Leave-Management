import React, { useEffect, useState, useMemo } from "react";
import LeaveHistoryTable from "../../components/LeaveHistoryTable";
import LeaveRequestForm from "../../components/LeaveRequestForm";
import LeaveSummary from "../../components/LeaveSummary";
import getDaysRequested from "../../helpers/getDaysRequested";
import type { LeaveRequest } from "../../types";

export default function LeaveRequests() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const employeeId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName") || "Employee";

  useEffect(() => {
    if (!employeeId) {
      setError("No employee ID found. Please log in.");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3000/leave-requests/employee/${employeeId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch leave requests");
        return res.json();
      })
      .then((data) => {
        setRequests(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Unknown error");
        setLoading(false);
      });
  }, [employeeId]);

  const allocation = {
    "Annual Leave": 20,
    "Casual/Medical Leave": 10,
    "Lieu Leave": 5,
  };

  const used = useMemo(() => {
    return requests.reduce<Record<string, number>>((acc, r) => {
      if (r.status === "Approved") {
        acc[r.leaveType] = (acc[r.leaveType] || 0) + getDaysRequested(r);
      }
      return acc;
    }, {});
  }, [requests]);

  if (loading) return <div>Loading…</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Welcome, {userName}</h1>
      <LeaveSummary allocation={allocation} used={used} />
      <section className="mb-10">
        {/* Pass only employeeName; employeeId read inside form from localStorage */}
        <LeaveRequestForm employeeName={userName} />
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Your Leave History</h2>
        <LeaveHistoryTable data={requests} />
      </section>
    </div>
  );
}
