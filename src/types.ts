export type LeaveType = 'Annual Leave' | 'Casual/Medical Leave' | 'Lieu Leave';
export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';
export type DateMode = 'single' | 'range';
export type DayLength = 'full' | 'firstHalf' | 'secondHalf';

export interface LeaveRequest {
  employeeId: number;
  id: number;
  employee: {
    displayName: string;
  };
  employeeName: string;
  leaveType: LeaveType;
  reason: string;
  dateMode: DateMode;
  from: string;
  to?: string;
  duration?: number;
  dayLength?: DayLength;
  status: LeaveStatus;
  createdAt?: string;
  updatedAt?: string;
  selectedHalf?: 'first' | 'second';
}



export interface User {
  id:number;
  username: string;
  password: string;
  displayName: string;
  role: "admin" | "employee";
}
