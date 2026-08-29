import { createFileRoute } from "@tanstack/react-router";
import { KeyRound, ShieldCheck, Users as UsersIcon, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { downloadCsv } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { accessLogs, roleMatrix, users } from "@/data/modules";
import { CreateUserDialog } from "@/components/users/create-user-dialog";
import { EditUserDialog } from "@/components/users/edit-user-dialog";
import { EditRoleDialog } from "@/components/users/edit-role-dialog";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Users & Permissions — StaffLink" },
      {
        name: "description",
        content: "Roles, permission matrix, approval workflows, 2FA, sessions and IP restrictions.",
      },
      { property: "og:title", content: "Users & Permissions — StaffLink" },
      { property: "og:description", content: "Roles, permission matrix, 2FA and access logs." },
    ],
  }),
  component: UsersPage,
});

const accessStyles = {
  full: "bg-success/15 text-success",
  read: "bg-warning/15 text-warning",
  none: "bg-muted text-muted-foreground",
} as const;

export function UsersPage() {
  const { t, lang } = useI18n();

  const accessLabel: Record<string, string> = {
    full: t("full", "Full"),
    read: t("read", "Read"),
    none: t("none", "None"),
  };

  const moduleNamesAr: Record<string, string> = {
    "HR": "الموارد البشرية",
    "Attendance": "الحضور",
    "Payroll": "الرواتب",
    "Recruitment": "التوظيف",
    "Documents": "المستندات",
    "Settings": "الإعدادات",
    "Analytics": "التحليلات",
    "Assets": "الأصول",
    "Configuration": "التكوين",
    "Disciplinary": "الجزاءات",
    "Engagement": "المشاركة",
    "Expenses": "المصروفات",
    "Leaves": "الإجازات",
    "Onboarding": "التهيئة",
    "Performance": "الأداء",
    "Self Service": "الخدمة الذاتية",
    "Tasks": "المهام",
    "Training": "التدريب",
    "Users": "المستخدمون",
  };

  const roleNamesAr: Record<string, string> = {
    "Super Admin": "مدير النظام العام",
    "HR Manager": "مدير الموارد البشرية",
    "Payroll Officer": "مسؤول الرواتب",
    "Recruiter": "مسؤول التوظيف",
    "Manager": "مدير إدارة",
    "Employee": "موظف",
  };

  const branchNamesAr: Record<string, string> = {
    "All": "جميع الفروع",
    "Cairo HQ": "المقر الرئيسي - القاهرة",
    "Dubai": "فرع دبي",
    "Remote": "عن بعد",
  };

  const formatLastSeen = (val: string) => {
    if (lang !== "ar") return val;
    if (val.includes("2 min ago")) return "منذ دقيقتين";
    if (val.includes("18 min ago")) return "منذ 18 دقيقة";
    if (val.includes("1 h ago")) return "منذ ساعة";
    if (val.includes("3 h ago")) return "منذ 3 ساعات";
    if (val.includes("Yesterday")) return "أمس";
    return val;
  };

  const formatAction = (action: string) => {
    if (lang !== "ar") return action;
    if (action.includes("Exported June payroll register")) return "تصدير مسير رواتب شهر يونيو";
    if (action.includes("Updated role permissions")) return "تحديث صلاحيات دور مسؤول التوظيف";
    if (action.includes("Failed sign-in attempt")) return "محاولة تسجيل دخول فاشلة (3 مرات)";
    if (action.includes("Enabled IP restrictions")) return "تفعيل قيود IP لفرع الرياض";
    return action;
  };

  const formatWhen = (when: string) => {
    if (lang !== "ar") return when;
    if (when.includes("12 min ago")) return "منذ 12 دقيقة";
    if (when.includes("48 min ago")) return "منذ 48 دقيقة";
    if (when.includes("2 h ago")) return "منذ ساعتين";
    if (when.includes("Yesterday")) return "أمس";
    return when;
  };

  const handleExportUsers = () => {
    const headers = lang === "ar"
      ? ["الاسم", "البريد الإلكتروني", "الدور الوظيفي", "الفرع", "المصادقة الثنائية 2FA", "آخر ظهور", "الحالة"]
      : ["Name", "Email", "Role", "Branch", "2FA", "Last Seen", "Status"];

    const rows = users.map((u) => [
      u.name,
      u.email,
      lang === "ar" ? (roleNamesAr[u.role] || u.role) : u.role,
      lang === "ar" ? (branchNamesAr[u.branch] || u.branch) : u.branch,
      u.twoFactor ? (lang === "ar" ? "مفعل" : "Enabled") : (lang === "ar" ? "معطل" : "Disabled"),
      u.lastSeen,
      u.status,
    ]);

    downloadCsv(`StaffLink_Users_${new Date().toISOString().slice(0, 10)}.csv`, [headers, ...rows]);
    toast.success(lang === "ar" ? "تم تصدير قائمة المستخدمين إلى Excel بنجاح" : "Users list exported to Excel successfully");
  };

  return (
    <div className="space-y-6 pb-10">
      <PageHeader
        section={t("usersAndPermissions", "Users & Permissions")}
        title={t("accessControl", "Access control")}
        description={t("accessControlDesc", "Role-based access with a full audit trail across the platform.")}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExportUsers}
              className="border-brand-foreground/40 bg-transparent text-brand-foreground hover:bg-brand-foreground/10 hover:text-brand-foreground"
            >
              <FileSpreadsheet className="size-4 me-1.5 text-emerald-400" />
              <span>{lang === "ar" ? "تصدير إلى Excel" : "Export to Excel"}</span>
            </Button>
            <CreateUserDialog />
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard 
          label={t("activeUsers", "Active users")} 
          value="184" 
          delta={lang === "ar" ? "+9 هذا الشهر" : "+9 this month"} 
          icon={UsersIcon} 
          tone="brand" 
        />
        <StatCard 
          label={t("roles", "Roles")} 
          value="7" 
          delta={lang === "ar" ? "4 قوالب" : "4 templates"} 
          icon={ShieldCheck} 
          tone="info" 
        />
        <StatCard 
          label={t("twoFactorAdoption", "2FA adoption")} 
          value="82%" 
          delta="+6%" 
          icon={KeyRound} 
          tone="success" 
        />
        <StatCard 
          label={t("failedSignIns", "Failed sign-ins")} 
          value="14" 
          delta={lang === "ar" ? "آخر 24 ساعة" : "Last 24 h"} 
          trend="down" 
          icon={ShieldCheck} 
          tone="danger" 
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-[2.2fr_1fr]">
        <section className="surface-card overflow-hidden">
          <div className="border-b border-border p-4">
            <h2 className="text-sm font-semibold">{t("usersList", "Users")}</h2>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary">
                <TableRow>
                  <TableHead>{lang === "ar" ? "المستخدم" : "User"}</TableHead>
                  <TableHead>{t("role", "Role")}</TableHead>
                  <TableHead>{t("branch", "Branch")}</TableHead>
                  <TableHead>2FA</TableHead>
                  <TableHead>{t("lastSeen", "Last seen")}</TableHead>
                  <TableHead>{t("status", "Status")}</TableHead>
                  <TableHead className="w-[80px] text-end">{t("actions", "Actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.email}>
                    <TableCell>
                      <div className="flex min-w-0 items-center gap-3">
                        <Avatar className="size-8 shrink-0">
                          <AvatarFallback className="bg-brand/10 text-xs text-brand">
                            {u.name.split(" ").map((p) => p[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">{u.name}</p>
                          <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{lang === "ar" ? (roleNamesAr[u.role] || u.role) : u.role}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{lang === "ar" ? (branchNamesAr[u.branch] || u.branch) : u.branch}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={u.twoFactor ? "border-success/40 text-success" : "border-border text-muted-foreground"}>
                        {u.twoFactor ? (lang === "ar" ? "مفعل" : "Enabled") : (lang === "ar" ? "معطل" : "Off")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{formatLastSeen(u.lastSeen)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={u.status === "Active" ? "border-success/40 text-success" : "border-destructive/40 text-destructive"}>
                        {u.status === "Active" ? (lang === "ar" ? "نشط" : "Active") : (lang === "ar" ? "موقوف" : "Suspended")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-end">
                      <EditUserDialog user={u} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="surface-card p-5">
          <h2 className="text-sm font-semibold">{t("recentAccessLogs", "Recent access logs")}</h2>
          <ul className="mt-3 space-y-3">
            {accessLogs.map((l) => (
              <li key={l.action} className="rounded-xl border border-border p-3">
                <p className="text-sm font-medium">{l.user}</p>
                <p className="mt-0.5 text-sm text-muted-foreground leading-snug">{formatAction(l.action)}</p>
                <p className="mt-1 text-xs text-muted-foreground flex items-center justify-between">
                  <span dir="ltr" className="tabular-nums font-mono text-[11px] bg-muted/50 px-1.5 py-0.5 rounded">{l.ip}</span>
                  <span>{formatWhen(l.when)}</span>
                </p>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Permission Matrix moved to bottom in Full Width */}
      <section className="surface-card overflow-hidden w-full">
        <div className="border-b border-border p-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold">{t("permissionMatrix", "Permission matrix")}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {lang === "ar" ? "تحديد مستويات الوصول لكل دور وظيفي عبر جميع وحدات النظام" : "Configure granular module access permissions per role across the entire system"}
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary">
              <TableRow>
                <TableHead className="min-w-[150px] sticky ltr:left-0 rtl:right-0 bg-secondary z-10">{t("role", "Role")}</TableHead>
                {roleMatrix.modules.map((m) => (
                  <TableHead key={m} className="text-center px-3 min-w-[105px]">
                    {lang === "ar" ? (moduleNamesAr[m] || m) : m}
                  </TableHead>
                ))}
                <TableHead className="w-[80px] text-end sticky ltr:right-0 rtl:left-0 bg-secondary z-10">{t("actions", "Actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roleMatrix.roles.map((r) => (
                <TableRow key={r.role}>
                  <TableCell className="text-sm font-medium sticky ltr:left-0 rtl:right-0 bg-card z-10 shadow-sm">
                    {lang === "ar" ? (roleNamesAr[r.role] || r.role) : r.role}
                  </TableCell>
                  {r.access.map((a, i) => (
                    <TableCell key={roleMatrix.modules[i]} className="text-center px-2">
                      <span className={`inline-flex rounded-md px-2.5 py-0.5 text-xs font-medium ${accessStyles[a]}`}>
                        {accessLabel[a]}
                      </span>
                    </TableCell>
                  ))}
                  <TableCell className="text-end sticky ltr:right-0 rtl:left-0 bg-card z-10 shadow-sm">
                    <EditRoleDialog roleData={r} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
