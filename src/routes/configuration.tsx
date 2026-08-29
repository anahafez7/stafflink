import { createFileRoute, Link } from "@tanstack/react-router";
import { 
  Building2, Layers, Briefcase, Award, MapPin, Target,
  FileText, Scale, CalendarHeart, CalendarClock, Clock, 
  Banknote, Wifi, ShieldCheck, Activity, Plane, Settings2,
  ChevronRight, CalendarRange, Clock4, AlignEndHorizontal
} from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";

export const Route = createFileRoute("/configuration")({
  head: () => ({
    meta: [
      { title: "Configuration Directory — StaffLink HRMS" },
      { name: "description", content: "Manage core HR rule sets and system configurations." }
    ]
  }),
  component: ConfigurationPage,
});

export const configSections = [
  {
    category: "Organization",
    description: "Company structure and hierarchies",
    items: [
      { title: "Departments", description: "Manage company departments and units", icon: Building2, href: "/configuration/departments" },
      { title: "Positions", description: "Job titles and roles", icon: Briefcase, href: "/configuration/positions" },
      { title: "Job Grades", description: "Salary bands and job grading", icon: Award, href: "/configuration/job-grades" },
    ]
  },
  {
    category: "Leave Management",
    description: "Review and approve leave requests",
    items: [
      { title: "Requests", description: "Approval workflows and types", icon: FileText, href: "/configuration/requests" },
      { title: "Balances", description: "Leave balance accrual rules", icon: Scale, href: "/configuration/balances" },
      { title: "Leave Types", description: "Categories of time off", icon: Plane, href: "/configuration/leave-types" },
      { title: "Holidays", description: "Public and company holidays", icon: CalendarHeart, href: "/configuration/holidays" },
      { title: "Holiday Types", description: "Categories of holidays", icon: CalendarRange, href: "/configuration/holiday-types" },
    ]
  },
  {
    category: "Time & Attendance",
    description: "Working hours and schedules",
    items: [
      { title: "Shifts", description: "Work shift definitions", icon: CalendarClock, href: "/configuration/shifts" },
      { title: "Late Penalties", description: "Lateness rule tiers", icon: Clock, href: "/configuration/late-penalties" },
    ]
  },
  {
    category: "Payroll",
    description: "Compensation rules",
    items: [
      { title: "Allowances", description: "Pay allowance catalog", icon: Banknote, href: "/configuration/allowances" },
      { title: "Targets & Overtime", description: "Hours targets and OT rules", icon: Clock4, href: "/configuration/targets-overtime" },
    ]
  },
  {
    category: "Performance",
    description: "Evaluation metrics",
    items: [
      { title: "KPIs", description: "Performance indicators", icon: Target, href: "/configuration/kpis" },
    ]
  },
  {
    category: "Location & IT",
    description: "Physical and network access",
    items: [
      { title: "Geo-Fencing", description: "Approved locations and check-in radii", icon: MapPin, href: "/configuration/geo-fencing" },
      { title: "Cities & Districts", description: "Geographical areas", icon: MapPin, href: "/configuration/cities" },
      { title: "Networks", description: "Allowed Wi-Fi networks", icon: Wifi, href: "/configuration/networks" },
    ]
  },
  {
    category: "System Settings",
    description: "System-wide parameters",
    items: [
      { title: "Settings", description: "SMTP, SMS, notifications and exports", icon: Settings2, href: "/configuration/settings" },
    ]
  }
];

import { useI18n } from "@/lib/i18n";

