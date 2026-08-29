import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Language = "en" | "ar";

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Topbar & Common
    searchPlaceholder: "Search employees, requests, documents…",
    signIn: "Sign in",
    signOut: "Sign out",
    guest: "Guest",
    admin: "System Administrator",
    hr_manager: "HR Director",
    manager: "Operations Manager",
    employee: "Employee",
    
    // Sidebar Groups & Navigation
    workspace: "Workspace",
    administration: "Administration",
    dashboard: "Dashboard",
    hr: "HR",
    myTeam: "My Team",
    attendance: "Attendance",
    tasks: "Tasks",
    payroll: "Payroll",
    recruitment: "Recruitment",
    performance: "Performance",
    documents: "Documents",
    selfService: "Self Service",
    leaves: "Leaves",
    myProfile: "My Profile",
    onboarding: "Onboarding",
    expenses: "Expenses",
    assets: "Assets",
    disciplinary: "Disciplinary",
    training: "Training",
    engagement: "Engagement",
    analytics: "Analytics",
    settings: "Settings",
    configuration: "Configuration",
    usersAndPermissions: "Users & Permissions",
    developer: "Developer",
    
    // Common Actions & Statuses
    active: "Active",
    inactive: "Inactive",
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    filter: "Filter",
    search: "Search",
    create: "Create",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",
    download: "Download",
    upload: "Upload",
    actions: "Actions",
    all: "All",
    unread: "Unread",
    viewDetails: "View details",
    status: "Status",
    date: "Date",
    time: "Time",
    category: "Category",
    department: "Department",
    branch: "Branch",
    user: "User",
    role: "Role",
    email: "Email",
    phone: "Phone",
    position: "Position",
    name: "Name",
    export: "Export",
    import: "Import",
    back: "Back",
    open: "Open",
    closed: "Closed",
    draft: "Draft",
    published: "Published",
    required: "Required",
    optional: "Optional",
    valid: "Valid",
    expiring: "Expiring",
    expired: "Expired",

    // Dashboard
    overviewTitle: "Executive Overview",
    overviewDesc: "Real-time enterprise metrics, active workforce summary, and quick operational tasks.",
    activeWorkforce: "Active Workforce",
    attendanceToday: "Attendance Today",
    monthlyPayroll: "Monthly Payroll",
    pendingRequests: "Pending Requests",
    quickActions: "Quick Actions",
    clockIn: "Punch In",
    clockOut: "Punch Out",
    requestLeave: "Request Leave",
    submitExpense: "Submit Expense",
    uploadDoc: "Upload Document",

    // HR & Employees
    directoryTitle: "Employee Directory",
    directoryDesc: "Browse, filter and manage company personnel across all global branches.",
    addEmployee: "Add Employee",
    totalEmployees: "Total Employees",
    newHires: "New Hires",
    onLeave: "On Leave",
    turnover: "Turnover",

    // Attendance & Self-Service
    attendanceTitle: "Time & Attendance",
    attendanceDesc: "Live biometric check-ins, shift rosters, geofenced tracking and late penalties.",
    selfServiceTitle: "Employee Self-Service",
    selfServiceDesc: "Manage your daily punches, leave applications, pay slips, and corporate documents.",
    checkInTime: "Check In",
    checkOutTime: "Check Out",
    workingHours: "Working Hours",
    onTime: "On Time",
    late: "Late",
    overtime: "Overtime",
    weekend: "Weekend",

    // Leaves
    leavesTitle: "Leave Management",
    leavesDesc: "Track annual accruals, review balance entitlements, and process leave requests.",
    annualLeave: "Annual Leave",
    sickLeave: "Sick Leave",
    casualLeave: "Casual Leave",
    unpaidLeave: "Unpaid Leave",
    leaveBalance: "Leave Balance",
    used: "Used",
    available: "Available",
    requestDays: "Days",
    reason: "Reason",

    // Payroll
    payrollTitle: "Payroll Management",
    payrollDesc: "Execute monthly payroll runs, manage statutory deductions, taxes and direct deposit payslips.",
    grossPay: "Gross Pay",
    netPay: "Net Pay",
    deductions: "Deductions",
    allowances: "Allowances",
    payslips: "Payslips",
    lockPayroll: "Lock Payroll",
    runPayroll: "Run Payroll",

    // Recruitment
    recruitmentTitle: "Recruitment & ATS",
    recruitmentDesc: "Track job requisitions, monitor talent pipelines, and coordinate candidate interviews.",
    postJob: "Post Job Opening",
    openPositions: "Open Positions",
    candidates: "Candidates",
    hiredThisMonth: "Hired This Month",
    applied: "Applied",
    screening: "Screening",
    interview: "Interview",
    offer: "Offer",
    hired: "Hired",

    // Performance
    performanceTitle: "Performance & Appraisal",
    performanceDesc: "Track corporate OKRs, 360 review cycles, employee KPIs, and top performers.",
    reviewCycles: "Review Cycles",
    goalsAndKpis: "Goals & KPIs",
    ratingDistribution: "Rating Distribution",
    topPerformers: "Top Performers",
    startReview: "Start Review Cycle",

    // Documents
    documentsTitle: "Document Management",
    documentsDesc: "Central repository for employment contracts, national IDs, visas, and certificates.",
    uploadDocument: "Upload Document",
    contract: "Contract",
    identity: "Identity",
    certificate: "Certificate",
    policy: "Policy",

    // Tasks
    tasksTitle: "Task Management",
    tasksDesc: "Assign, monitor and collaborate on operational tasks across departments.",
    createTask: "Create Task",
    todo: "To Do",
    inProgress: "In Progress",
    completed: "Completed",
    priority: "Priority",
    high: "High",
    medium: "Medium",
    low: "Low",

    // Other Modules
    onboardingTitle: "Employee Onboarding",
    expensesTitle: "Expense Management",
    assetsTitle: "Asset Inventory",
    disciplinaryTitle: "Disciplinary & Grievances",
    trainingTitle: "Training & LMS",
    engagementTitle: "Employee Engagement",
    analyticsTitle: "Workforce Analytics",

    // Users & Permissions page
    accessControl: "Access control",
    accessControlDesc: "Role-based access with a full audit trail across the platform.",
    activeUsers: "Active users",
    roles: "Roles",
    twoFactorAdoption: "2FA adoption",
    failedSignIns: "Failed sign-ins",
    usersList: "Users",
    permissionMatrix: "Permission matrix",
    recentAccessLogs: "Recent access logs",
    lastSeen: "Last seen",
    full: "Full",
    read: "Read",
    none: "None",
    createUser: "Create user",
    editUser: "Edit user",
    editRole: "Edit role",
  },
  ar: {
    // Topbar & Common
    searchPlaceholder: "البحث عن الموظفين، الطلبات، المستندات…",
    signIn: "تسجيل الدخول",
    signOut: "تسجيل الخروج",
    guest: "زائر",
    admin: "مدير النظام",
    hr_manager: "مدير الموارد البشرية",
    manager: "مدير العمليات",
    employee: "موظف",
    
    // Sidebar Groups & Navigation
    workspace: "مساحة العمل",
    administration: "الإدارة والنظام",
    dashboard: "لوحة التحكم",
    hr: "الموارد البشرية",
    myTeam: "فريق العمل",
    attendance: "الحضور والانصراف",
    tasks: "المهام",
    payroll: "الرواتب والمسيرات",
    recruitment: "التوظيف والتعيين",
    performance: "تقييم الأداء",
    documents: "إدارة المستندات",
    selfService: "الخدمة الذاتية",
    leaves: "الإجازات",
    myProfile: "الملف الشخصي",
    onboarding: "تهيئة الموظفين الجدد",
    expenses: "المصروفات والعهد",
    assets: "إدارة الأصول",
    disciplinary: "الجزاءات والتحقيقات",
    training: "التدريب والتطوير",
    engagement: "مشاركة الموظفين",
    analytics: "التقارير والتحليلات",
    settings: "الإعدادات العامة",
    configuration: "دليل الإعدادات",
    usersAndPermissions: "المستخدمون والصلاحيات",
    developer: "المطور",
    
    // Common Actions & Statuses
    active: "نشط",
    inactive: "غير نشط",
    pending: "قيد الانتظار",
    approved: "معتمد",
    rejected: "مرفوض",
    filter: "تصفية",
    search: "بحث",
    create: "إضافة جديد",
    edit: "تعديل",
    delete: "حذف",
    save: "حفظ",
    cancel: "إلغاء",
    download: "تحميل",
    upload: "رفع",
    actions: "الإجراءات",
    all: "الكل",
    unread: "غير مقروءة",
    viewDetails: "عرض التفاصيل",
    status: "الحالة",
    date: "التاريخ",
    time: "الوقت",
    category: "التصنيف",
    department: "القسم",
    branch: "الفرع",
    user: "المستخدم",
    role: "الدور الوظيفي",
    email: "البريد الإلكتروني",
    phone: "رقم الهاتف",
    position: "المسمى الوظيفي",
    name: "الاسم",
    export: "تصدير",
    import: "استيراد",
    back: "رجوع",
    open: "مفتوح",
    closed: "مغلق",
    draft: "مسودة",
    published: "منشور",
    required: "مطلوب",
    optional: "اختياري",
    valid: "ساري",
    expiring: "ينتهي قريباً",
    expired: "منتهي",

    // Dashboard
    overviewTitle: "نظرة عامة شاملة",
    overviewDesc: "مؤشرات حية للأداء المؤسسي، ملخص القوى العاملة والعمليات السريعة.",
    activeWorkforce: "إجمالي الموظفين النشطين",
    attendanceToday: "نسبة الحضور اليوم",
    monthlyPayroll: "إجمالي الرواتب الشهرية",
    pendingRequests: "الطلبات المعلقة",
    quickActions: "إجراءات سريعة",
    clockIn: "تسجيل حضور",
    clockOut: "تسجيل انصراف",
    requestLeave: "طلب إجازة",
    submitExpense: "طلب صرف مصروف",
    uploadDoc: "رفع مستند",

    // HR & Employees
    directoryTitle: "دليل الموظفين",
    directoryDesc: "استعراض وتصفية وإدارة بيانات موظفي الشركة عبر جميع الفروع.",
    addEmployee: "إضافة موظف جديد",
    totalEmployees: "إجمالي الموظفين",
    newHires: "المعينون الجدد",
    onLeave: "في إجازة",
    turnover: "معدل الدوران",

    // Attendance & Self-Service
    attendanceTitle: "سجل الحضور والانصراف",
    attendanceDesc: "تسجيل البصمة الذكية، جداول المناوبات، التتبع الجغرافي، وحساب التأخير والخصومات.",
    selfServiceTitle: "بوابة الخدمة الذاتية للموظف",
    selfServiceDesc: "إدارة البصمات اليومية، تقديم طلبات الإجازات، قسائم الرواتب، والمستندات الرسمية.",
    checkInTime: "وقت الحضور",
    checkOutTime: "وقت الانصراف",
    workingHours: "ساعات العمل",
    onTime: "في الموعد",
    late: "متأخر",
    overtime: "وقت إضافي",
    weekend: "عطلة أسبوعية",

    // Leaves
    leavesTitle: "إدارة الإجازات",
    leavesDesc: "متابعة أرصدة الإجازات السنوية، مراجعة الاستحقاقات، واعتماد طلبات الموظفين.",
    annualLeave: "إجازة سنوية",
    sickLeave: "إجازة مرضية",
    casualLeave: "إجازة عارضة",
    unpaidLeave: "إجازة بدون راتب",
    leaveBalance: "رصيد الإجازات",
    used: "المستهلك",
    available: "المتبقي",
    requestDays: "عدد الأيام",
    reason: "سبب الإجازة",

    // Payroll
    payrollTitle: "إدارة الرواتب والمسيرات",
    payrollDesc: "إعداد وصرف مسيرات الرواتب الشهرية، البدلات، الاستقطاعات، والتحويلات البنكية.",
    grossPay: "إجمالي الراتب",
    netPay: "صافي الراتب",
    deductions: "الاستقطاعات",
    allowances: "البدلات",
    payslips: "قسائم الرواتب",
    lockPayroll: "إغلاق المسير",
    runPayroll: "تشغيل مسير الرواتب",

    // Recruitment
    recruitmentTitle: "التوظيف وبوابة الكفاءات",
    recruitmentDesc: "إدارة الوظائف الشاغرة، متابعة مراحل المتقدمين، وتنظيم المقابلات الوظيفية.",
    postJob: "نشر وظيفة جديدة",
    openPositions: "الوظائف المتاحة",
    candidates: "المتقدمون",
    hiredThisMonth: "تم تعيينهم هذا الشهر",
    applied: "تم التقديم",
    screening: "فرز أولي",
    interview: "مقابلة",
    offer: "عرض عمل",
    hired: "تم التعيين",

    // Performance
    performanceTitle: "إدارة وتقييم الأداء",
    performanceDesc: "متابعة الأهداف المؤسسية (OKRs)، دورات التقييم 360، ومؤشرات الأداء الرئيسية.",
    reviewCycles: "دورات التقييم",
    goalsAndKpis: "الأهداف ومؤشرات الأداء",
    ratingDistribution: "توزيع التقييمات",
    topPerformers: "المتميزون",
    startReview: "بدء دورة تقييم جديدة",

    // Documents
    documentsTitle: "إدارة المستندات والوثائق",
    documentsDesc: "مستودع مركزي لعقود العمل، الهويات الوطنية، الإقامات، والشهادات المهنية.",
    uploadDocument: "رفع مستند جديد",
    contract: "عقد عمل",
    identity: "إثبات شخصية",
    certificate: "شهادة",
    policy: "سياسة داخلية",

    // Tasks
    tasksTitle: "إدارة المهام والعمليات",
    tasksDesc: "إسناد ومتابعة المهام التشغيلية عبر مختلف الإدارات وفرق العمل.",
    createTask: "إنشاء مهمة جديدة",
    todo: "قيد الانتظار",
    inProgress: "قيد التنفيذ",
    completed: "مكتملة",
    priority: "الأولوية",
    high: "عالية",
    medium: "متوسطة",
    low: "منخفضة",

    // Other Modules
    onboardingTitle: "تهيئة الموظفين الجدد",
    expensesTitle: "إدارة المصروفات والعهد",
    assetsTitle: "إدارة عهد الأصول",
    disciplinaryTitle: "الجزاءات والتحقيقات الإدارية",
    trainingTitle: "التدريب والدورات (LMS)",
    engagementTitle: "مشاركة واستطلاعات الموظفين",
    analyticsTitle: "التقارير والتحليلات المتقدمة",

    // Users & Permissions page
    accessControl: "التحكم في الصلاحيات والوصول",
    accessControlDesc: "إدارة الصلاحيات القائمة على الأدوار مع سجل تدقيق شامل عبر النظام.",
    activeUsers: "المستخدمون النشطون",
    roles: "الأدوار والصلاحيات",
    twoFactorAdoption: "المصادقة الثنائية (2FA)",
    failedSignIns: "محاولات الدخول الفاشلة",
    usersList: "قائمة المستخدمين",
    permissionMatrix: "مصفوفة الصلاحيات والأدوار",
    recentAccessLogs: "سجل الوصول الأخير",
    lastSeen: "آخر ظهور",
    full: "كامل",
    read: "قراءة فقط",
    none: "لا يوجد",
    createUser: "إضافة مستخدم",
    editUser: "تعديل المستخدم",
    editRole: "تعديل الدور",
  },
};

