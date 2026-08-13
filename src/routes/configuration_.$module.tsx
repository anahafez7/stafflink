import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download, Upload, Plus, Trash2, ChevronDown, Sparkles, Edit2, Globe2, Building2, MapPin, Radar, Users, Layers, Search, Mail, MessageSquare, Bell, Smartphone, FileArchive, Shield, Save, Eye } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { StatCard } from "@/components/layout/stat-card";
import { worksites } from "@/data/modules";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { configSections } from "./configuration";

export const Route = createFileRoute("/configuration_/$module")({
  component: ConfigurationModulePage,
});

function ConfigurationModulePage() {
  const { module } = Route.useParams();

  // Find which category the current module belongs to
  const currentSection = configSections.find(section =>
    section.items.some(item => item.href === `/configuration/${module}`)
  );

  const tabs = currentSection ? currentSection.items : [];

  // Title and description based on the section
  const title = currentSection ? currentSection.category : "Configuration";
  const description = currentSection ? currentSection.description : "Manage system parameters.";

  return (
    <div className="space-y-6 pb-10">
      <div className="flex items-center justify-between">
        <PageHeader
          section="Configuration"
          title={title}
          description={description}
        />
        <div className="flex items-center gap-3">
          {title === "Leave Management" && (
            <>
              <Badge variant="secondary" className="bg-amber-100/50 text-amber-900 border-amber-200">0 pending</Badge>
              <Button className="bg-red-600 hover:bg-red-700 text-white rounded-full px-6">Deduct Leaves</Button>
            </>
          )}
          <Button asChild variant="outline" className="border-border bg-transparent text-foreground hover:bg-accent rounded-full ml-2">
            <Link to="/configuration">
              <ArrowLeft className="size-4 mr-2" />
              <span>Back to Directory</span>
            </Link>
          </Button>
        </div>
      </div>

      {tabs.length > 0 && (
        <div className="flex flex-wrap items-center gap-1 bg-secondary/30 p-1.5 rounded-full w-fit">
          {tabs.map((tab) => {
            const tabModule = tab.href.split('/').pop() || "";
            return (
              <Link
                key={tab.title}
                to="/configuration/$module"
                params={{ module: tabModule }}
                className={cn(
                  "px-5 py-2 rounded-full text-[13px] font-medium transition-all",
                  module === tabModule
                    ? "bg-white text-foreground shadow-sm ring-1 ring-black/5"
                    : "text-muted-foreground hover:text-foreground hover:bg-black/5"
                )}
              >
                {tab.title}
              </Link>
            );
          })}
        </div>
      )}

      <div className="surface-card p-6 border rounded-xl">
        {module === "departments" && <DepartmentsModule />}
        {module === "positions" && <PositionsModule />}
        {module === "cities" && <CitiesModule />}
        {module === "balances" && <BalancesModule />}
        {module === "leave-types" && <LeaveTypesModule />}
        {module === "holidays" && <HolidaysModule />}
        {module === "holiday-types" && <HolidayTypesModule />}
        {module === "requests" && <RequestsModule />}
        {module === "geo-fencing" && <GeoFencingModule />}
        {module === "allowances" && <AllowancesModule />}
        {module === "targets-overtime" && <TargetsOvertimeModule />}
        {module === "kpis" && <KPIsModule />}
        {module === "shifts" && <ShiftsModule />}
        {module === "late-penalties" && <LatePenaltiesModule />}
        {module === "settings" && <SettingsModule />}

        {/* Fallback for generic modules */}
        {!["departments", "positions", "cities", "balances", "leave-types", "holidays", "holiday-types", "requests", "geo-fencing", "allowances", "targets-overtime", "kpis", "shifts", "late-penalties", "settings"].includes(module) && (
          <GenericModule moduleName={module} />
        )}
      </div>
    </div>
  );
}

