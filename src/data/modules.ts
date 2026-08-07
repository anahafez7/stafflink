export const reviewCycles = [
  { name: "Q2 2026 · Company", due: "30 Sep 2026", submitted: 78, participants: 1244, status: "Open" },
  { name: "Q1 2026 · Company", due: "31 Mar 2026", submitted: 100, participants: 1198, status: "Closed" },
  { name: "Probation · Aug intake", due: "22 Aug 2026", submitted: 41, participants: 36, status: "Open" },
  { name: "360 · Leadership", due: "15 Oct 2026", submitted: 12, participants: 58, status: "Draft" },
];

export const goals = [
  { title: "Reduce time to hire to 21 days", owner: "Leen Al-Hariri", department: "Human Resources", progress: 68, weight: "25%", due: "Sep 2026" },
  { title: "Payroll accuracy above 99.8%", owner: "Mai Gaber", department: "Finance", progress: 92, weight: "20%", due: "Dec 2026" },
  { title: "Ship attendance mobile app v2", owner: "Ziad Nour", department: "Technology", progress: 44, weight: "30%", due: "Nov 2026" },
  { title: "Cut warehouse overtime by 15%", owner: "Hassan Rageh", department: "Logistics", progress: 57, weight: "15%", due: "Oct 2026" },
];

export const ratingSplit = [
  { band: "Outstanding", count: 96 },
  { band: "Exceeds", count: 284 },
  { band: "Meets", count: 631 },
  { band: "Needs work", count: 178 },
  { band: "Below", count: 55 },
];

export const documentsList = [
  { name: "Employment contract.pdf", employee: "Yara Mansour", category: "Contract", version: "v3", size: "482 KB", expires: "2027-03-14", status: "Valid" },
  { name: "Passport scan.jpg", employee: "Hassan Rageh", category: "Identity", version: "v1", size: "1.8 MB", expires: "2026-08-25", status: "Expiring" },
  { name: "Work visa.pdf", employee: "Karim Fathy", category: "Identity", version: "v2", size: "740 KB", expires: "2026-08-12", status: "Expiring" },
  { name: "ISO 27001 certificate.pdf", employee: "Company", category: "Certificate", version: "v1", size: "312 KB", expires: "2028-01-30", status: "Valid" },
  { name: "Driving licence.png", employee: "Omar Khalil", category: "Licence", version: "v4", size: "902 KB", expires: "2026-07-19", status: "Expired" },
  { name: "Remote work policy.docx", employee: "Company", category: "Policy", version: "v6", size: "128 KB", expires: "—", status: "Valid" },
];

export const analyticsMetrics = [
  { metric: "Headcount", value: "1,244", change: "+3.4%", trend: "up" as const },
  { metric: "Turnover (12m)", value: "8.7%", change: "-1.2 pts", trend: "up" as const },
  { metric: "Absenteeism", value: "2.9%", change: "+0.4 pts", trend: "down" as const },
  { metric: "Average salary", value: "EGP 21.4k", change: "+5.1%", trend: "up" as const },
  { metric: "Time to hire", value: "27 days", change: "-4 days", trend: "up" as const },
  { metric: "Cost per hire", value: "EGP 14.2k", change: "-6.8%", trend: "up" as const },
];

export const headcountTrend = [
  { month: "Jan", headcount: 1162, hires: 34, exits: 19 },
  { month: "Feb", headcount: 1178, hires: 31, exits: 15 },
  { month: "Mar", headcount: 1194, hires: 28, exits: 12 },
  { month: "Apr", headcount: 1212, hires: 37, exits: 19 },
  { month: "May", headcount: 1228, hires: 33, exits: 17 },
  { month: "Jun", headcount: 1244, hires: 40, exits: 24 },
];

export const branchPerformance = [
  { branch: "Cairo HQ", headcount: 512, attendance: 96, turnover: "7.1%" },
  { branch: "Alexandria", headcount: 218, attendance: 93, turnover: "9.4%" },
  { branch: "Dubai", headcount: 186, attendance: 97, turnover: "6.2%" },
  { branch: "Riyadh", headcount: 174, attendance: 91, turnover: "11.8%" },
  { branch: "Remote", headcount: 154, attendance: 98, turnover: "5.3%" },
];

export const users = [
  { name: "Hafez Rahim", email: "hafez@stafflink.io", role: "Super Admin", branch: "All", twoFactor: true, lastSeen: "2 min ago", status: "Active" },
  { name: "Yara Mansour", email: "yara@stafflink.io", role: "HR Manager", branch: "Cairo HQ", twoFactor: true, lastSeen: "18 min ago", status: "Active" },
  { name: "Mai Gaber", email: "mai@stafflink.io", role: "Payroll Officer", branch: "Cairo HQ", twoFactor: false, lastSeen: "1 h ago", status: "Active" },
  { name: "Leen Al-Hariri", email: "leen@stafflink.io", role: "Recruiter", branch: "Dubai", twoFactor: true, lastSeen: "Yesterday", status: "Suspended" },
  { name: "Ziad Nour", email: "ziad@stafflink.io", role: "Employee", branch: "Remote", twoFactor: false, lastSeen: "3 h ago", status: "Active" },
];

