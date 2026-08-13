import { useState } from "react";
import { Mail, Check, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface SmtpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SmtpDialog({ open, onOpenChange }: SmtpDialogProps) {
  const [showPassword, setShowPassword] = useState(false);

  const handleSave = () => {
    toast.success("SMTP settings saved successfully.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 p-0 sm:rounded-2xl">
        <DialogHeader className="px-6 py-5 border-b border-border flex flex-row items-start justify-between">
          <div className="space-y-1">
            <DialogTitle className="text-xl font-semibold">SMTP / Outgoing Email</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Used to send notification emails. Default provider: Hostinger.
            </p>
          </div>
          <Button variant="outline" size="sm" className="h-9">
            <Mail className="mr-2 size-4" />
            Use Hostinger defaults
          </Button>
        </DialogHeader>

        <div className="p-6">
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Provider</Label>
                <Select defaultValue="custom">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">Custom</SelectItem>
                    <SelectItem value="hostinger">Hostinger</SelectItem>
                    <SelectItem value="gmail">Gmail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Checkbox id="enable-outgoing" defaultChecked />
                <Label htmlFor="enable-outgoing" className="font-normal">Enable outgoing email</Label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>SMTP Host</Label>
                <Input />
              </div>
              <div className="space-y-2">
                <Label>Port</Label>
                <Input />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 items-end">
              <div className="flex items-center space-x-2 pb-3">
                <Checkbox id="use-ssl" defaultChecked />
                <Label htmlFor="use-ssl" className="font-normal">Use SSL/TLS</Label>
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Password</Label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                  />
                  <button 
                    type="button" 
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>From email</Label>
                <Input />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>From name</Label>
                <Input />
              </div>
              <div className="space-y-2">
                <Label>Reply-to (optional)</Label>
                <Input />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border bg-muted/30 px-6 py-4">
          <p className="text-sm text-muted-foreground">
            Password is stored in the database and protected by admin-only RLS.
          </p>
          <Button onClick={handleSave} className="bg-brand hover:bg-brand/90 text-white">
            <Check className="mr-2 size-4" />
            Save SMTP
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
