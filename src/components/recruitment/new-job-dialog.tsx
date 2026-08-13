import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface NewJobDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const templates: Record<string, any> = {
  security: {
    titleEn: "Security Systems Engineer (CCTV / Access Control)",
    titleAr: "مهندس أنظمة أمنية (كاميرات مراقبة / تحكم في الوصول)",
    deptEn: "Technology",
    deptAr: "تقنية المعلومات",
    locEn: "Riyadh",
    locAr: "الرياض",
    employment: "Full-time",
    experience: "Senior",
    workmode: "On-site",
    minExp: "5",
    openings: "2",
    skills: "CCTV, Access Control, Networking, Troubleshooting",
    descEn: "We are looking for an experienced Security Systems Engineer to design, install, and maintain CCTV and access control systems.",
    descAr: "نحن نبحث عن مهندس أنظمة أمنية ذو خبرة لتصميم وتركيب وصيانة أنظمة كاميرات المراقبة والتحكم في الوصول.",
    respEn: "Design security systems\nInstall CCTV\nMaintain access control",
    respAr: "تصميم الأنظمة الأمنية\nتركيب كاميرات المراقبة\nصيانة أنظمة التحكم في الوصول",
    reqEn: "Bachelor's degree\n5+ years experience\nStrong networking skills",
    reqAr: "درجة البكالوريوس\nخبرة 5+ سنوات\nمهارات قوية في الشبكات",
  },
  network: {
    titleEn: "Network Engineer (ICT Infrastructure)",
    titleAr: "مهندس شبكات (بنية تحتية لتقنية المعلومات)",
    deptEn: "Technology",
    deptAr: "تقنية المعلومات",
    locEn: "Cairo HQ",
    locAr: "المقر الرئيسي في القاهرة",
    employment: "Full-time",
    experience: "Mid",
    workmode: "Hybrid",
    minExp: "3",
    openings: "1",
    skills: "Cisco, Routing, Switching, Firewalls",
    descEn: "Seeking a Network Engineer to manage and optimize our ICT infrastructure.",
    descAr: "نبحث عن مهندس شبكات لإدارة وتحسين البنية التحتية لتقنية المعلومات لدينا.",
    respEn: "Manage networks\nConfigure firewalls\nOptimize performance",
    respAr: "إدارة الشبكات\nتكوين جدران الحماية\nتحسين الأداء",
    reqEn: "CCNA/CCNP\n3+ years experience\nKnowledge of firewalls",
    reqAr: "شهادة CCNA/CCNP\nخبرة 3+ سنوات\nمعرفة بجدران الحماية",
  }
};

