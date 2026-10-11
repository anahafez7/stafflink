import { attendanceHistory, leaveHistory, type LeaveRequest, type PunchRecord } from "@/data/modules";
import type { Role } from "@/lib/auth";
import { useSharedState } from "@/lib/shared-store";

/* ---------- Leave approval workflow ---------- */

/** Only managers, HR managers and admins can approve or reject leave. */
export const canDecideLeave = (role?: Role) => role === "manager" || role === "hr_manager" || role === "admin";

export function useLeaveRequests() {
  return useSharedState<LeaveRequest[]>("stafflink.leave-requests", leaveHistory);
}

/* ---------- Punch history ---------- */

export type DayPunch = { in: string | null; out: string | null; method?: string };

export function usePunches(email = "guest") {
  return useSharedState<Record<string, DayPunch>>(`stafflink.punches.${email}`, {});
}

const toMin = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
};

export const formatMinutes = (m: number) => `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, "0")}m`;

export type TimesheetRow = PunchRecord & { minutes: number; live?: boolean };

/** Merges seeded attendance with the employee's own recorded punches. */
export function buildTimesheet(punches: Record<string, DayPunch>, days = 31): TimesheetRow[] {
  const map = new Map<string, TimesheetRow>();
  for (const r of attendanceHistory) {
    const minutes = r.in.includes(":") && r.out.includes(":") ? toMin(r.out) - toMin(r.in) : 0;
    map.set(r.date, { ...r, minutes });
  }
  for (const [date, p] of Object.entries(punches)) {
    if (!p.in) continue;
    const minutes = p.out ? Math.max(0, toMin(p.out) - toMin(p.in)) : 0;
    map.set(date, {
      date,
      in: p.in,
      out: p.out ?? "—",
      hours: p.out ? formatMinutes(minutes) : "In progress",
      state: p.out ? (toMin(p.in) > 9 * 60 ? "Late" : "On time") : "Checked in",
      method: p.method ?? "Web punch",
      location: "Cairo HQ",
      minutes,
      live: true,
    });
  }
  return [...map.values()].sort((a, b) => b.date.localeCompare(a.date)).slice(0, days);
}
