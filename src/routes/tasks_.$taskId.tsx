import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Clock, MapPin, Calendar, CheckCircle2, FileText, Download, Activity, MessageSquare, Target } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { NewTaskDialog } from "@/components/tasks/new-task-dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/tasks_/$taskId")({
  component: TaskDetailsPage,
});

const mockTasks = [
  {
    id: "TSK-001",
    title: "Quarterly Review Prep",
    description: "Prepare the slides for the Q3 performance review. Make sure to include the sales metrics from the last quarter.",
    assignee: "Yara Mansour",
    location: "Cairo HQ",
    dueDate: "10-08-2026",
    estimatedTime: "4 hours",
    manager: "Omar Saleh",
    priority: "High",
    status: "In Progress",
  },
  {
    id: "TSK-002",
    title: "Client Site Inspection",
    description: "Perform safety and quality inspection at the new site.",
    assignee: "Karim Fathy",
    location: "Alexandria",
    dueDate: "16-08-2026",
    estimatedTime: "2 days",
    manager: "Aisha Hassan",
    priority: "Medium",
    status: "Pending",
  },
  {
    id: "TSK-003",
    title: "Update Payroll Records",
    description: "Ensure all new hires from last week are on the payroll. Verify bank account details.",
    assignee: "Mai Gaber",
    location: "Cairo HQ",
    dueDate: "18-08-2026",
    estimatedTime: "1.5 hours",
    manager: "Omar Saleh",
    priority: "Low",
    status: "Done",
  },
];