type I18nContextType = {
  lang: Language;
  dir: "ltr" | "rtl";
  setLanguage: (lang: Language) => void;
  t: (key: string, fallback?: string) => string;
};

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = "stafflink.lang";

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Language>("en");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as Language;
      if (saved && (saved === "en" || saved === "ar")) {
        setLang(saved);
        document.documentElement.dir = saved === "ar" ? "rtl" : "ltr";
        document.documentElement.lang = saved;
      }
    } catch {
      // ignore
    }
  }, []);

  const setLanguage = (newLang: Language) => {
    setLang(newLang);
    try {
      localStorage.setItem(STORAGE_KEY, newLang);
      document.documentElement.dir = newLang === "ar" ? "rtl" : "ltr";
      document.documentElement.lang = newLang;
    } catch {
      // ignore
    }
  };

  const t = (key: string, fallback?: string): string => {
    return translations[lang][key] ?? fallback ?? key;
  };

  return (
    <I18nContext.Provider
      value={{
        lang,
        dir: lang === "ar" ? "rtl" : "ltr",
        setLanguage,
        t,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    return {
      lang: "en" as Language,
      dir: "ltr" as const,
      setLanguage: () => {},
      t: (key: string, fallback?: string) => fallback ?? key,
    };
  }
  return ctx;
}
