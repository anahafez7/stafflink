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

import { useI18n } from "@/lib/i18n";

export function NewTaskDialog({ open, onOpenChange, onSave, initialData }: NewTaskDialogProps) {
  const { user } = useAuth();
  const { t, lang } = useI18n();
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
      setDueDate(initialData?.dueDate || "");
      setEstimatedTime(initialData?.estimatedTime || "");
      setPriority(initialData?.priority || "Medium");
    }
  }, [open, initialData]);

  const filteredEmployees = useMemo(() => {
    if (!location) return [];
    return employees.filter((e) => e.branch === location);
  }, [location]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !assignee || !location || !dueDate) {
      toast.error(lang === "ar" ? "يرجى تعبئة جميع الحقول المطلوبة." : "Please fill in all required fields.");
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
    toast.success(
      initialData 
        ? (lang === "ar" ? "تم تحديث المهمة بنجاح!" : "Task updated successfully!") 
        : (lang === "ar" ? "تم إسناد المهمة بنجاح!" : "Task assigned successfully!")
    );
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
          <DialogTitle>
            {initialData 
              ? (lang === "ar" ? "تعديل المهمة" : "Edit Task") 
              : (lang === "ar" ? "إسناد مهمة جديدة" : "Assign New Task")}
          </DialogTitle>
        </DialogHeader>

        <form id="new-task-form" onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">{lang === "ar" ? "عنوان المهمة *" : "Task Title *"}</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={lang === "ar" ? "مثال: مراجعة تقارير الفرع" : "e.g. Conduct site audit"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{lang === "ar" ? "الوصف والتفاصيل" : "Description"}</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={lang === "ar" ? "أدخل تفاصيل ومحددات المهمة..." : "Provide details about the task..."}
              className="resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{lang === "ar" ? "الفرع / الموقع *" : "Location *"}</Label>
              <Select
                value={location}
                onValueChange={(val) => {
                  setLocation(val);
                  setAssignee("");
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={lang === "ar" ? "اختر الفرع" : "Select branch"} />
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
              <Label>{lang === "ar" ? "الموظف المكلف *" : "Assignee *"}</Label>
              <Select value={assignee} onValueChange={setAssignee} disabled={!location}>
                <SelectTrigger>
                  <SelectValue placeholder={location ? (lang === "ar" ? "اختر الموظف" : "Select employee") : (lang === "ar" ? "حدد الفرع أولاً" : "Select location first")} />
                </SelectTrigger>
                <SelectContent>
                  {filteredEmployees.length === 0 ? (
                    <SelectItem value="none" disabled>
                      {lang === "ar" ? `لا يوجد موظفون في ${location}` : `No employees in ${location}`}
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
              <Label htmlFor="dueDate">{lang === "ar" ? "تاريخ التسليم *" : "Due Date *"}</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimatedTime">{lang === "ar" ? "الوقت المقدر" : "Estimated Time"}</Label>
              <Input
                id="estimatedTime"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder={lang === "ar" ? "مثال: 4 ساعات" : "e.g. 2 hours, 3 days"}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("priority", "Priority")}</Label>
            <Select value={priority} onValueChange={(v: any) => setPriority(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="High">{t("high", "High")}</SelectItem>
                <SelectItem value="Medium">{t("medium", "Medium")}</SelectItem>
                <SelectItem value="Low">{t("low", "Low")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </form>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            {lang === "ar" ? "إلغاء" : "Cancel"}
          </Button>
          <Button type="submit" form="new-task-form">
            {initialData ? (lang === "ar" ? "حفظ التغييرات" : "Save Changes") : (lang === "ar" ? "إسناد المهمة" : "Assign Task")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
