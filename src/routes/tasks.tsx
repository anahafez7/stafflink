import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, CheckCircle2, Clock, Circle, XCircle, AlertCircle } from "lucide-react";

import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NewTaskDialog } from "@/components/tasks/new-task-dialog";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Tasks — StaffLink HRMS" },
      { name: "description", content: "Assign and track tasks for your team." },
    ],
  }),
  component: TasksPage,
});

export type Task = {
  id: string;
  title: string;
  description: string;
  assignee: string;
  location: string;
  dueDate: string;
  estimatedTime: string;
  manager: string;
  priority: "Low" | "Medium" | "High";
  status: "Pending" | "In Progress" | "Done" | "Delayed" | "Canceled";
};

const initialTasks: Task[] = [
  {
    id: "TSK-001",
    title: "Quarterly Review Prep",
    description: "Prepare the slides for the Q3 performance review.",
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
    description: "Ensure all new hires from last week are on the payroll.",
    assignee: "Mai Gaber",
    location: "Cairo HQ",
    dueDate: "18-08-2026",
    estimatedTime: "1.5 hours",
    manager: "Omar Saleh",
    priority: "Low",
    status: "Done",
  },
];

const statusStyles: Record<string, string> = {
  "Pending": "border-border text-muted-foreground",
  "In Progress": "border-primary/40 text-primary",
  "Done": "border-success/40 text-success",
  "Delayed": "border-warning/40 text-warning",
  "Canceled": "border-destructive/40 text-destructive",
};

const statusIcons: Record<string, any> = {
  "Pending": Circle,
  "In Progress": Clock,
  "Done": CheckCircle2,
  "Delayed": AlertCircle,
  "Canceled": XCircle,
};

function TasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        section="Workspace"
        title="Tasks"
        description="Assign and track tasks for your team across different locations."
        actions={
          <Button variant="secondary" onClick={() => setDialogOpen(true)}>
            <Plus className="size-4" />
            <span>New task</span>
          </Button>
        }
      />

      <section className="surface-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-secondary/40">
              <TableRow>
                <TableHead className="w-10"></TableHead>
                <TableHead>Task</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Manager</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Est. Time</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-muted-foreground">
                    No tasks found.
                  </TableCell>
                </TableRow>
              ) : null}
              {tasks.map((task) => {
                const StatusIcon = statusIcons[task.status];
                return (
                  <TableRow 
                    key={task.id} 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => navigate({ to: "/tasks/$taskId", params: { taskId: task.id } })}
                  >
                    <TableCell>
                      <StatusIcon className="size-4 text-muted-foreground" />
                    </TableCell>
                    <TableCell>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{task.title}</p>
                        <p className="truncate text-xs text-muted-foreground">{task.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                          <AvatarFallback className="bg-brand/10 text-[10px] text-brand">
                            {task.assignee.split(" ").map(p => p[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{task.assignee}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{task.location}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-6">
                          <AvatarFallback className="bg-secondary text-[10px]">
                            {task.manager.split(" ").map((p: string) => p[0]).join("")}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{task.manager}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`
                        ${task.priority === "High" ? "border-destructive text-destructive" : ""}
                        ${task.priority === "Medium" ? "border-warning text-warning" : ""}
                        ${task.priority === "Low" ? "border-success text-success" : ""}
                      `}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{task.estimatedTime}</TableCell>
                    <TableCell className="text-sm">{task.dueDate}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={statusStyles[task.status]}>
                        {task.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </section>

      <NewTaskDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleAddTask}
      />
    </div>
  );
}
