import React, { createContext, type ReactNode, useState, useContext } from 'react';
import type { LeaveRequest, LeaveStatus } from '../types';
import initialData from '../data/leaveRequests';

interface LeaveContextType {
  requests: LeaveRequest[];
  updateStatus: (id: number, status: LeaveStatus) => void;
  createRequest: (req: Omit<LeaveRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => void;
}

const LeaveContext = createContext<LeaveContextType | undefined>(undefined);
export const useLeave = (): LeaveContextType => {
  const ctx = useContext(LeaveContext);
  if (!ctx) throw new Error('useLeave must be used within LeaveProvider');
  return ctx;
};

export function LeaveProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<LeaveRequest[]>(initialData);

  const updateStatus = (id: number, status: LeaveStatus) => {
    setRequests(prev =>
      prev.map(r => (r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r))
    );
  };

  const createRequest = (
    req: Omit<LeaveRequest, 'id' | 'status' | 'createdAt' | 'updatedAt'>
  ) => {
    const newReq: LeaveRequest = {
      ...req,
      id: requests.length + 1,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    };
    setRequests(prev => [...prev, newReq]);
  };

  return (
    <LeaveContext.Provider value={{ requests, updateStatus, createRequest }}>
      {children}
    </LeaveContext.Provider>
  );
}
