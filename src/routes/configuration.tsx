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
      { title: "Levels", description: "Organizational levels and hierarchy", icon: Layers, href: "/configuration/levels" },
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
      { title: "Locations", description: "Branches, worksites and geofences", icon: MapPin, href: "/configuration/locations" },
      { title: "Cities & Districts", description: "Geographical areas", icon: MapPin, href: "/configuration/cities" },
      { title: "Networks", description: "Allowed Wi-Fi networks", icon: Wifi, href: "/configuration/networks" },
    ]
  },
  {
    category: "Security",
    description: "System access",
    items: [
      { title: "Roles & Permissions", description: "Role assignments and permissions", icon: ShieldCheck, href: "/configuration/roles" },
    ]
  }
];

function ConfigurationPage() {
  return (
    <div className="space-y-6 pb-10">
      <PageHeader 
        section="Administration" 
        title="Configuration Directory" 
        description="Manage core HR rule sets, organizational structure, and system parameters." 
      />

      <div className="space-y-8 mt-6">
        {configSections.map((section) => (
          <div key={section.category} className="space-y-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">{section.category}</h2>
              <p className="text-sm text-muted-foreground">{section.description}</p>
            </div>
            
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {section.items.map((item) => (
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
                      <h3 className="text-sm font-semibold text-foreground group-hover:text-brand transition-colors">{item.title}</h3>
                      <ChevronRight className="size-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </div>
                    <p className="mt-1 text-[13px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
