import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LeaveType, LeaveRequest } from '../types';
import getDaysRequested from '../utils/getDaysRequested';

interface LeaveRequestFormProps {
  employeeName: string;
}

export default function LeaveRequestForm({ employeeName }: LeaveRequestFormProps) {
  const navigate = useNavigate();

  const [leaveType, setLeaveType] = useState<LeaveType>('Annual Leave');
  const [reason, setReason] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [dayLength, setDayLength] = useState<'full' | 'firstHalf' | 'secondHalf'>('full');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isSingleDay = dateRange.from && dateRange.from === dateRange.to;

  useEffect(() => {
    const errs: Record<string, string> = {};
    const today = new Date().toISOString().slice(0, 10);

    if (!reason.trim()) errs.reason = 'Reason is required.';
    if (!dateRange.from || !dateRange.to) errs.date = 'Please select date(s).';
    else if (dateRange.from < today) errs.date = 'Start date must be today or later.';
    else if (dateRange.to < dateRange.from) errs.date = 'End date must be after start date.';

    setErrors(errs);
  }, [reason, dateRange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) return;

    const employeeId = parseInt(localStorage.getItem('userId') || '0', 10);
    if (!employeeId || isNaN(employeeId)) {
      alert('Invalid employee ID.');
      return;
    }

    const payload = {
      employeeId,
      employeeName,
      leaveType,
      reason,
      from: dateRange.from,
      to: dateRange.to || null,
      duration: isSingleDay
        ? (dayLength === 'full' ? 1 : 0.5)
        : getDaysRequested({ from: dateRange.from, to: dateRange.to } as LeaveRequest),
      dayLength: isSingleDay ? dayLength : undefined,
      selectedHalf:
        isSingleDay && dayLength !== 'full'
          ? dayLength === 'firstHalf' ? 'first' : 'second'
          : undefined,
      dateMode: 'single',
      status: 'Pending',
    };

    try {
      const res = await fetch('http://localhost:3000/leave-requests/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        alert('Leave request submitted!');
        navigate('/dashboard');
      } else {
        const error = await res.json();
        alert(`Backend Error: ${error.message || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Network error: could not connect to backend.');
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, key: 'from' | 'to') => {
    setDateRange(prev => ({ ...prev, [key]: e.target.value }));
  };

  return (
    <form onSubmit={handleSubmit} className="w-full bg-white p-6 rounded-lg shadow-md space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
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
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">From</label>
              <input
                type="date"
                value={dateRange.from}
                onChange={e => handleDateChange(e, 'from')}
                className="w-full border-2 border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">To</label>
              <input
                type="date"
                value={dateRange.to}
                min={dateRange.from}
                onChange={e => handleDateChange(e, 'to')}
                className="w-full border-2 border-gray-300 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            {errors.date && <p className="col-span-2 text-red-600 text-sm">{errors.date}</p>}
          </div>

          {isSingleDay && (
            <div>
              <label className="block text-sm font-medium mb-1">Day Length</label>
              <div className="flex items-center gap-6">
                {(['full', 'firstHalf', 'secondHalf'] as const).map(dl => (
                  <label key={dl} className="inline-flex items-center">
                    <input
                      type="radio"
                      value={dl}
                      checked={dayLength === dl}
                      onChange={() => setDayLength(dl)}
                      className="form-radio h-4 w-4 text-blue-600"
                    />
                    <span className="ml-2 capitalize">
                      {dl === 'full' ? 'Full Day' : dl === 'firstHalf' ? 'First Half' : 'Second Half'}
                    </span>
                  </label>
                ))}
              </div>
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
