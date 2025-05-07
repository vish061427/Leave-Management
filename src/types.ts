export type LeaveType = 'Annual Leave' | 'Casual/Medical Leave' | 'Lieu Leave';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';
export type DateMode = 'single' | 'range';
export type DayLength = 'full' | 'half';
export type Shift = 'morning' | 'evening';

export interface LeaveRequest {
  id: number;
  employeeName: string;
  leaveType: LeaveType;
  reason: string;
  dateMode: DateMode;
  from: string;
  to?: string;
  duration?: number;
  dayLength?: DayLength;
  shift?: Shift;
  status: LeaveStatus;
  createdAt?: string;
  updatedAt?: string;
}
