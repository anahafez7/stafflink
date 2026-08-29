import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  Clock,
  Fingerprint,
  MapPin,
  UserCheck,
  UserX,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Upload,
} from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { attendanceWeek } from "@/data/hrms";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/attendance")({
  head: () => ({
    meta: [
      { title: "Attendance — StaffLink" },
      {
        name: "description",
        content:
          "Live attendance, shifts, geofencing, overtime rules and correction approvals across every branch.",
      },
      { property: "og:title", content: "Attendance — StaffLink" },
      {
        property: "og:description",
        content: "Live attendance, shifts, geofencing and overtime approvals.",
      },
    ],
  }),
  component: AttendancePage,
});

type PunchRecord = {
  id: string;
  name: string;
  nameEn: string;
  checkIn: string;
  checkOut: string;
  hours: string;
  method: string;
  site: string;
  state: "On time" | "Late" | "في الموعد" | "متأخر";
  isCorrection?: boolean;
};

const initialLiveData: PunchRecord[] = [
  { 
    id: "p1",
    name: "يارا منصور", 
    nameEn: "Yara Mansour", 
    checkIn: "08:42", 
    checkOut: "17:05", 
    hours: "8h 23m", 
    method: "Face ID", 
    site: "Cairo HQ", 
    state: "On time" 
  },
  { 
    id: "p2",
    name: "عمر خليل", 
    nameEn: "Omar Khalil", 
    checkIn: "09:07", 
    checkOut: "17:30", 
    hours: "8h 23m", 
    method: "Fingerprint", 
    site: "Cairo HQ", 
    state: "Late" 
  },
  { 
    id: "p3",
    name: "كريم فتحي", 
    nameEn: "Karim Fathy", 
    checkIn: "07:55", 
    checkOut: "16:00", 
    hours: "8h 05m", 
    method: "GPS", 
    site: "Alexandria Yard", 
    state: "On time" 
  },
  { 
    id: "p4",
    name: "حسن راجح", 
    nameEn: "Hassan Rageh", 
    checkIn: "09:31", 
    checkOut: "18:15", 
    hours: "8h 44m", 
    method: "QR", 
    site: "Riyadh DC", 
    state: "Late" 
  },
  { 
    id: "p5",
    name: "زياد نور", 
    nameEn: "Ziad Nour", 
    checkIn: "08:12", 
    checkOut: "16:30", 
    hours: "8h 18m", 
    method: "Web", 
    site: "Remote", 
    state: "On time" 
  },
];

