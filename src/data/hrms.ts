export type Employee = {
  id: string;
  name: string;
  role: string;
  department: string;
  branch: string;
  type: "Full-time" | "Part-time" | "Contract";
  status: "Active" | "On Leave" | "Probation";
  joined: string;
  email: string;
  tags: string[];
  avatar?: string;
  extraEmail?: string;
  password?: string;
  phone?: string;
  autoId?: boolean;
  city?: string;
  district?: string;
  position?: string;
  gender?: string;
  manager?: string;
  idKind?: "National ID" | "Passport";
  nationalId?: string;
  idIssueDate?: string;
  idExpiryDate?: string;
  addressOnId?: string;
  contractStart?: string;
  contractEnd?: string;
  medicalInsurance?: string;
  socialInsuranceDate?: string;
  militaryExpireDate?: string;
  customFields?: { label: string; value: string }[];
  salaryBasis?: "Gross" | "Net";
  salaryGross?: string;
  salaryNet?: string;
  allowance?: string;
  targetValue?: string;
  targetDuration?: "Monthly" | "Quarterly" | "Yearly";
  disabilityQuota?: boolean;
  isInsured?: boolean;
  allowPastExpiry?: boolean;
};

export const cities = ["Cairo", "Giza", "Alexandria", "Dubai", "Riyadh"] as const;

export const districtsByCity: Record<string, string[]> = {
  Cairo: ["Nasr City", "Maadi", "Heliopolis", "New Cairo"],
  Giza: ["Dokki", "Mohandessin", "6th of October", "Sheikh Zayed"],
  Alexandria: ["Smouha", "Sidi Gaber", "Miami", "Montaza"],
  Dubai: ["Deira", "Business Bay", "Marina", "Jumeirah"],
  Riyadh: ["Olaya", "Al Malaz", "Al Nakheel", "Diplomatic Quarter"],
};

export const genders = ["Male", "Female"] as const;

export const departments = [
  "Human Resources",
  "Finance",
  "Operations",
  "Technology",
  "Logistics",
] as const;

export const designations = [
  "HR Business Partner",
  "Recruitment Specialist",
  "Senior Accountant",
  "Payroll Officer",
  "Field Technician",
  "Product Designer",
  "Software Engineer",
  "Warehouse Supervisor",
] as const;

export const branches = ["Cairo HQ", "Alexandria", "Dubai", "Riyadh", "Remote"] as const;

export const employeeTags = [
  "High performer",
  "Visa holder",
  "Shift worker",
  "Manager",
  "New joiner",
  "Remote",
] as const;

export const employees: Employee[] = [
  { id: "SL-1042", name: "Yara Mansour", role: "HR Business Partner", department: "Human Resources", branch: "Cairo HQ", type: "Full-time", status: "Active", joined: "14-03-2021", email: "yara@stafflink.io", tags: ["Manager", "High performer"] },
  { id: "SL-1058", name: "Omar Khalil", role: "Senior Accountant", department: "Finance", branch: "Cairo HQ", type: "Full-time", status: "Active", joined: "02-11-2019", email: "omar@stafflink.io", tags: ["High performer"] },
  { id: "SL-1103", name: "Leen Al-Hariri", role: "Recruitment Specialist", department: "Human Resources", branch: "Dubai", type: "Full-time", status: "On Leave", joined: "20-06-2022", email: "leen@stafflink.io", tags: ["Visa holder"] },
  { id: "SL-1120", name: "Karim Fathy", role: "Field Technician", department: "Operations", branch: "Alexandria", type: "Contract", status: "Active", joined: "09-01-2023", email: "karim@stafflink.io", tags: ["Shift worker", "Visa holder"] },
  { id: "SL-1166", name: "Nadia Sabry", role: "Product Designer", department: "Technology", branch: "Remote", type: "Full-time", status: "Probation", joined: "01-09-2025", email: "nadia@stafflink.io", tags: ["New joiner", "Remote"] },
  { id: "SL-1189", name: "Hassan Rageh", role: "Warehouse Supervisor", department: "Logistics", branch: "Riyadh", type: "Full-time", status: "Active", joined: "17-04-2018", email: "hassan@stafflink.io", tags: ["Manager", "Shift worker"] },
  { id: "SL-1204", name: "Mai Gaber", role: "Payroll Officer", department: "Finance", branch: "Cairo HQ", type: "Part-time", status: "Active", joined: "11-02-2024", email: "mai@stafflink.io", tags: [] },
  { id: "SL-1231", name: "Ziad Nour", role: "Software Engineer", department: "Technology", branch: "Remote", type: "Full-time", status: "Active", joined: "29-08-2022", email: "ziad@stafflink.io", tags: ["Remote", "High performer"] },
];

export const attendanceWeek = [
  { day: "Mon", present: 1128, late: 74, absent: 42 },
  { day: "Tue", present: 1164, late: 51, absent: 29 },
  { day: "Wed", present: 1141, late: 63, absent: 40 },
  { day: "Thu", present: 1097, late: 88, absent: 59 },
  { day: "Fri", present: 642, late: 22, absent: 18 },
  { day: "Sat", present: 318, late: 9, absent: 11 },
  { day: "Sun", present: 1155, late: 47, absent: 42 },
];

export const leaveTrend = [
  { month: "Jan", annual: 82, sick: 31, unpaid: 9 },
  { month: "Feb", annual: 71, sick: 44, unpaid: 12 },
  { month: "Mar", annual: 96, sick: 28, unpaid: 7 },
  { month: "Apr", annual: 134, sick: 35, unpaid: 15 },
  { month: "May", annual: 118, sick: 39, unpaid: 11 },
  { month: "Jun", annual: 165, sick: 26, unpaid: 18 },
];

export const departmentSplit = [
  { name: "Operations", value: 412 },
  { name: "Technology", value: 268 },
  { name: "Finance", value: 143 },
  { name: "Human Resources", value: 96 },
  { name: "Logistics", value: 325 },
];

export const payrollTrend = [
  { month: "Feb", gross: 3.42, net: 2.88 },
  { month: "Mar", gross: 3.51, net: 2.95 },
  { month: "Apr", gross: 3.68, net: 3.07 },
  { month: "May", gross: 3.61, net: 3.01 },
  { month: "Jun", gross: 3.84, net: 3.19 },
];

export const pipeline = [
  { stage: "Applied", count: 486 },
  { stage: "Screened", count: 214 },
  { stage: "Interview", count: 97 },
  { stage: "Offer", count: 31 },
  { stage: "Hired", count: 18 },
];

export const activities = [
  { who: "Yara Mansour", what: "approved 3 leave requests", when: "8 min ago", tone: "success" as const },
  { who: "System", what: "payroll period June closed for review", when: "42 min ago", tone: "info" as const },
  { who: "Karim Fathy", what: "submitted an attendance correction", when: "1 h ago", tone: "warning" as const },
  { who: "Nadia Sabry", what: "uploaded a signed contract", when: "2 h ago", tone: "info" as const },
  { who: "Hassan Rageh", what: "visa expires in 21 days", when: "3 h ago", tone: "danger" as const },
];

export const requests = [
  { id: "REQ-3391", employee: "Leen Al-Hariri", type: "Annual Leave", period: "12 – 19 Aug", status: "Pending" },
  { id: "REQ-3388", employee: "Ziad Nour", type: "Salary Advance", period: "August cycle", status: "Pending" },
  { id: "REQ-3384", employee: "Mai Gaber", type: "Remote Work", period: "05 – 09 Aug", status: "Approved" },
  { id: "REQ-3379", employee: "Karim Fathy", type: "Overtime", period: "31 Jul", status: "Rejected" },
];
