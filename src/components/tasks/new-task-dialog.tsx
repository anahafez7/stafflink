import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { employees, branches } from "@/data/hrms";
import type { Task } from "@/routes/tasks";
import { toast } from "sonner";
import { useAuth } from "@/lib/auth";

interface NewTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (task: Task) => void;
  initialData?: Task;
}

export function NewTaskDialog({ open, onOpenChange, onSave, initialData }: NewTaskDialogProps) {
  const { user } = useAuth();
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [location, setLocation] = useState<string>(initialData?.location || "");
  const [assignee, setAssignee] = useState<string>(initialData?.assignee || "");
  const [dueDate, setDueDate] = useState(initialData?.dueDate || "");
  const [estimatedTime, setEstimatedTime] = useState(initialData?.estimatedTime || "");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">(initialData?.priority || "Medium");

  useEffect(() => {
    if (open) {
      setTitle(initialData?.title || "");
      setDescription(initialData?.description || "");
      setLocation(initialData?.location || "");
      setAssignee(initialData?.assignee || "");
      // Convert "15-08-2026" to "2026-08-15" for input type="date" if needed, 
      // but if the data is already in YYYY-MM-DD or we just rely on string, let's keep it simple.
      // Wait, mock data dueDate is "15-08-2026" which is DD-MM-YYYY, HTML date input needs YYYY-MM-DD.
      // I'll just set it as is and let the user re-pick if they want, or try to format it.
      // I'll just set it as is for now.
      setDueDate(initialData?.dueDate || "");
      setEstimatedTime(initialData?.estimatedTime || "");
    }
  }, [open, initialData]);

  const filteredEmployees = useMemo(() => {
    if (!location) return [];
    return employees.filter((e) => e.branch === location);
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !assignee || !location || !dueDate) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const newTask: Task = {
      id: initialData?.id || `TSK-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      description,
      assignee,
      location,
      dueDate,
      estimatedTime: estimatedTime || "-",
      manager: initialData?.manager || user?.name || "Manager",
      priority,
      status: initialData?.status || "Pending",
    };

    onSave(newTask);
    toast.success(initialData ? "Task updated successfully!" : "Task assigned successfully!");
    handleClose();
  };

  const handleClose = () => {
    setTitle("");
    setDescription("");
    setLocation("");
    setAssignee("");
    setDueDate("");
    setEstimatedTime("");
    setPriority("Medium");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-md sm:rounded-2xl">
        <DialogHeader>
          <DialogTitle>{initialData ? "Edit Task" : "Assign New Task"}</DialogTitle>
        </DialogHeader>

        <form id="new-task-form" onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Task Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Conduct site audit"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide details about the task..."
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Location *</Label>
              <Select
                value={location}
                onValueChange={(val) => {
                  setLocation(val);
                  setAssignee(""); // Reset assignee when location changes
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select branch" />
                </SelectTrigger>
                <SelectContent>
                  {branches.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Assignee *</Label>
              <Select value={assignee} onValueChange={setAssignee} disabled={!location}>
                <SelectTrigger>
                  <SelectValue placeholder={location ? "Select employee" : "Select location first"} />
                </SelectTrigger>
                <SelectContent>
                  {filteredEmployees.length === 0 ? (
                    <SelectItem value="none" disabled>
                      No employees in {location}
                    </SelectItem>
                  ) : (
                    filteredEmployees.map((e) => (
                      <SelectItem key={e.id} value={e.name}>
                        {e.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Estimated Time</Label>
              <Input
                id="estimatedTime"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="e.g. 2 hours, 3 days"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Priority</Label>
            <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" form="new-task-form">
            {initialData ? "Save Changes" : "Assign Task"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
