import type { LeaveRequest } from "../types";

// Returns number of days between from and to (inclusive)
// If 'to' is missing, it's a single-day leave
export default function getDaysRequested(leave: LeaveRequest): number {
  const fromDate = new Date(leave.from);
  const toDate = leave.to ? new Date(leave.to) : fromDate;

  const diffInTime = toDate.getTime() - fromDate.getTime();
  const diffInDays = diffInTime / (1000 * 3600 * 24);

  let days = Math.round(diffInDays) + 1;

  if (leave.dayLength && days === 1) {
    if (leave.dayLength === 'firstHalf' || leave.dayLength === 'secondHalf') {
      days = 0.5;
    }
  }

  return days;
}
