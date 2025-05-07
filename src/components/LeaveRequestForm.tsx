// src/components/LeaveRequestForm.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLeave } from '../context/LeaveContext';
import type { LeaveType, DateMode, DayLength, Shift, LeaveRequest } from '../types';
import getDaysRequested from '../utils/getDaysRequested';

interface LeaveRequestFormProps {
  employeeName: string;
}

export default function LeaveRequestForm({ employeeName }: LeaveRequestFormProps) {
  const { createRequest } = useLeave();
  const navigate = useNavigate();

  // Form fields
  const [leaveType, setLeaveType] = useState<LeaveType>('Annual Leave');
  const [reason, setReason] = useState<string>('');
  const [dateMode, setDateMode] = useState<DateMode>('single');
  const [singleDate, setSingleDate] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [dayLength, setDayLength] = useState<DayLength>('full');
  const [shift, setShift] = useState<Shift>('morning');

  // Validation errors
  const [errors, setErrors] = useState<Record<string,string>>({});

  // Validate inputs
  useEffect(() => {
    const errs: Record<string,string> = {};
    const today = new Date().toISOString().slice(0,10);

    if (!reason.trim()) errs.reason = 'Reason is required.';

    if (dateMode === 'single') {
      if (!singleDate) errs.date = 'Please select a date.';
      else if (singleDate < today) errs.date = 'Date must be today or later.';
      if (singleDate && dayLength === 'half' && !shift) errs.shift = 'Please select morning or evening.';
    } else {
      if (!fromDate || !toDate) errs.range = 'Please select both start and end dates.';
      else if (fromDate < today) errs.range = 'Start date must be today or later.';
      else if (toDate < fromDate) errs.range = 'End date must be after start date.';
    }

    setErrors(errs);
  }, [reason, dateMode, singleDate, fromDate, toDate, dayLength, shift]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return;

    const base: Omit<LeaveRequest, 'id'|'status'|'createdAt'|'updatedAt'> = {
      employeeName,
      leaveType,
      reason,
      dateMode,
      from: dateMode === 'single' ? singleDate : fromDate,
      to:   dateMode === 'single' ? singleDate : toDate,
      duration: dateMode === 'single'
        ? (dayLength === 'half' ? 0.5 : 1)
        : getDaysRequested({ from: fromDate, to: toDate } as LeaveRequest),
      dayLength: dateMode === 'single' ? dayLength : undefined,
      shift: dateMode === 'single' && dayLength === 'half' ? shift : undefined,
    };

    createRequest(base);
    navigate(`/dashboard/employees/${encodeURIComponent(employeeName)}`);
  };

  const isSingle = dateMode === 'single';

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full bg-white p-6 rounded-lg shadow-md space-y-8"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Type, Reason, Mode */}
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-1">Leave Type</label>
            <select
              value={leaveType}
              onChange={e => setLeaveType(e.target.value as LeaveType)}
              className="w-full border-2 border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option>Annual Leave</option>
              <option>Casual/Medical Leave</option>
              <option>Lieu Leave</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Reason</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              className="w-full border-2 border-gray-300 rounded-md px-3 py-2 h-32 outline-none focus:ring-2 focus:ring-blue-300"
            />
            {errors.reason && <p className="mt-1 text-red-600 text-sm">{errors.reason}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Date Mode</label>
            <div className="flex items-center gap-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="single"
                  checked={dateMode === 'single'}
                  onChange={() => setDateMode('single')}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Single Date</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  value="range"
                  checked={dateMode === 'range'}
                  onChange={() => setDateMode('range')}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2">Date Range</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Date Inputs & Submit */}
        <div className="space-y-6">
          {isSingle ? (
            <> 
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  value={singleDate}
                  onChange={e => setSingleDate(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
                />
                {errors.date && <p className="mt-1 text-red-600 text-sm">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Day Length</label>
                <div className="flex items-center gap-6">
                  {(['full','half'] as DayLength[]).map(dl => (
                    <label key={dl} className="inline-flex items-center">
                      <input
                        type="radio"
                        value={dl}
                        checked={dayLength === dl}
                        onChange={() => setDayLength(dl)}
                        className="form-radio h-4 w-4 text-blue-600"
                      />
                      <span className="ml-2 capitalize">{dl} Day</span>
                    </label>
                  ))}
                </div>
              </div>

              {dayLength === 'half' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Shift</label>
                  <div className="flex items-center gap-6">
                    {(['morning','evening'] as Shift[]).map(s => (
                      <label key={s} className="inline-flex items-center">
                        <input
                          type="radio"
                          value={s}
                          checked={shift === s}
                          onChange={() => setShift(s)}
                          className="form-radio h-4 w-4 text-blue-600"
                        />
                        <span className="ml-2 capitalize">{s}</span>
                      </label>
                    ))}
                  </div>
                  {errors.shift && <p className="mt-1 text-red-600 text-sm">{errors.shift}</p>}
                </div>
              )}
            </>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">From</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={e => setFromDate(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">To</label>
                <input
                  type="date"
                  value={toDate}
                  min={fromDate}
                  onChange={e => setToDate(e.target.value)}
                  className="w-full border-2 border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              {errors.range && <p className="col-span-2 text-red-600 text-sm">{errors.range}</p>}
            </div>
          )}

          <button
            type="submit"
            disabled={Object.keys(errors).length > 0}
            className="w-full bg-blue-600 hover:bg-blue-700 transition-colors text-white font-semibold py-3 rounded-md disabled:opacity-50"
          >
            Submit Request
          </button>
        </div>
      </div>
    </form>
  );
}