function TaskDetailsPage() {
  const { taskId } = useParams({ from: "/tasks_/$taskId" });
  
  // Find task or use a default one if not found (e.g. for newly created ones that aren't in mock data yet)
  const [task, setTask] = useState<any>(mockTasks.find((t) => t.id === taskId) || {
    id: taskId,
    title: "New Assigned Task",
    description: "Detailed description of the newly assigned task goes here.",
    assignee: "Employee Name",
    location: "Location",
    dueDate: "dd/mm/yyyy",
    estimatedTime: "1 hour",
    manager: "Omar Saleh",
    priority: "Medium",
    status: "Pending",
  });

  const isOverdue = (() => {
    if (task.status === "Done" || task.status === "Canceled") return false;
    if (!task.dueDate) return false;
    
    let dateStr = task.dueDate;
    if (dateStr.includes("-")) {
      const parts = dateStr.split("-");
      if (parts.length === 3 && parts[2].length === 4) {
        dateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    } else if (dateStr.includes("/")) {
      const parts = dateStr.split("/");
      if (parts.length === 3 && parts[2].length === 4) {
        dateStr = `${parts[2]}-${parts[1]}-${parts[0]}`;
      }
    }
    
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return d < today;
  })();

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [status, setStatus] = useState(task.status);

  const handleSave = (updatedTask: any) => {
    setTask(updatedTask);
    setStatus(updatedTask.status);
    setEditDialogOpen(false);
  };

  const statusStyles: Record<string, string> = {
    "Pending": "border-border text-muted-foreground",
    "In Progress": "border-primary/40 text-primary",
    "Done": "border-success/40 text-success",
    "Delayed": "border-warning/40 text-warning",
    "Canceled": "border-destructive/40 text-destructive",
  };

  return (
    <div className="space-y-5 pb-10">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" className="shrink-0" asChild>
          <Link to="/tasks">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-muted-foreground">Tasks</p>
          <h1 className="truncate text-xl font-semibold tracking-tight">{task.id}</h1>
        </div>
      </div>

      <PageHeader
        section="Task Details"
        title={
          <span className="flex items-center gap-3">
            {task.title}
            {isOverdue && (
              <Badge variant="destructive" className="bg-destructive/10 text-destructive border-transparent text-sm">
                Overdue
              </Badge>
            )}
          </span>
        }
        description="Manage task details and track current progress."
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" className="bg-white text-slate-900 hover:bg-white/90" onClick={() => setEditDialogOpen(true)}>
              Edit task
            </Button>
            <Button 
              variant="secondary" 
              className="bg-white text-slate-900 hover:bg-white/90"
              onClick={() => {
                setStatus("Done");
                setTask({ ...task, status: "Done" });
              }}
            >
              Complete task
            </Button>
          </div>
        }
      />

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <section className="surface-card p-5">
            <h2 className="text-sm font-semibold mb-4">Description</h2>
            <p className="text-sm text-foreground/90 whitespace-pre-wrap">{task.description}</p>
          </section>

          <section className="surface-card p-5">
            <h2 className="text-sm font-semibold mb-4">Task Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5"><MapPin className="size-3" /> Location</span>
                <p className="text-sm font-medium">{task.location}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Calendar className="size-3" /> Due Date</span>
                <p className="text-sm font-medium">{task.dueDate}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Clock className="size-3" /> Estimated Time</span>
                <p className="text-sm font-medium">{task.estimatedTime}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5"><CheckCircle2 className="size-3" /> Status</span>
                <Select 
                  value={status} 
                  onValueChange={(val) => {
                    setStatus(val);
                    setTask({ ...task, status: val });
                  }}
                >
                  <SelectTrigger className="h-8 mt-1 text-sm border-0 bg-secondary/50 focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Done">Done</SelectItem>
                    <SelectItem value="Delayed">Delayed</SelectItem>
                    <SelectItem value="Canceled">Canceled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <span className="text-xs text-muted-foreground flex items-center gap-1.5"><Target className="size-3" /> Priority</span>
                <Select 
                  value={task.priority} 
                  onValueChange={(val: any) => {
                    setTask({ ...task, priority: val });
                  }}
                >
                  <SelectTrigger className="h-8 mt-1 text-sm border-0 bg-secondary/50 focus:ring-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <section className="surface-card p-5">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Activity className="size-4" /> Activity Timeline
            </h2>
            <div className="space-y-4 border-l-2 border-border ml-2 pl-4">
              <div className="relative">
                <span className="absolute -left-[21px] top-1 size-2.5 rounded-full ring-4 ring-surface bg-brand" />
                <p className="text-sm font-medium">Task assigned</p>
                <p className="text-xs text-muted-foreground mt-0.5">by Manager • Aug 12, 10:30 AM</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-1 size-2.5 rounded-full ring-4 ring-surface bg-secondary" />
                <p className="text-sm font-medium">Status changed to In Progress</p>
                <p className="text-xs text-muted-foreground mt-0.5">by {task.assignee} • Aug 13, 09:15 AM</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[21px] top-1 size-2.5 rounded-full ring-4 ring-surface bg-secondary" />
                <p className="text-sm font-medium flex items-center gap-1.5">
                  <MessageSquare className="size-3" /> Note added
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">"Started working on the initial draft." • Aug 13, 02:00 PM</p>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-5">
          <section className="surface-card p-5">
            <h2 className="text-sm font-semibold mb-4">Assignee</h2>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-border">
              <Avatar className="size-10">
                <AvatarFallback className="bg-brand/10 text-brand">
                  {task.assignee.split(" ").map((p: string) => p[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{task.assignee}</p>
                <p className="text-xs text-muted-foreground">{task.location}</p>
              </div>
            </div>
          </section>

          <section className="surface-card p-5">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <FileText className="size-4" /> Attached Docs
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-8 rounded bg-brand/10 text-brand flex items-center justify-center shrink-0">
                    <FileText className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">requirements_v2.pdf</p>
                    <p className="text-xs text-muted-foreground">1.2 MB</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8">
                  <Download className="size-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="size-8 rounded bg-success/10 text-success flex items-center justify-center shrink-0">
                    <FileText className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">site_layout.xlsx</p>
                    <p className="text-xs text-muted-foreground">45 KB</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="shrink-0 h-8 w-8">
                  <Download className="size-4" />
                </Button>
              </div>
              <Button variant="outline" className="w-full text-xs h-8 mt-2 border-dashed">
                + Upload document
              </Button>
            </div>
          </section>
        </div>
      </div>

      <NewTaskDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        initialData={task}
        onSave={handleSave}
      />
    </div>
  );
}
