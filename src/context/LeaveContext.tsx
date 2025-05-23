// // src/context/LeaveContext.tsx
// import { createContext, useContext, useState, type ReactNode } from "react";
// import type { LeaveRequest } from "../types";
// import leaveRequests from "../data/leaveRequests"; // Initial dummy data

// interface LeaveContextType {
//   requests: LeaveRequest[];
//   updateStatus: (id: number, status: "Approved" | "Rejected") => void;
//   addLeaveRequest: (request: LeaveRequest) => void;
// }

// const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

// export function useLeave(): LeaveContextType {
//   const context = useContext(LeaveContext);
//   if (!context) throw new Error("useLeave must be used within a LeaveProvider");
//   return context;
// }

// export function LeaveProvider({ children }: { children: ReactNode }) {
//   const [requests, setRequests] = useState<LeaveRequest[]>(leaveRequests);

//   function updateStatus(id: number, status: "Approved" | "Rejected") {
//     setRequests(prev =>
//       prev.map(r =>
//         r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r
//       )
//     );
//   }

//   function addLeaveRequest(newRequest: LeaveRequest) {
//     setRequests(prev => [...prev, newRequest]);
//   }

//   return (
//     <LeaveContext.Provider value={{ requests, updateStatus, addLeaveRequest }}>
//       {children}
//     </LeaveContext.Provider>
//   );
// }