export const roleMatrix = {
  modules: ["HR", "Attendance", "Payroll", "Recruitment", "Documents", "Settings"],
  roles: [
    { role: "Super Admin", access: ["full", "full", "full", "full", "full", "full"] },
    { role: "HR Manager", access: ["full", "full", "read", "full", "full", "read"] },
    { role: "Payroll Officer", access: ["read", "read", "full", "none", "read", "none"] },
    { role: "Manager", access: ["read", "full", "none", "read", "read", "none"] },
    { role: "Employee", access: ["none", "read", "read", "none", "read", "none"] },
  ] as { role: string; access: ("full" | "read" | "none")[] }[],
};

export const accessLogs = [
  { user: "Mai Gaber", action: "Exported June payroll register", ip: "196.221.44.10", when: "12 min ago" },
  { user: "Yara Mansour", action: "Updated role permissions for Recruiter", ip: "196.221.44.31", when: "48 min ago" },
  { user: "Unknown", action: "Failed sign-in attempt (3x)", ip: "45.83.12.204", when: "2 h ago" },
  { user: "Hafez Rahim", action: "Enabled IP restrictions on Riyadh branch", ip: "10.0.4.2", when: "Yesterday" },
];

export const worksites = [
  { name: "Cairo HQ", city: "Cairo, EG", employees: 512, radius: "150 m", coords: "30.0444, 31.2357", geofence: true },
  { name: "Alexandria Depot", city: "Alexandria, EG", employees: 218, radius: "250 m", coords: "31.2001, 29.9187", geofence: true },
  { name: "Dubai Office", city: "Dubai, AE", employees: 186, radius: "100 m", coords: "25.2048, 55.2708", geofence: true },
  { name: "Riyadh Warehouse", city: "Riyadh, SA", employees: 174, radius: "400 m", coords: "24.7136, 46.6753", geofence: false },
  { name: "Remote", city: "Distributed", employees: 154, radius: "—", coords: "—", geofence: false },
];

export const myRequests = [
  { id: "REQ-3402", type: "Annual Leave", period: "18 – 22 Aug 2026", days: 5, status: "Pending" },
  { id: "REQ-3377", type: "Salary Advance", period: "August cycle", days: 0, status: "Approved" },
  { id: "REQ-3341", type: "Attendance correction", period: "14 Jul 2026", days: 0, status: "Approved" },
  { id: "REQ-3298", type: "Unpaid Leave", period: "02 Jun 2026", days: 1, status: "Rejected" },
];

export type LeaveRequest = {
  id: string;
  type: string;
  leaveType: string;
  period: string;
  days: number;
  status: "Pending" | "Approved" | "Rejected";
  reason: string;
  submitted: string;
  balanceBefore: number;
  balanceAfter: number;
  decision: string;
};

export const leaveHistory: LeaveRequest[] = [
  {
    id: "REQ-3402",
    type: "Annual leave",
    leaveType: "Annual",
    period: "18 – 22 Aug 2026",
    days: 5,
    status: "Pending",
    reason: "Family trip to Alexandria, cover arranged with Ziad.",
    submitted: "02 Aug 2026",
    balanceBefore: 12,
    balanceAfter: 7,
    decision: "Awaiting Omar Saleh",
  },
  {
    id: "REQ-3388",
    type: "Sick leave",
    leaveType: "Sick",
    period: "09 Jul 2026",
    days: 1,
    status: "Approved",
    reason: "Fever, medical certificate attached.",
    submitted: "09 Jul 2026",
    balanceBefore: 11,
    balanceAfter: 10,
    decision: "Approved by Omar Saleh · 09 Jul 2026",
  },
  {
    id: "REQ-3341",
    type: "Casual leave",
    leaveType: "Casual",
    period: "14 Jul 2026",
    days: 1,
    status: "Approved",
    reason: "Government paperwork appointment.",
    submitted: "10 Jul 2026",
    balanceBefore: 5,
    balanceAfter: 4,
    decision: "Approved by Omar Saleh · 11 Jul 2026",
  },
  {
    id: "REQ-3298",
    type: "Annual leave",
    leaveType: "Annual",
    period: "01 – 04 Jun 2026",
    days: 4,
    status: "Rejected",
    reason: "Extended weekend — clashed with the June payroll lock.",
    submitted: "20 May 2026",
    balanceBefore: 16,
    balanceAfter: 16,
    decision: "Rejected by Omar Saleh · 22 May 2026",
  },
];

export type PunchRecord = {
  date: string;
  in: string;
  out: string;
  hours: string;
  state: string;
  location?: string;
  coords?: string;
  method?: string;
};