export function NewJobDialog({ open, onOpenChange }: NewJobDialogProps) {
  const [template, setTemplate] = useState("");
  
  const handleSave = () => {
    toast.success("Job posted successfully.");
    onOpenChange(false);
  };

  const currentTemplate = templates[template] || {};

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl flex max-h-[90vh] flex-col gap-0 p-0 sm:rounded-2xl">
        <DialogHeader className="px-6 py-5 border-b border-border">
          <DialogTitle className="text-xl">New job</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Prefill from template */}
            <div className="flex items-center gap-3 rounded-xl border border-border bg-surface/50 p-4">
              <Sparkles className="size-5 text-brand" />
              <Label htmlFor="template" className="shrink-0 text-muted-foreground font-medium">
                Prefill from template:
              </Label>
              <Select value={template} onValueChange={setTemplate}>
                <SelectTrigger id="template" className="h-10 bg-surface rounded-xl max-w-sm border-brand/30 ring-brand/20">
                  <SelectValue placeholder="Pick a template..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="security">Security Systems Engineer (CCTV / Access Control) — مهندس أنظمة أمنية (كاميرات مراقبة / تحكم في الوصول)</SelectItem>
                  <SelectItem value="network">Network Engineer (ICT Infrastructure) — مهندس شبكات (بنية تحتية لتقنية المعلومات)</SelectItem>
                  <SelectItem value="av">AV Solutions Engineer (Audio Visual) — مهندس حلول الصوتيات والمرئيات</SelectItem>
                  <SelectItem value="pm">Project Manager (Systems Integration) — مدير مشاريع (تكامل الأنظمة)</SelectItem>
                  <SelectItem value="presales">Pre-Sales / Sales Engineer — مهندس مبيعات / ما قبل البيع</SelectItem>
                  <SelectItem value="fullstack">Full-Stack Software Engineer — مهندس برمجيات متكامل</SelectItem>
                  <SelectItem value="datacenter">Data Center Engineer — مهندس مراكز بيانات</SelectItem>
                  <SelectItem value="hr">HR Specialist — أخصائي موارد بشرية</SelectItem>
                  <SelectItem value="accountant">Accountant — محاسب</SelectItem>
                  <SelectItem value="marketing">Digital Marketing Specialist — أخصائي تسويق رقمي</SelectItem>
                  <SelectItem value="support">Customer Support Engineer — مهندس دعم عملاء</SelectItem>
                  <SelectItem value="internship">Engineering Internship — تدريب هندسي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div key={template} className="space-y-6">
              {/* Title */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="title-en">Title (EN) <span className="text-destructive">*</span></Label>
                  <Input id="title-en" defaultValue={currentTemplate.titleEn} className="h-10 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="title-ar">Title (AR) <span className="text-destructive">*</span></Label>
                  <Input id="title-ar" defaultValue={currentTemplate.titleAr} className="h-10 rounded-xl text-right" dir="rtl" />
                </div>
              </div>

              {/* Department */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="dept-en">Department (EN) <span className="text-destructive">*</span></Label>
                  <Input id="dept-en" defaultValue={currentTemplate.deptEn} className="h-10 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="dept-ar">Department (AR) <span className="text-destructive">*</span></Label>
                  <Input id="dept-ar" defaultValue={currentTemplate.deptAr} className="h-10 rounded-xl text-right" dir="rtl" />
                </div>
              </div>

              {/* Location */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="loc-en">Location (EN)</Label>
                  <Input id="loc-en" defaultValue={currentTemplate.locEn} className="h-10 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="loc-ar">Location (AR)</Label>
                  <Input id="loc-ar" defaultValue={currentTemplate.locAr} className="h-10 rounded-xl text-right" dir="rtl" />
                </div>
              </div>

              {/* 3-column row 1 */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="employment">Employment type</Label>
                  <Select defaultValue={currentTemplate.employment || "Full-time"}>
                    <SelectTrigger id="employment" className="h-10 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-time">Full-time</SelectItem>
                      <SelectItem value="Part-time">Part-time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="experience">Experience level <span className="text-destructive">*</span></Label>
                  <Select defaultValue={currentTemplate.experience || "Mid"}>
                    <SelectTrigger id="experience" className="h-10 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entry">Entry</SelectItem>
                      <SelectItem value="Mid">Mid</SelectItem>
                      <SelectItem value="Senior">Senior</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="workmode">Work mode</Label>
                  <Select defaultValue={currentTemplate.workmode || "On-site"}>
                    <SelectTrigger id="workmode" className="h-10 rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="On-site">On-site</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                      <SelectItem value="Remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* 3-column row 2 */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="min-exp">Min. years experience</Label>
                  <Input id="min-exp" type="number" defaultValue={currentTemplate.minExp || "0"} className="h-10 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="openings">Openings <span className="text-destructive">*</span></Label>
                  <Input id="openings" type="number" defaultValue={currentTemplate.openings || "1"} className="h-10 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="deadline">Application deadline <span className="text-destructive">*</span></Label>
                  <Input id="deadline" type="date" defaultValue={currentTemplate.deadline} className="h-10 rounded-xl" />
                </div>
              </div>

              {/* 3-column row 3 */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-1.5">
                  <Label htmlFor="salary-min">Salary min</Label>
                  <Input id="salary-min" type="number" defaultValue={currentTemplate.salaryMin} className="h-10 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="salary-max">Salary max</Label>
                  <Input id="salary-max" type="number" defaultValue={currentTemplate.salaryMax} className="h-10 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" defaultValue={currentTemplate.currency || "USD"} className="h-10 rounded-xl" />
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-1.5">
                <Label htmlFor="skills">Skills (comma-separated)</Label>
                <Input id="skills" defaultValue={currentTemplate.skills} placeholder="React, TypeScript, SQL" className="h-10 rounded-xl" />
              </div>

              {/* Short descriptions */}
              <div className="space-y-1.5">
                <Label htmlFor="desc-en">Short description (EN) <span className="text-destructive">*</span></Label>
                <Textarea id="desc-en" defaultValue={currentTemplate.descEn} rows={3} className="rounded-xl" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="desc-ar">Short description (AR) <span className="text-destructive">*</span></Label>
                <Textarea id="desc-ar" defaultValue={currentTemplate.descAr} rows={3} className="rounded-xl text-right" dir="rtl" />
              </div>

              {/* Responsibilities */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="resp-en">Responsibilities (EN) <span className="text-destructive">*</span></Label>
                  <Textarea id="resp-en" defaultValue={currentTemplate.respEn} placeholder="One per line" rows={4} className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="resp-ar">Responsibilities (AR) <span className="text-destructive">*</span></Label>
                  <Textarea id="resp-ar" defaultValue={currentTemplate.respAr} rows={4} className="rounded-xl text-right" dir="rtl" />
                </div>
              </div>

              {/* Requirements */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="req-en">Requirements (EN) <span className="text-destructive">*</span></Label>
                  <Textarea id="req-en" defaultValue={currentTemplate.reqEn} placeholder="One per line" rows={4} className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="req-ar">Requirements (AR) <span className="text-destructive">*</span></Label>
                  <Textarea id="req-ar" defaultValue={currentTemplate.reqAr} rows={4} className="rounded-xl text-right" dir="rtl" />
                </div>
              </div>

              {/* Nice to have */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="nice-en">Nice to have (EN)</Label>
                  <Textarea id="nice-en" defaultValue={currentTemplate.niceEn} rows={3} className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="nice-ar">Nice to have (AR)</Label>
                  <Textarea id="nice-ar" defaultValue={currentTemplate.niceAr} rows={3} className="rounded-xl text-right" dir="rtl" />
                </div>
              </div>

              {/* Benefits */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="ben-en">Benefits (EN)</Label>
                  <Textarea id="ben-en" defaultValue={currentTemplate.benEn} rows={3} className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ben-ar">Benefits (AR)</Label>
                  <Textarea id="ben-ar" defaultValue={currentTemplate.benAr} rows={3} className="rounded-xl text-right" dir="rtl" />
                </div>
              </div>

              {/* Extra details */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label htmlFor="email">Apply email (optional)</Label>
                  <Input id="email" type="email" defaultValue={currentTemplate.email} placeholder="careers@company.com" className="h-10 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="sort">Sort order</Label>
                  <Input id="sort" type="number" defaultValue={currentTemplate.sort || "0"} className="h-10 rounded-xl" />
                </div>
              </div>

              {/* Visibility and Dates */}
              <div className="grid gap-4 sm:grid-cols-3 items-end">
                <div className="flex items-center h-10 space-x-2">
                  <Switch id="visible" defaultChecked />
                  <Label htmlFor="visible" className="font-medium">Visible publicly</Label>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="publish-date">Publish date</Label>
                  <Input id="publish-date" type="date" defaultValue={currentTemplate.publishDate} className="h-10 rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="end-date">End date</Label>
                  <Input id="end-date" type="date" defaultValue={currentTemplate.endDate} className="h-10 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex items-center justify-end gap-3 border-t border-border p-5">
          <Button variant="outline" className="h-10 px-6 rounded-xl" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button className="h-10 px-6 rounded-xl bg-slate-700 hover:bg-slate-800 text-white" onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
