// src/data/leaveRequests.ts
import type { LeaveRequest } from '../types';

const leaveRequests: LeaveRequest[] = [
  {
    id: 1,
    employeeName: 'Alice Johnson',
    leaveType: 'Annual Leave',
    reason: 'Family vacation',
    dateMode: 'range',
    from: '2025-06-01',
    to: '2025-06-05',
    duration: 5,
    status: 'Pending',
    createdAt: '2025-05-01T08:00:00Z'
  },
  {
    id: 2,
    employeeName: 'Bob Smith',
    leaveType: 'Casual/Medical Leave',
    reason: 'Doctor appointment',
    dateMode: 'single',
    from: '2025-06-10',
    duration: 0.5,
    dayLength: 'half',
    shift: 'morning',
    status: 'Approved',
    createdAt: '2025-05-02T09:30:00Z',
    updatedAt: '2025-05-02T12:00:00Z'
  },
  // ...add at least 25 varied records below...
  {
    id: 3,
    employeeName: 'Carol White',
    leaveType: 'Lieu Leave',
    reason: 'Compensatory off',
    dateMode: 'single',
    from: '2025-06-15',
    duration: 1,
    status: 'Rejected',
    createdAt: '2025-05-03T10:00:00Z',
    updatedAt: '2025-05-04T14:00:00Z'
  },
  {
    id: 4,
    employeeName: 'David Lee',
    leaveType: 'Annual Leave',
    reason: 'Personal travel',
    dateMode: 'range',
    from: '2025-07-01',
    to: '2025-07-07',
    duration: 7,
    status: 'Pending',
    createdAt: '2025-05-05T11:15:00Z'
  },
  // ...continue filling up to 25 entries...
];

export default leaveRequests;