function AttendancePage() {
  const { t, lang } = useI18n();
  const [punches, setPunches] = useState<PunchRecord[]>(initialLiveData);
  const [correctionOpen, setCorrectionOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("2026-07-08");

  // Correction Form State
  const [employeeName, setEmployeeName] = useState("Yara Mansour");
  const [correctionType, setCorrectionType] = useState("missed_in");
  const [newCheckIn, setNewCheckIn] = useState("08:30");
  const [newCheckOut, setNewCheckOut] = useState("17:00");
  const [siteLocation, setSiteLocation] = useState("Cairo HQ");
  const [reason, setReason] = useState("");
  const [attachment, setAttachment] = useState<string | null>(null);

  // Export to Excel function (.csv with UTF-8 BOM)
  const handleExportExcel = () => {
    const headers = lang === "ar"
      ? ["المعرف", "اسم الموظف (عربي)", "اسم الموظف (إنجليزي)", "وقت الحضور", "وقت الانصراف", "ساعات العمل", "طريقة التسجيل", "موقع العمل", "الحالة", "التاريخ"]
      : ["ID", "Employee (Arabic)", "Employee (English)", "Check In", "Check Out", "Hours", "Method", "Location", "Status", "Date"];

    const rows = punches.map((p) => [
      p.id,
      `"${p.name}"`,
      `"${p.nameEn}"`,
      p.checkIn,
      p.checkOut,
      p.hours,
      `"${p.method}"`,
      `"${p.site}"`,
      p.state,
      selectedDate,
    ]);

    const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `StaffLink_Attendance_${selectedDate}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success(
      lang === "ar"
        ? "تم تصدير سجلات الحضور إلى ملف Excel بنجاح"
        : "Attendance records exported to Excel (.csv) successfully"
    );
  };

  // Submit Correction
  const handleSubmitCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) {
      toast.error(lang === "ar" ? "يرجى كتابة سبب طلب التصحيح" : "Please provide a reason for the correction");
      return;
    }

    const newRecord: PunchRecord = {
      id: `corr-${Date.now()}`,
      name: employeeName === "Yara Mansour" ? "يارا منصور" : employeeName,
      nameEn: employeeName,
      checkIn: newCheckIn,
      checkOut: newCheckOut,
      hours: "8h 30m",
      method: lang === "ar" ? "تصحيح إداري" : "Manual Correction",
      site: siteLocation,
      state: "On time",
      isCorrection: true,
    };

    setPunches((prev) => [newRecord, ...prev]);
    setCorrectionOpen(false);
    setReason("");
    setAttachment(null);

    toast.success(
      lang === "ar"
        ? `تم اعتماد طلب تصحيح البصمة للموظف (${employeeName}) بنجاح`
        : `Attendance correction for ${employeeName} submitted and approved!`
    );
  };

  return (
    <div className="space-y-5">
      <PageHeader
        section={t("attendance", "Attendance")}
        title={t("attendanceTitle", "Live attendance")}
        description={
          lang === "ar"
            ? "الأجهزة الذكية، النطاقات الجغرافية وقواعد المناوبات متزامنة عبر 6 مواقع عمل."
            : "Devices, geofences and shift rules synced across 6 worksites."
        }
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExportExcel}
              className="rounded-xl border-border bg-surface/80 hover:bg-surface shadow-xs transition-all"
            >
              <FileSpreadsheet className="size-4 me-1.5 text-emerald-600 dark:text-emerald-400" />
              <span>{lang === "ar" ? "تصدير إلى Excel" : "Export to Excel"}</span>
            </Button>

            <Button
              variant="secondary"
              onClick={() => setCorrectionOpen(true)}
              className="rounded-xl shadow-xs transition-all"
            >
              <PlusCircle className="size-4 me-1.5 text-brand" />
              <span>{lang === "ar" ? "طلب تصحيح بصمة" : "Attendance correction"}</span>
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label={lang === "ar" ? "سجلوا الحضور" : "Checked in"} value={String(1150 + punches.length)} icon={UserCheck} tone="success" />
        <StatCard label={t("late", "Late")} value="47" icon={Clock} tone="warning" />
        <StatCard label={lang === "ar" ? "الغياب اليوم" : "Absent"} value="42" icon={UserX} tone="danger" />
        <StatCard label={lang === "ar" ? "الأجهزة المتصلة" : "Devices online"} value="18 / 19" icon={Fingerprint} tone="brand" />
      </div>

      <div className="grid gap-4 xl:grid-cols-4 lg:grid-cols-3">
        <section className="surface-card p-5 xl:col-span-3 lg:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold">{lang === "ar" ? "سجل البصمات المباشر" : "Live punch feed"}</h2>
              <Badge variant="secondary" className="text-[11px] font-normal">
                {punches.length} {lang === "ar" ? "سجلات" : "records"}
              </Badge>
            </div>

            <div className="flex items-center gap-1.5">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 px-3 text-xs rounded-lg"
                onClick={() => {
                  setSelectedDate("2026-07-08");
                  toast.info(lang === "ar" ? "تم الانتقال إلى تاريخ اليوم" : "Reset to today's date");
                }}
              >
                {lang === "ar" ? "اليوم" : "Today"}
              </Button>
              <div className="flex items-center rounded-lg border border-border bg-background p-0.5 shadow-2xs">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  aria-label="Previous Day"
                  className="h-7 w-7 rounded-md text-muted-foreground"
                  onClick={() => toast.info(lang === "ar" ? "تم تحميل سجل اليوم السابق" : "Loaded previous day records")}
                >
                  <ChevronLeft className="size-3.5 rtl:rotate-180" />
                </Button>
                <span className="text-xs font-semibold px-2 min-w-[90px] whitespace-nowrap text-center tabular-nums">
                  {selectedDate}
                </span>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  aria-label="Next Day"
                  className="h-7 w-7 rounded-md text-muted-foreground"
                  onClick={() => toast.info(lang === "ar" ? "تم تحميل سجل اليوم التالي" : "Loaded next day records")}
                >
                  <ChevronRight className="size-3.5 rtl:rotate-180" />
                </Button>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto mt-4 rounded-xl border border-border">
            <Table>
              <TableHeader className="bg-secondary/40">
                <TableRow>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase">{lang === "ar" ? "الموظف" : "Employee"}</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase">{t("checkInTime", "Check in")}</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase">{t("checkOutTime", "Check out")}</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase">{lang === "ar" ? "الساعات" : "Hours"}</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase">{lang === "ar" ? "الموقع" : "Location"}</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase">{lang === "ar" ? "طريقة التسجيل" : "Method"}</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase">{t("status", "Status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {punches.map((p) => {
                  const empName = lang === "ar" ? p.name : p.nameEn;
                  const isLate = p.state === "Late" || p.state === "متأخر";
                  return (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <span>{empName}</span>
                          {p.isCorrection && (
                            <Badge variant="secondary" className="text-[10px] bg-primary/10 text-primary border-0 px-1.5 py-0">
                              {lang === "ar" ? "مُصحح" : "Corrected"}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium tabular-nums">{p.checkIn}</TableCell>
                      <TableCell className="font-medium tabular-nums text-muted-foreground">{p.checkOut}</TableCell>
                      <TableCell className="font-medium tabular-nums">{p.hours}</TableCell>
                      <TableCell className="text-muted-foreground text-xs">
                        <div className="flex items-center gap-1">
                          <MapPin className="size-3 shrink-0 text-muted-foreground" /> 
                          <span>{p.site}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-xs">{p.method}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            !isLate
                              ? "border-success/40 text-success bg-success/5"
                              : "border-warning/40 text-warning bg-warning/5"
                          }
                        >
                          {isLate ? (lang === "ar" ? "متأخر" : "Late") : (lang === "ar" ? "في الموعد" : "On time")}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </section>

        <section className="surface-card p-5 xl:col-span-1 lg:col-span-1">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">{lang === "ar" ? "نسب الحضور الأسبوعية" : "Weekly presence"}</h2>
            <span className="text-[11px] text-muted-foreground font-medium">92.8%</span>
          </div>
          <ul className="mt-4 space-y-2.5">
            {attendanceWeek.map((d) => (
              <li key={d.day}>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">{d.day}</span>
                  <span className="font-semibold tabular-nums">{d.present}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary transition-all duration-300" style={{ width: `${(d.present / 1244) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Interactive Attendance Correction Dialog */}
      <Dialog open={correctionOpen} onOpenChange={setCorrectionOpen}>
        <DialogContent className="sm:max-w-lg text-start">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="size-5 text-brand" />
              <span>{lang === "ar" ? "طلب تصحيح بصمة حضور" : "Attendance Correction Request"}</span>
            </DialogTitle>
            <DialogDescription>
              {lang === "ar"
                ? "قم بتعديل مواعيد البصمة المسجلة في حال وجود عطل في الجهاز أو نسيان تسجيل البصمة."
                : "Submit an adjusted punch time due to device malfunction or missed clock-in/out."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmitCorrection} className="space-y-4 pt-2">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="corr-employee">{lang === "ar" ? "الموظف" : "Employee"}</Label>
                <select
                  id="corr-employee"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs font-medium focus:ring-1 focus:ring-ring"
                >
                  <option value="Yara Mansour">يارا منصور (Yara Mansour)</option>
                  <option value="Omar Khalil">عمر خليل (Omar Khalil)</option>
                  <option value="Karim Fathy">كريم فتحي (Karim Fathy)</option>
                  <option value="Hassan Rageh">حسن راجح (Hassan Rageh)</option>
                  <option value="Ziad Nour">زياد نور (Ziad Nour)</option>
                  <option value="Nadia Farouk">نادية فاروق (Nadia Farouk)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="corr-type">{lang === "ar" ? "نوع التصحيح" : "Correction Type"}</Label>
                <select
                  id="corr-type"
                  value={correctionType}
                  onChange={(e) => setCorrectionType(e.target.value)}
                  className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs font-medium focus:ring-1 focus:ring-ring"
                >
                  <option value="missed_in">{lang === "ar" ? "نسيان تسجيل حضور" : "Missed Check-in"}</option>
                  <option value="missed_out">{lang === "ar" ? "نسيان تسجيل انصراف" : "Missed Check-out"}</option>
                  <option value="device_error">{lang === "ar" ? "عطل بجهاز البصمة" : "Device Error"}</option>
                  <option value="field_work">{lang === "ar" ? "مهمة عمل خارجية" : "External Mission / Field Work"}</option>
                </select>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="space-y-1.5">
                <Label htmlFor="corr-date">{lang === "ar" ? "التاريخ" : "Date"}</Label>
                <Input
                  id="corr-date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="h-10 rounded-xl"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="corr-in">{lang === "ar" ? "وقت الحضور" : "Check-in Time"}</Label>
                <Input
                  id="corr-in"
                  type="time"
                  value={newCheckIn}
                  onChange={(e) => setNewCheckIn(e.target.value)}
                  className="h-10 rounded-xl tabular-nums"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="corr-out">{lang === "ar" ? "وقت الانصراف" : "Check-out Time"}</Label>
                <Input
                  id="corr-out"
                  type="time"
                  value={newCheckOut}
                  onChange={(e) => setNewCheckOut(e.target.value)}
                  className="h-10 rounded-xl tabular-nums"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="corr-site">{lang === "ar" ? "موقع العمل" : "Worksite Location"}</Label>
              <select
                id="corr-site"
                value={siteLocation}
                onChange={(e) => setSiteLocation(e.target.value)}
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-xs font-medium focus:ring-1 focus:ring-ring"
              >
                <option value="Cairo HQ">المقر الرئيسي - القاهرة (Cairo HQ)</option>
                <option value="Alexandria Yard">فرع الإسكندرية (Alexandria Yard)</option>
                <option value="Riyadh DC">فرع الرياض (Riyadh DC)</option>
                <option value="Remote">عن بعد (Remote)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="corr-reason">{lang === "ar" ? "سبب وتفاصيل طلب التصحيح" : "Reason / Details"}</Label>
              <Textarea
                id="corr-reason"
                rows={3}
                placeholder={
                  lang === "ar"
                    ? "اكتب التبرير أو سبب عدم تسجيل البصمة بشكل طبيعي..."
                    : "Describe the reason or context for this attendance adjustment..."
                }
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="rounded-xl text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="corr-file">{lang === "ar" ? "إرفاق مستند داعم (اختياري)" : "Attachment (Optional)"}</Label>
              <Input
                id="corr-file"
                type="file"
                className="h-10 rounded-xl"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setAttachment(file.name);
                }}
              />
              {attachment && (
                <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                  <CheckCircle2 className="size-3.5 text-success" />
                  <span>{attachment}</span>
                </p>
              )}
            </div>

            <DialogFooter className="gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setCorrectionOpen(false)} className="rounded-xl">
                {lang === "ar" ? "إلغاء" : "Cancel"}
              </Button>
              <Button type="submit" className="rounded-xl">
                <CheckCircle2 className="size-4 me-1.5" />
                <span>{lang === "ar" ? "إرسال واعتماد التصحيح" : "Submit Correction"}</span>
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}