const punchSites = [
  { location: "Cairo HQ · Nasr City", coords: "30.0626, 31.3497", method: "Web punch" },
  { location: "Cairo HQ · Nasr City", coords: "30.0626, 31.3497", method: "Kiosk terminal" },
  { location: "Giza Branch · Dokki", coords: "30.0380, 31.2120", method: "Mobile GPS" },
  { location: "Remote · Home office", coords: "—", method: "Mobile GPS" },
];

const pad = (n: number) => String(n).padStart(2, "0");

function buildAttendanceHistory(): PunchRecord[] {
  const out: PunchRecord[] = [];
  for (const [year, month, days] of [
    [2026, 6, 30],
    [2026, 7, 31],
  ] as [number, number, number][]) {
    for (let d = 1; d <= days; d++) {
      const date = new Date(Date.UTC(year, month - 1, d));
      const wd = date.getUTCDay();
      const key = `${year}-${pad(month)}-${pad(d)}`;
      if (wd === 5 || wd === 6) {
        out.push({ date: key, in: "—", out: "—", hours: "—", state: "Weekend" });
        continue;
      }
      const seed = (d * 7 + month * 3) % 10;
      if (seed === 4) {
        out.push({ date: key, in: "—", out: "—", hours: "—", state: "Leave" });
        continue;
      }
      const late = seed === 1 || seed === 8;
      const overtime = seed === 6;
      const inMin = late ? 9 * 60 + 5 + seed : 8 * 60 + 35 + seed;
      const worked = overtime ? 9 * 60 + 20 : 8 * 60 + 25 + (seed % 5);
      const outMin = inMin + worked;
      const site = punchSites[seed % punchSites.length]!;
      out.push({
        date: key,
        in: `${pad(Math.floor(inMin / 60))}:${pad(inMin % 60)}`,
        out: `${pad(Math.floor(outMin / 60))}:${pad(outMin % 60)}`,
        hours: `${Math.floor(worked / 60)}h ${pad(worked % 60)}m`,
        state: late ? "Late" : overtime ? "Overtime" : "On time",
        location: site.location,
        coords: site.coords,
        method: site.method,
      });
    }
  }
  return out;
}

export const attendanceHistory: PunchRecord[] = buildAttendanceHistory();

export const payslips = [
  { month: "July 2026", gross: "EGP 24,500", net: "EGP 20,180", issued: "28 Jul 2026" },
  { month: "June 2026", gross: "EGP 24,500", net: "EGP 20,180", issued: "28 Jun 2026" },
  { month: "May 2026", gross: "EGP 23,000", net: "EGP 19,120", issued: "28 May 2026" },
];

export const announcements = [
  { title: "Eid holiday schedule confirmed", body: "Offices close 5–8 September. Field teams follow the shift roster.", when: "Today" },
  { title: "New medical insurance provider", body: "Cards are being distributed by HR business partners this week.", when: "2 days ago" },
  { title: "Q3 town hall", body: "Join Mr. Hafez Rahim for the quarterly business review on 12 September.", when: "5 days ago" },
];

export const leaveBalances = [
  { type: "Annual", used: 9, total: 21 },
  { type: "Sick", used: 2, total: 12 },
  { type: "Casual", used: 3, total: 7 },
];

export const myPunchLog = [
  { day: "Mon", in: "08:41", out: "17:12", hours: "8h 31m", state: "On time" },
  { day: "Tue", in: "09:06", out: "17:30", hours: "8h 24m", state: "Late" },
  { day: "Wed", in: "08:38", out: "17:05", hours: "8h 27m", state: "On time" },
  { day: "Thu", in: "08:52", out: "18:02", hours: "9h 10m", state: "Overtime" },
];

export const settingsGroups = [
  {
    title: "Organization",
    items: [
      { label: "Company profile", value: "StaffLink FZ-LLC" },
      { label: "Branches", value: "6 active" },
      { label: "Departments", value: "5 departments" },
      { label: "Positions", value: "48 positions" },
      { label: "Job grades", value: "12 grades" },
    ],
  },
  {
    title: "Rules",
    items: [
      { label: "Leave types", value: "9 configured" },
      { label: "Attendance rules", value: "Grace 10 min" },
      { label: "Payroll rules", value: "Monthly · 28th" },
      { label: "Currency", value: "EGP (base)" },
      { label: "Languages", value: "EN · AR" },
    ],
  },
  {
    title: "Platform",
    items: [
      { label: "Email provider", value: "Connected" },
      { label: "SMS gateway", value: "Connected" },
      { label: "WhatsApp", value: "Not connected" },
      { label: "API access", value: "3 keys" },
      { label: "Backups", value: "Daily · 02:00" },
    ],
  },
];

export const settingsToggles = [
  { label: "Two-factor authentication", hint: "Require 2FA for all admin roles", on: true },
  { label: "Geofenced check-in", hint: "Block punches outside worksite radius", on: true },
  { label: "Auto payroll lock", hint: "Lock the period 24h before payout", on: true },
  { label: "Document OCR", hint: "Extract text from uploaded documents", on: false },
  { label: "Weekly digest", hint: "Email managers a Monday summary", on: true },
];