function GenericModule({ moduleName }: { moduleName: string }) {
  const title = moduleName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const singular = title.endsWith("s") ? title.slice(0, -1) : title;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" className="rounded-full bg-surface text-foreground border-border">
          <Download className="mr-2 size-4" /> Download template
        </Button>
        <Button variant="outline" className="rounded-full bg-surface text-foreground border-border">
          <Upload className="mr-2 size-4" /> Import from Excel
        </Button>
        <span className="text-xs text-muted-foreground hidden lg:inline-block">.xlsx, .csv</span>
        
        <div className="h-6 w-px bg-border mx-1 hidden lg:block"></div>
        
        <Input placeholder="Name (EN)" className="max-w-[200px] rounded-full bg-secondary/50" />
        <Input placeholder="Name (AR)" className="max-w-[200px] rounded-full bg-secondary/50" />
        <Button className="rounded-full bg-[#f35b1d] text-white hover:bg-[#f35b1d]/90 px-8 flex-1 sm:flex-none">
          <Plus className="mr-2 size-4" /> Add {singular}
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Name (EN)</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-right">Name (AR)</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">Active</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { en: `Example ${singular} 1`, ar: `مثال ${singular} ١`, active: true },
            ].map((item, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{item.en}</TableCell>
                <TableCell className="font-medium text-right" dir="rtl">{item.ar}</TableCell>
                <TableCell className="text-center"><Badge variant="outline" className="border-success/30 text-success bg-success/10">Yes</Badge></TableCell>
                <TableCell><Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="size-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

// ... Organization modules ...

function DepartmentsModule() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" className="rounded-full bg-surface text-foreground border-border">
          <Download className="mr-2 size-4" /> Download template
        </Button>
        <Button variant="outline" className="rounded-full bg-surface text-foreground border-border">
          <Upload className="mr-2 size-4" /> Import from Excel
        </Button>
        
        <div className="h-6 w-px bg-border mx-1 hidden 2xl:block"></div>
        
        <Input placeholder="Name (EN)" className="max-w-[180px] rounded-full bg-secondary/50" />
        <Input placeholder="Name (AR)" className="max-w-[180px] rounded-full bg-secondary/50" />
        <div className="relative">
          <select className="h-9 w-[180px] appearance-none rounded-full border border-[#1b1b4a] text-sm px-4 focus:outline-none focus:ring-1 focus:ring-[#1b1b4a] bg-transparent">
            <option value="">Responsible person...</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        </div>
        <Button className="rounded-full bg-[#1b1b4a] text-white hover:bg-[#1b1b4a]/90 px-8">
          <Plus className="mr-2 size-4" /> Add
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Name (EN)</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-right">Name (AR)</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Responsible</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Active</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { en: "Human Resources", ar: "الموارد البشرية", resp: "Ahmed Hassan", active: true },
              { en: "Engineering", ar: "الهندسة", resp: "Sarah Kamel", active: true },
            ].map((dep, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{dep.en}</TableCell>
                <TableCell className="font-medium text-right" dir="rtl">{dep.ar}</TableCell>
                <TableCell>{dep.resp}</TableCell>
                <TableCell><Badge variant="outline" className="border-success/30 text-success bg-success/10">Yes</Badge></TableCell>
                <TableCell><Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="size-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function PositionsModule() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" className="rounded-full bg-surface text-foreground border-border">
          <Download className="mr-2 size-4" /> Download template
        </Button>
        <Button variant="outline" className="rounded-full bg-surface text-foreground border-border">
          <Upload className="mr-2 size-4" /> Import from Excel
        </Button>
        
        <div className="h-6 w-px bg-border mx-1 hidden lg:block"></div>
        
        <Input placeholder="Name (EN)" className="max-w-[200px] rounded-full bg-secondary/50" />
        <Input placeholder="Name (AR)" className="max-w-[200px] rounded-full bg-secondary/50" />
        <Button className="rounded-full bg-[#f35b1d] text-white hover:bg-[#f35b1d]/90 px-8 flex-1 sm:flex-none">
          <Plus className="mr-2 size-4" /> Add
        </Button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Name (EN)</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-right">Name (AR)</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Active</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { en: "Account Executive", ar: "مسؤول حسابات", active: true },
              { en: "Software Engineer", ar: "مهندس برمجيات", active: true },
            ].map((pos, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{pos.en}</TableCell>
                <TableCell className="font-medium text-right" dir="rtl">{pos.ar}</TableCell>
                <TableCell><Badge variant="outline" className="border-success/30 text-success bg-success/10">Yes</Badge></TableCell>
                <TableCell><Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="size-4" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function CitiesModule() {
  const alexDistricts = [
    { en: "Agami", ar: "العجمي" }, { en: "Borg El Arab", ar: "برج العرب" }, { en: "Gleem", ar: "جليم" },
    { en: "Louran", ar: "لوران" }, { en: "Miami", ar: "ميامي" }, { en: "Moharam Bek", ar: "محرم بك" },
    { en: "Montaza", ar: "المنتزه" }, { en: "Smouha", ar: "سموحة" }, { en: "Sporting", ar: "سبورتنج" }, { en: "Stanly", ar: "ستانلي" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" className="rounded-full bg-surface text-foreground border-border">
          <Download className="mr-2 size-4" /> Download template
        </Button>
        <Button variant="outline" className="rounded-full bg-surface text-foreground border-border">
          <Upload className="mr-2 size-4" /> Import from Excel
        </Button>
        
        <div className="h-6 w-px bg-border mx-1 hidden lg:block"></div>
        
        <Input placeholder="City (EN)" className="max-w-[200px] rounded-full bg-secondary/50" />
        <Input placeholder="City (AR)" className="max-w-[200px] rounded-full bg-secondary/50" />
        <Button className="rounded-full bg-[#f35b1d] text-white hover:bg-[#f35b1d]/90 px-8 flex-1 sm:flex-none">
          <Plus className="mr-2 size-4" /> Add City
        </Button>
      </div>
      <div className="rounded-xl border border-border p-5 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg text-foreground">Alexandria</h3>
            <p className="text-sm text-muted-foreground mt-1" dir="rtl">الإسكندرية</p>
          </div>
          <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="size-4" /></Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {alexDistricts.map((d, i) => (
            <div key={i} className="flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-sm">
              <span className="font-medium text-foreground">{d.en}</span>
              <span className="text-muted-foreground text-xs" dir="rtl">({d.ar})</span>
              <button className="ml-1 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="size-3" /></button>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <Input placeholder="District (EN)" className="max-w-[200px] rounded-full bg-surface" />
          <Input placeholder="District (AR)" className="max-w-[200px] rounded-full bg-surface" />
          <Button className="rounded-full bg-zinc-900 text-white hover:bg-zinc-800 px-8 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
            Add district
          </Button>
        </div>
      </div>
    </div>
  );
}

// ... Leave Management modules ...

function BalancesModule() {
  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground flex items-center">
        <span className="mr-2 text-foreground font-mono">📄</span>
        Annual allowance per employee - auto-seeded on hire and on new leave types.
      </p>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Input placeholder="Search employee name or ID..." className="max-w-[240px] rounded-full bg-surface" />
          <div className="relative">
            <select className="h-9 w-[180px] appearance-none rounded-full border border-border text-sm px-4 focus:outline-none focus:ring-1 focus:ring-border bg-surface">
              <option>All leave types</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative">
            <select className="h-9 w-[120px] appearance-none rounded-full border border-border text-sm px-4 focus:outline-none focus:ring-1 focus:ring-border bg-surface">
              <option>50 / page</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" className="rounded-full bg-[#f6d7b8] text-[#f35b1d] hover:bg-[#f6d7b8]/80">
            Bulk edit
          </Button>
          <Button variant="outline" className="rounded-full bg-surface border-border text-foreground">
            <Download className="mr-2 size-4" /> Export CSV
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Employee</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Leave Type</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">Year</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">Total</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">Used</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">Remaining</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { name: "Hafez Rahim", type: "Annual leaves" },
              { name: "Abd Elsamea Hisham Abd Elsamea Anwar", type: "Annual Leave" },
              { name: "Shawky Mohamed Shawky Mahmoud", type: "Annual Leave" },
              { name: "Ayman Mansour kraany Ahmed", type: "Annual Leave" },
              { name: "Sayed Magdy Ahmed Mahmoud", type: "Annual Leave" },
              { name: "Mina Youssef Soliman Gerges", type: "Annual Leave" },
            ].map((emp, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Checkbox className="rounded-sm border-muted-foreground/30" />
                </TableCell>
                <TableCell className="font-medium">{emp.name}</TableCell>
                <TableCell className="text-muted-foreground">{emp.type}</TableCell>
                <TableCell className="text-center">2026</TableCell>
                <TableCell className="text-center">21</TableCell>
                <TableCell className="text-center">0</TableCell>
                <TableCell className="text-center text-emerald-500 font-medium">21</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 rounded-full bg-secondary/50 text-xs">
                    <Edit2 className="size-3 mr-1" /> Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function LeaveTypesModule() {
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <Input placeholder="Name" className="max-w-[260px] rounded-full bg-secondary/50" />
        <Input type="number" placeholder="0" className="max-w-[120px] rounded-full bg-secondary/50" />

        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
          <Checkbox className="rounded-sm border-brand text-brand" defaultChecked />
          Paid
        </label>

        <label className="flex items-center gap-2 text-sm font-medium cursor-pointer ml-4">
          <Checkbox className="rounded-sm border-muted-foreground/50" />
          Requires proof
        </label>

        <div className="flex-1"></div>
        <Button className="rounded-full bg-[#f35b1d] text-white hover:bg-[#f35b1d]/90 px-10">
          Add
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Name</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">Annual Days</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">Paid</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">Requires Proof</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">Active</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { name: "Annual Leave", days: 21, paid: true, proof: false, active: false },
              { name: "Annual Leave over 50", days: 30, paid: true, proof: false, active: false },
              { name: "Annual leaves", days: 21, paid: true, proof: false, active: true },
              { name: "Bereavement Leave", days: 5, paid: true, proof: false, active: false },
              { name: "Casual Leave", days: 7, paid: true, proof: false, active: false },
              { name: "Emergency Leave", days: 3, paid: true, proof: false, active: false },
            ].map((type, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{type.name}</TableCell>
                <TableCell className="text-center">{type.days}</TableCell>
                <TableCell className="text-center text-muted-foreground">{type.paid ? "Yes" : "No"}</TableCell>
                <TableCell className="text-center text-muted-foreground">{type.proof ? "Yes" : "No"}</TableCell>
                <TableCell className="text-center">
                  <span className={type.active ? "text-emerald-500" : "text-muted-foreground"}>{type.active ? "Yes" : "No"}</span>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="text-destructive"><Trash2 className="size-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function HolidaysModule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Holidays</h2>
          <p className="text-sm text-muted-foreground">Public, religious and national holidays</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-[#f35b1d] text-white hover:bg-[#f35b1d]/90 px-6">
              <Plus className="mr-2 size-4" /> Add holiday
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            {/* Modal content unchanged */}
            <DialogHeader>
              <DialogTitle>Add holiday</DialogTitle>
              <DialogDescription>
                Fill in holiday details. Conflicts with existing leaves are shown after saving.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Name</label>
                <Input className="rounded-xl border-[#f35b1d]/50 focus-visible:ring-[#f35b1d]" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Date</label>
                  <Input type="date" className="rounded-xl" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Type</label>
                  <div className="relative">
                    <select className="flex h-10 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none">
                      <option>Public</option>
                      <option>Company</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Country (optional)</label>
                <Input className="rounded-xl" />
              </div>
              <div className="flex items-center justify-between rounded-xl border p-4">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Recurring yearly</label>
                  <p className="text-sm text-muted-foreground">Repeats on the same date every year.</p>
                </div>
                <Switch />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Notes (optional)</label>
                <Textarea className="rounded-xl resize-none" />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:space-x-0">
              <DialogClose asChild>
                <Button variant="outline" className="rounded-full">Close</Button>
              </DialogClose>
              <Button className="rounded-full bg-[#f35b1d] text-white hover:bg-[#f35b1d]/90 px-6">Add holiday</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-xl border border-border p-5 bg-background mb-8">
        <h3 className="text-lg font-semibold text-foreground mb-1">Weekend configuration</h3>
        <p className="text-sm text-muted-foreground mb-4">Configure weekly off days per branch</p>
        <div className="flex flex-wrap gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => {
            const isWeekend = day === "Fri" || day === "Sat";
            return (
              <Button
                key={day}
                variant="outline"
                className={cn(
                  "rounded-full px-6 h-9 border-none transition-colors",
                  isWeekend 
                    ? "bg-[#f35b1d] text-white hover:bg-[#f35b1d]/90 hover:text-white" 
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                )}
              >
                {day}
              </Button>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-bold text-muted-foreground tracking-wider uppercase mb-4">Upcoming</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-border p-5 bg-surface hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-center size-10 rounded-full bg-[#fae8df] text-[#f35b1d] mb-4">
              <Sparkles className="size-5" />
            </div>
            <h4 className="text-lg font-bold text-foreground mb-2">Prophet Muhammad's Birthday</h4>
            <Badge variant="secondary" className="bg-[#fae8df] text-[#f35b1d] text-[10px] uppercase font-bold mb-4">Public</Badge>
            <p className="font-bold text-[#f35b1d] mb-1">26-08-2026</p>
            <p className="text-sm text-muted-foreground">Mawlid al-Nabi (approximate)</p>
          </div>

          <div className="rounded-2xl border border-border p-5 bg-surface hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-center size-10 rounded-full bg-[#fae8df] text-[#f35b1d] mb-4">
              <Sparkles className="size-5" />
            </div>
            <h4 className="text-lg font-bold text-foreground mb-2">Armed Forces Day</h4>
            <div className="flex gap-2 mb-4">
              <Badge variant="secondary" className="bg-[#fae8df] text-[#f35b1d] text-[10px] uppercase font-bold">Public</Badge>
              <span className="text-[10px] text-muted-foreground flex items-center">Recurring</span>
            </div>
            <p className="font-bold text-[#f35b1d] mb-1">06-10-2026</p>
            <p className="text-sm text-muted-foreground">Egyptian public holiday</p>
          </div>
        </div>
      </div>

      <div className="pt-4">
        <h3 className="text-xs font-bold text-muted-foreground tracking-wider uppercase mb-4">Past</h3>
        {/* Placeholder for past holidays */}
      </div>
    </div>
  );
}

function HolidayTypesModule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">Catalog of holiday categories used across the app.</p>
        <Button className="rounded-full bg-[#f35b1d] text-white hover:bg-[#f35b1d]/90 px-6">
          <Plus className="mr-2 size-4" /> Add type
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Name</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Color</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Paid</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Affects Attendance</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Description</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { name: "Company Holiday", hex: "#3B82F6", color: "bg-blue-500", paid: "Yes", affects: "Yes", desc: "Company-wide days off" },
              { name: "National Holiday", hex: "#EF4444", color: "bg-red-500", paid: "Yes", affects: "Yes", desc: "Official public holidays" },
              { name: "Personal Leave", hex: "#10B981", color: "bg-emerald-500", paid: "No", affects: "Yes", desc: "Personal/unpaid leave" },
              { name: "Religious Holiday", hex: "#8B5CF6", color: "bg-purple-500", paid: "Yes", affects: "Yes", desc: "Religious observances" },
            ].map((type, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{type.name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className={cn("size-3 rounded-full", type.color)}></div>
                    <span className="text-sm font-mono text-muted-foreground">{type.hex}</span>
                  </div>
                </TableCell>
                <TableCell>{type.paid}</TableCell>
                <TableCell>{type.affects}</TableCell>
                <TableCell className="text-muted-foreground">{type.desc}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full bg-secondary/50"><Edit2 className="size-3 text-muted-foreground" /></Button>
                    <Button variant="ghost" size="icon" className="h-7 w-7 rounded-full text-destructive"><Trash2 className="size-3" /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function RequestsModule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Leave Requests</h3>
          <p className="text-sm text-muted-foreground">Manage employee leave requests</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="rounded-full bg-[#f35b1d] text-white hover:bg-[#f35b1d]/90 px-6">
              <Plus className="mr-2 size-4" /> Add Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Leave Request</DialogTitle>
              <DialogDescription>
                Create a new leave request for an employee.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Employee</label>
                <div className="relative">
                  <select className="flex h-10 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none">
                    <option value="" disabled selected>Select employee</option>
                    <option>Ahmed Hassan</option>
                    <option>Sarah Kamel</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Leave Kind</label>
                <div className="relative">
                  <select className="flex h-10 w-full items-center justify-between rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none">
                    <option value="" disabled selected>Select leave type</option>
                    <option>Annual Leave</option>
                    <option>Sick Leave</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">From</label>
                  <Input type="date" className="rounded-xl" />
                </div>
                <div className="grid gap-2">
                  <label className="text-sm font-medium">To</label>
                  <Input type="date" className="rounded-xl" />
                </div>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Reason</label>
                <Textarea className="rounded-xl resize-none" placeholder="Enter reason for leave..." />
              </div>
            </div>
            <DialogFooter className="gap-2 sm:space-x-0">
              <DialogClose asChild>
                <Button variant="outline" className="rounded-full">Cancel</Button>
              </DialogClose>
              <Button className="rounded-full bg-[#f35b1d] text-white hover:bg-[#f35b1d]/90 px-6">Submit Request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Employee</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Leave Kind</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Duration</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Reason</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Status</TableHead>
              <TableHead className="text-right"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { emp: "Ahmed Hassan", kind: "Annual Leave", from: "15-08-2026", to: "18-08-2026", days: 4, reason: "Summer vacation", status: "Approved" },
              { emp: "Sarah Kamel", kind: "Sick Leave", from: "12-08-2026", to: "12-08-2026", days: 1, reason: "Doctor appointment", status: "Pending" },
              { emp: "Mina Youssef", kind: "Annual Leave", from: "01-09-2026", to: "05-09-2026", days: 5, reason: "Family trip", status: "Rejected" },
              { emp: "Hafez Rahim", kind: "Emergency Leave", from: "10-08-2026", to: "10-08-2026", days: 1, reason: "Personal matter", status: "Canceled" },
            ].map((req, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{req.emp}</TableCell>
                <TableCell>{req.kind}</TableCell>
                <TableCell>
                  <div className="text-sm">
                    {req.from} <span className="text-muted-foreground mx-1">to</span> {req.to}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {req.days} {req.days === 1 ? "day" : "days"}
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground truncate max-w-[200px]">{req.reason}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={cn(
                    "border-transparent font-medium",
                    req.status === "Approved" ? "bg-emerald-100 text-emerald-700" :
                    req.status === "Pending" ? "bg-amber-100 text-amber-700" :
                    req.status === "Rejected" ? "bg-red-100 text-red-700" :
                    "bg-gray-100 text-gray-700"
                  )}>
                    {req.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Edit2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function GeoFencingModule() {
  return (
    <div className="space-y-6">
      <div className="relative h-[400px] w-full rounded-2xl overflow-hidden border border-border bg-muted/20">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          marginHeight={0}
          marginWidth={0}
          src="https://www.openstreetmap.org/export/embed.html?bbox=29.8%2C29.9%2C31.5%2C30.2&amp;layer=mapnik&amp;marker=30.0355%2C31.2230"
          style={{ border: 0 }}
        />
        <div className="absolute top-4 left-4 right-4 flex items-start justify-between pointer-events-none">
          <div className="bg-background/95 backdrop-blur-sm px-4 py-2 rounded-full border border-border shadow-sm flex items-center gap-3 text-sm pointer-events-auto">
            <MapPin className="size-4 text-[#f35b1d]" />
            <span className="font-semibold">Egypt overview</span>
            <span className="text-muted-foreground">2 cities · 2 sites · 0 check-ins (7d)</span>
          </div>
          <div className="flex gap-2 pointer-events-auto">
            <Button variant="secondary" size="sm" className="rounded-full shadow-sm bg-background/95 backdrop-blur-sm border-border hover:bg-background">
              <span className="w-2 h-2 rounded-full bg-brand mr-2" /> Employees
            </Button>
            <Button variant="secondary" size="sm" className="rounded-full shadow-sm bg-background/95 backdrop-blur-sm border-border hover:bg-background">
              <span className="w-2 h-2 rounded-full bg-success mr-2" /> Sites
            </Button>
            <Button variant="secondary" size="sm" className="rounded-full shadow-sm bg-background/95 backdrop-blur-sm border-border hover:bg-background">
              <span className="w-2 h-2 rounded-full bg-warning mr-2" /> Check-ins
            </Button>
            <Button variant="secondary" size="sm" className="rounded-full shadow-sm bg-background/95 backdrop-blur-sm border-border hover:bg-background">
              Hide
            </Button>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Geo-Fencing</h2>
          <p className="text-sm text-muted-foreground">Approved locations and check-in radii</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full">
            <span className="mr-2">🔗</span> Employee Access
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-full">
                <Layers className="mr-2 size-4" /> Bulk assign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl p-0 overflow-hidden bg-background gap-0">
              <div className="p-6 pb-4">
                <DialogTitle className="text-xl font-bold">Bulk assign employees</DialogTitle>
                <DialogDescription className="text-muted-foreground mt-1">
                  Pick locations and employees, then apply to all combinations.
                </DialogDescription>
              </div>
              <div className="px-6 py-2 grid grid-cols-2 gap-6 bg-muted/5">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Locations · 0/2</span>
                    <button className="text-sm font-medium text-[#f35b1d] hover:underline">Select all</button>
                  </div>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                    <label className="flex items-start gap-3 p-4 rounded-xl border border-border bg-background cursor-pointer hover:border-[#f35b1d]/50 transition-colors">
                      <Checkbox className="mt-1" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">HQ</p>
                        <p className="text-xs text-muted-foreground font-mono">500m · 2 assigned</p>
                      </div>
                    </label>
                    <label className="flex items-start gap-3 p-4 rounded-xl border border-border bg-background cursor-pointer hover:border-[#f35b1d]/50 transition-colors">
                      <Checkbox className="mt-1" />
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Office</p>
                        <p className="text-xs text-muted-foreground font-mono">340m · 0 assigned</p>
                      </div>
                    </label>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Employees · 0/261</span>
                    <button className="text-sm font-medium text-[#f35b1d] hover:underline">Select all</button>
                  </div>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input placeholder="Search..." className="pl-9 bg-background rounded-full border-border/50" />
                  </div>
                  <div className="space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                    {[
                      { name: "Abanob Vector Samy Boss", id: "221077", dept: "Administration" },
                      { name: "Abd Elaziz Khaled Abd Elaziz Ali", id: "120606", dept: "Administration" },
                      { name: "Abd Elhamid Mohamed Mahmoud Salem", id: "120722", dept: "Administration" },
                      { name: "Abd Elrahman Abd Elnaser Zidan Ibrahem", id: "221064", dept: "Administration" },
                      { name: "Abd Elrahman Saber Hamed Abd Elmeonem", id: "121404", dept: "Administration" }
                    ].map((emp, i) => (
                      <label key={i} className="flex items-start gap-3 p-4 rounded-xl border border-border bg-background cursor-pointer hover:border-[#f35b1d]/50 transition-colors">
                        <Checkbox className="mt-1" />
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">{emp.name}</p>
                          <p className="text-xs text-muted-foreground">{emp.id} · {emp.dept}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 flex items-center justify-between border-t border-border/50 bg-background">
                <span className="text-sm text-muted-foreground">Will affect 0 assignments.</span>
                <div className="flex gap-3">
                  <Button variant="outline" className="rounded-full text-destructive border-destructive/20 hover:bg-destructive/10 hover:text-destructive px-6">
                    Remove
                  </Button>
                  <Button className="rounded-full bg-[#f35b1d] text-white hover:bg-[#f35b1d]/90 px-8">
                    Assign
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline" className="rounded-full">
            <Users className="mr-2 size-4" /> Assign employees
          </Button>
          <Button className="rounded-full bg-[#f35b1d] text-white hover:bg-[#f35b1d]/90 px-6">
            <Plus className="mr-2 size-4" /> Add location
          </Button>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="surface-card rounded-2xl border border-[#f35b1d]/30 overflow-hidden relative">
          <div className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="size-10 rounded-full bg-[#f35b1d]/10 flex items-center justify-center text-[#f35b1d]">
                  <MapPin className="size-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">HQ</h3>
                  <p className="text-sm text-muted-foreground mt-1">30.0355, 31.2230</p>
                  <p className="text-sm text-muted-foreground mt-0.5">2 · Employees</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-success/10 text-success hover:bg-success/20 border-0 rounded-full px-3">
                  ACTIVE
                </Badge>
                <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10 rounded-full h-8 w-8">
                  <Trash2 className="size-4" />
                </Button>
              </div>
            </div>
          </div>
          <div className="border-t border-border px-6 py-4 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Radius</span>
            <span className="font-medium">500 m</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#f35b1d]" />
        </div>
      </div>
    </div>
  );
}

function AllowancesModule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end mb-4">
        <Button className="rounded-full bg-[#f35b1d] text-white hover:bg-[#f35b1d]/90 px-6">
          <Plus className="mr-2 size-4" /> Add allowance
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Name</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Kind</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Amount</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Currency</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Taxable</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Active</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { name: "Fuel", kind: "per_km", amount: "2.5", currency: "EGP", taxable: "No", active: "Yes" },
              { name: "Housing", kind: "fixed", amount: "1500", currency: "EGP", taxable: "Yes", active: "Yes" },
              { name: "Meal", kind: "per_day", amount: "50", currency: "EGP", taxable: "No", active: "Yes" },
            ].map((allowance, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{allowance.name}</TableCell>
                <TableCell className="text-muted-foreground">{allowance.kind}</TableCell>
                <TableCell>{allowance.amount}</TableCell>
                <TableCell className="text-muted-foreground">{allowance.currency}</TableCell>
                <TableCell>{allowance.taxable}</TableCell>
                <TableCell>{allowance.active}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Edit2 className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function TargetsOvertimeModule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Targets & Overtime</h2>
          <p className="text-sm text-muted-foreground">Daily/weekly hour targets and overtime rates.</p>
        </div>
        <Button className="rounded-full bg-[#f35b1d] text-white hover:bg-[#f35b1d]/90 px-6">
          <Plus className="mr-2 size-4" /> Add policy
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Name</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Daily</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Weekly</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">OT Rate</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">OT Cap</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Active</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { name: "Part-Time", daily: "4h", weekly: "20h", otRate: "x1.25", otCap: "2h", active: "Yes" },
              { name: "Shift Workers", daily: "8h", weekly: "48h", otRate: "x2", otCap: "6h", active: "Yes" },
              { name: "Standard Full-Time", daily: "8h", weekly: "40h", otRate: "x1.5", otCap: "4h", active: "Yes" },
            ].map((policy, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{policy.name}</TableCell>
                <TableCell>{policy.daily}</TableCell>
                <TableCell>{policy.weekly}</TableCell>
                <TableCell>{policy.otRate}</TableCell>
                <TableCell>{policy.otCap}</TableCell>
                <TableCell>{policy.active}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Edit2 className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function KPIsModule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">KPIs</h2>
          <p className="text-sm text-muted-foreground">Performance indicators with targets and weights.</p>
        </div>
        <Button className="rounded-full bg-[#f35b1d] text-white hover:bg-[#f35b1d]/90 px-6">
          <Plus className="mr-2 size-4" /> Add KPI
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Name</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Metric</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">Target</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">Unit</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">Period</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">Weight</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">Active</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { name: "Attendance Rate", metric: "attendance_pct", target: "95", unit: "%", period: "monthly", weight: "2", active: "Yes" },
              { name: "Customer Satisfaction", metric: "csat_score", target: "4.5", unit: "/5", period: "quarterly", weight: "1.5", active: "Yes" },
              { name: "Punctuality", metric: "on_time_pct", target: "90", unit: "%", period: "monthly", weight: "1.5", active: "Yes" },
              { name: "Task Completion", metric: "tasks_done", target: "20", unit: "tasks", period: "monthly", weight: "1", active: "Yes" },
            ].map((kpi, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{kpi.name}</TableCell>
                <TableCell>{kpi.metric}</TableCell>
                <TableCell className="text-center">{kpi.target}</TableCell>
                <TableCell className="text-center">{kpi.unit}</TableCell>
                <TableCell className="text-center">{kpi.period}</TableCell>
                <TableCell className="text-center">{kpi.weight}</TableCell>
                <TableCell className="text-center">{kpi.active}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Edit2 className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ShiftsModule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Shifts</h2>
          <p className="text-sm text-muted-foreground">Manage work shifts and grace periods</p>
        </div>
        <Button className="rounded-full bg-[#f35b1d] text-white hover:bg-[#f35b1d]/90 px-6">
          <Plus className="mr-2 size-4" /> Add shift
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">Name</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">Start</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">End</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">Grace</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">Overnight</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">Active</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { name: "Evening", start: "02:00 PM", end: "10:00 PM", grace: "10m", overnight: "No", active: "Yes" },
              { name: "Flexible", start: "10:00 AM", end: "06:00 PM", grace: "30m", overnight: "No", active: "Yes" },
              { name: "Morning", start: "09:00 AM", end: "05:00 PM", grace: "10m", overnight: "No", active: "Yes" },
              { name: "Night", start: "10:00 PM", end: "06:00 AM", grace: "15m", overnight: "Yes", active: "Yes" },
            ].map((shift, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium text-center">{shift.name}</TableCell>
                <TableCell className="text-center">{shift.start}</TableCell>
                <TableCell className="text-center">{shift.end}</TableCell>
                <TableCell className="text-center">{shift.grace}</TableCell>
                <TableCell className="text-center">{shift.overnight}</TableCell>
                <TableCell className="text-center">{shift.active}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Edit2 className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function LatePenaltiesModule() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Late penalties</h2>
          <p className="text-sm text-muted-foreground">Rules applied when employees arrive late.</p>
        </div>
        <Button className="rounded-full bg-[#f35b1d] text-white hover:bg-[#f35b1d]/90 px-6">
          <Plus className="mr-2 size-4" /> Add rule
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <Table>
          <TableHeader className="bg-secondary/40">
            <TableRow>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Name</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">From</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">To</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Penalty</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">Value</TableHead>
              <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-center">Active</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { name: "Warning", from: "1m", to: "15m", penalty: "Warning only", value: "0", active: "Yes" },
              { name: "Minor Deduction", from: "16m", to: "30m", penalty: "Deduct amount", value: "25", active: "Yes" },
              { name: "Major Deduction", from: "31m", to: "60m", penalty: "Deduct amount", value: "75", active: "Yes" },
              { name: "Half-Day Deduction", from: "61m", to: "240m", penalty: "Deduct minutes", value: "240", active: "Yes" },
            ].map((rule, i) => (
              <TableRow key={i}>
                <TableCell className="font-medium">{rule.name}</TableCell>
                <TableCell className="text-center">{rule.from}</TableCell>
                <TableCell className="text-center">{rule.to}</TableCell>
                <TableCell>{rule.penalty}</TableCell>
                <TableCell className="text-center">{rule.value}</TableCell>
                <TableCell className="text-center">{rule.active}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <Edit2 className="size-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function SettingsModule() {
  return (
    <div className="space-y-6">
      <div className="flex gap-2 border-b border-border pb-4 overflow-x-auto custom-scrollbar">
        <Button variant="ghost" className="rounded-full text-muted-foreground font-medium bg-background border border-border">
          <Mail className="mr-2 size-4" /> SMTP / Email
        </Button>
        <Button className="rounded-full bg-[#f35b1d] text-white hover:bg-[#f35b1d]/90 shadow-sm font-medium">
          <MessageSquare className="mr-2 size-4" /> SMS / OTP
        </Button>
        <Button variant="ghost" className="rounded-full text-muted-foreground font-medium bg-background border border-border">
          <Bell className="mr-2 size-4" /> Notifications
        </Button>
        <Button variant="ghost" className="rounded-full text-muted-foreground font-medium bg-background border border-border">
          <Smartphone className="mr-2 size-4" /> Push Notifications
        </Button>
        <Button variant="ghost" className="rounded-full text-muted-foreground font-medium bg-background border border-border">
          <FileArchive className="mr-2 size-4" /> Auto Exports
        </Button>
        <Button variant="ghost" className="rounded-full text-muted-foreground font-medium bg-background border border-border">
          <Shield className="mr-2 size-4" /> Security
        </Button>
      </div>

      <div className="surface-card rounded-2xl border border-border p-6 space-y-6">
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          ePush HTTP API (https://api.epusheg.com/api/v2/send_bulk). Credentials (password + API key) are stored securely server-side and never returned to the browser. Mobile numbers must be in 201XXXXXXXXX or 01XXXXXXXXX format. OTP sends are rate-limited to 1 every 60 seconds and 5 per hour per number.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Environment</label>
            <div className="relative">
              <select className="flex h-10 w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none">
                <option>Live (2)</option>
                <option>Sandbox</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Default Language</label>
            <div className="relative">
              <select className="flex h-10 w-full items-center justify-between rounded-xl border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none">
                <option>English (2)</option>
                <option>Arabic</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Username</label>
            <Input defaultValue="integratedtechnics@epushagency.com" className="rounded-xl border-border bg-background" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password (Stored - Leave blank to keep)</label>
            <div className="relative">
              <Input type="password" defaultValue="password123" className="rounded-xl border-border bg-background pr-10" />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <Eye className="size-4" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">API Key (Stored - Leave blank to keep)</label>
            <div className="relative">
              <Input type="password" defaultValue="****************" className="rounded-xl border-border bg-background pr-10" />
              <button className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                <Eye className="size-4" />
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">Stored encrypted at rest. The key is never sent back to the browser after saving.</p>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sender Token / ID</label>
            <Input defaultValue="int technic" className="rounded-xl border-border bg-background" />
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox defaultChecked className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 rounded" />
            <span className="text-sm font-medium">Enable SMS sending</span>
          </label>
        </div>

        <div className="pt-2">
          <Button className="rounded-full bg-[#f35b1d] text-white hover:bg-[#f35b1d]/90 font-medium px-6">
            <Save className="mr-2 size-4" /> Save changes
          </Button>
        </div>
      </div>
    </div>
  );
}
