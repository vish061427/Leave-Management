import type { LeaveRequest } from '../types';

/**
 * Calculates inclusive days between from and to,
 * or returns explicit req.duration if provided.
 */
export default function getDaysRequested(req: LeaveRequest): number {
  if (typeof req.duration === 'number') {
    return req.duration;
  }
  const from = new Date(req.from);
  const to = req.to ? new Date(req.to) : from;
  const msPerDay = 1000 * 60 * 60 * 24;
  const diff = Math.round((to.getTime() - from.getTime()) / msPerDay) + 1;
  return diff > 0 ? diff : 1;
}
