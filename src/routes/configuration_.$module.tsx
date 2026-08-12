import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Download, Upload, Plus, Trash2, ChevronDown, Sparkles, Edit2, Globe2, Building2, MapPin, Radar } from "lucide-react";
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
        {module === "locations" && <LocationsModule />}

        {/* Fallback for generic modules */}
        {!["departments", "positions", "cities", "balances", "leave-types", "holidays", "holiday-types", "requests", "locations"].includes(module) && (
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

function LocationsModule() {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Countries" value="3" delta="EG · AE · SA" icon={Globe2} tone="brand" />
        <StatCard label="Branches" value="6" delta="+1 this year" icon={Building2} tone="info" />
        <StatCard label="Worksites" value="14" delta="2 in setup" icon={MapPin} tone="success" />
        <StatCard label="Active geofences" value="11" delta="98% punch accuracy" icon={Radar} tone="warning" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_1.4fr]">
        <section className="surface-card p-5 border border-border rounded-xl">
          <h2 className="text-sm font-semibold">Coverage map</h2>
          <div className="mt-4 space-y-3">
            {worksites.map((w) => (
              <div key={w.name} className="flex items-start gap-3 rounded-xl border border-border p-3">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-brand/10 text-brand">
                  <MapPin className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{w.name}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {w.city} · {w.coords}
                  </p>
                </div>
                <Badge variant="outline" className={w.geofence ? "border-success/40 text-success" : "border-border text-muted-foreground"}>
                  {w.geofence ? "Geofenced" : "Open"}
                </Badge>
              </div>
            ))}
          </div>
        </section>

        <section className="surface-card border border-border rounded-xl overflow-hidden">
          <div className="border-b border-border p-4 flex items-center justify-between">
            <h2 className="text-sm font-semibold">Worksites & radius rules</h2>
            <Button variant="secondary" size="sm" className="h-8">
              <Plus className="size-3 mr-1" /> Add worksite
            </Button>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-secondary/40">
                <TableRow>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Worksite</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase">City</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Employees</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase">Radius</TableHead>
                  <TableHead className="text-xs font-semibold text-muted-foreground uppercase">GPS</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {worksites.map((w) => (
                  <TableRow key={w.name}>
                    <TableCell className="text-sm font-medium">{w.name}</TableCell>
                    <TableCell className="text-sm">{w.city}</TableCell>
                    <TableCell className="text-sm tabular-nums">{w.employees}</TableCell>
                    <TableCell className="text-sm tabular-nums">{w.radius}</TableCell>
                    <TableCell className="text-sm tabular-nums text-muted-foreground">{w.coords}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </div>
  );
}