function ConfigurationPage() {
  const { t, lang } = useI18n();

  const sectionCategoryTranslations: Record<string, { category: string; description: string }> = {
    "Organization": { category: "الهيكل التنظيمي", description: "الهيكل المؤسسي وتدرج الإدارات والوظائف" },
    "Leave Management": { category: "إدارة الإجازات", description: "مراجعة واعتماد وتحديد سياسات الإجازات" },
    "Time & Attendance": { category: "ساعات العمل والحضور", description: "جداول ومواعيد العمل وسياسات التأخير" },
    "Payroll": { category: "الرواتب والبدلات", description: "قواعد الاستحقاقات والاستقطاعات والعمل الإضافي" },
    "Performance": { category: "إدارة الأداء", description: "مؤشرات الأداء الرئيسية والتقييمات" },
    "Location & IT": { category: "المواقع والشبكات", description: "النطاق الجغرافي والشبكات المعتمدة للبصمة" },
    "System Settings": { category: "إعدادات النظام", description: "إعدادات البريد الإلكتروني والرسائل والتنبيهات" },
  };

  const itemTranslations: Record<string, { title: string; description: string }> = {
    "Departments": { title: "الأقسام والإدارات", description: "إدارة الوحدات الإدارية بالشركة" },
    "Positions": { title: "المسميات الوظيفية", description: "أدوار ومسؤوليات الوظائف" },
    "Job Grades": { title: "الدرجات الوظيفية", description: "السلالم الوظيفية ونطاقات الرواتب" },
    "Requests": { title: "طلبات الإجازة", description: "مسارات الاعتماد وأنواع الطلبات" },
    "Balances": { title: "أرصدة الإجازات", description: "قواعد استحقاق وتراكم الأرصدة" },
    "Leave Types": { title: "أنواع الإجازات", description: "تصنيفات الإجازات المعتمدة" },
    "Holidays": { title: "العطلات الرسمية", description: "العطلات الرسمية والمؤسسية" },
    "Holiday Types": { title: "أنواع العطلات", description: "تصنيفات وأيام العطلات" },
    "Shifts": { title: "ورديات العمل", description: "تعريف الورديات ومواعيد الدوام" },
    "Late Penalties": { title: "جزاءات التأخير", description: "لوائح وشرائح خصومات التأخير" },
    "Allowances": { title: "دليل البدلات", description: "تصنيف البدلات والمكافآت" },
    "Targets & Overtime": { title: "المستهدفات والإضافي", description: "ساعات العمل الإضافي والمستهدفات" },
    "KPIs": { title: "مؤشرات الأداء", description: "مقاييس الأداء الرئيسية" },
    "Geo-Fencing": { title: "النطاق الجغرافي (Geo-Fence)", description: "المواقع الجغرافية ونطاق البصمة" },
    "Cities & Districts": { title: "المدن والمناطق", description: "المناطق والفروع الجغرافية" },
    "Networks": { title: "شبكات Wi-Fi", description: "الشبكات المعتمدة لتسجيل الحضور" },
    "Settings": { title: "إعدادات متقدمة", description: "SMTP والتنبيهات والربط الخارجي" },
  };

  return (
    <div className="space-y-6 pb-10">
      <PageHeader 
        section={t("administration", "Administration")} 
        title={t("configurationTitle", "Configuration Directory")} 
        description={
          lang === "ar"
            ? "إدارة السياسات وقواعد الموارد البشرية والهيكل الإداري للشركة."
            : "Manage core HR rule sets, organizational structure, and system parameters."
        } 
      />

      <div className="space-y-8 mt-6">
        {configSections.map((section) => {
          const transSec = (lang === "ar" && sectionCategoryTranslations[section.category] ? sectionCategoryTranslations[section.category]! : null) ?? { category: section.category, description: section.description };

          return (
            <div key={section.category} className="space-y-3">
              <div>
                <h2 className="text-lg font-semibold tracking-tight">{transSec.category}</h2>
                <p className="text-sm text-muted-foreground">{transSec.description}</p>
              </div>
              
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.items.map((item) => {
                  const transItem = (lang === "ar" && itemTranslations[item.title] ? itemTranslations[item.title]! : null) ?? { title: item.title, description: item.description };

                  return (
                    <Link 
                      key={item.title} 
                      to={item.href}
                      className="group relative flex items-start gap-4 rounded-xl border border-border bg-surface p-4 hover:border-brand/50 hover:bg-brand/5 hover:shadow-sm transition-all"
                    >
                      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-foreground group-hover:bg-brand group-hover:text-brand-foreground transition-colors">
                        <item.icon className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-sm font-semibold text-foreground group-hover:text-brand transition-colors">{transItem.title}</h3>
                          <ChevronRight className="size-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 rtl:rotate-180 transition-all" />
                        </div>
                        <p className="mt-1 text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">
                          {transItem.description}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
