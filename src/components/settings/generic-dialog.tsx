import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Check } from "lucide-react";

interface GenericDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  fields: { label: string; type?: string }[];
}

export function GenericDialog({ open, onOpenChange, title, description, fields }: GenericDialogProps) {
  const handleSave = () => {
    toast.success(`${title} saved successfully.`);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md gap-0 p-0 sm:rounded-2xl">
        <DialogHeader className="px-6 py-5 border-b border-border">
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <p className="text-sm text-muted-foreground">{description}</p>
        </DialogHeader>

        <div className="p-6 space-y-4">
          {fields.map((field) => (
            <div key={field.label} className="space-y-2">
              <Label>{field.label}</Label>
              <Input type={field.type || "text"} />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end border-t border-border bg-muted/30 px-6 py-4">
          <Button onClick={handleSave} className="bg-brand hover:bg-brand/90 text-white">
            <Check className="mr-2 size-4" />
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
