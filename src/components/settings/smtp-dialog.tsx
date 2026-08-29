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
import { useI18n } from "@/lib/i18n";

interface SmtpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SmtpDialog({ open, onOpenChange }: SmtpDialogProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { t, lang } = useI18n();

  const handleSave = () => {
    toast.success(lang === "ar" ? "تم حفظ إعدادات SMTP بنجاح." : "SMTP settings saved successfully.");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl gap-0 p-0 sm:rounded-2xl">
        <DialogHeader className="px-6 py-5 border-b border-border flex flex-row items-start justify-between">
          <div className="space-y-1">
            <DialogTitle className="text-xl font-semibold">
              {lang === "ar" ? "إعدادات البريد الصادر (SMTP)" : "SMTP / Outgoing Email"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">
              {lang === "ar" 
                ? "يستخدم لإرسال تنبيهات ورسائل النظام للموظفين والمديرين." 
                : "Used to send notification emails. Default provider: Hostinger."}
            </p>
          </div>
          <Button variant="outline" size="sm" className="h-9">
            <Mail className="me-2 size-4" />
            {lang === "ar" ? "الإعدادات الافتراضية" : "Use Hostinger defaults"}
          </Button>
        </DialogHeader>

        <div className="p-6">
          <div className="grid gap-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>{lang === "ar" ? "مزود الخدمة" : "Provider"}</Label>
                <Select defaultValue="custom">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="custom">{lang === "ar" ? "مخصص (Custom)" : "Custom"}</SelectItem>
                    <SelectItem value="hostinger">Hostinger</SelectItem>
                    <SelectItem value="gmail">Gmail</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 rtl:space-x-reverse pt-8">
                <Checkbox id="enable-outgoing" defaultChecked />
                <Label htmlFor="enable-outgoing" className="font-normal cursor-pointer">
                  {lang === "ar" ? "تفعيل إرسال البريد" : "Enable outgoing email"}
                </Label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>{lang === "ar" ? "خادم SMTP (Host)" : "SMTP Host"}</Label>
                <Input placeholder="smtp.hostinger.com" />
              </div>
              <div className="space-y-2">
                <Label>{lang === "ar" ? "المنفذ (Port)" : "Port"}</Label>
                <Input placeholder="465" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 items-end">
              <div className="flex items-center space-x-2 rtl:space-x-reverse pb-3">
                <Checkbox id="use-ssl" defaultChecked />
                <Label htmlFor="use-ssl" className="font-normal cursor-pointer">
                  {lang === "ar" ? "استخدام تشفير SSL/TLS" : "Use SSL/TLS"}
                </Label>
              </div>
              <div className="space-y-2">
                <Label>{lang === "ar" ? "اسم المستخدم / الحساب" : "Username"}</Label>
                <Input placeholder="notifications@company.com" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>{lang === "ar" ? "كلمة المرور" : "Password"}</Label>
                <div className="relative">
                  <Input 
                    type={showPassword ? "text" : "password"} 
                  />
                  <button 
                    type="button" 
                    className="absolute ltr:right-3 rtl:left-3 top-2.5 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>
              <div className="space-y-2">
                <Label>{lang === "ar" ? "عنوان البريد المرسل" : "From email"}</Label>
                <Input placeholder="no-reply@company.com" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>{lang === "ar" ? "اسم المرسل" : "From name"}</Label>
                <Input placeholder="StaffLink HRMS" />
              </div>
              <div className="space-y-2">
                <Label>{lang === "ar" ? "الرد إلى (اختياري)" : "Reply-to (optional)"}</Label>
                <Input placeholder="support@company.com" />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border bg-muted/30 px-6 py-4">
          <p className="text-xs text-muted-foreground">
            {lang === "ar" ? "يتم حفظ وتشفير كلمة المرور في قاعدة البيانات بأمان." : "Password is encrypted and stored safely."}
          </p>
          <Button onClick={handleSave} className="bg-brand hover:bg-brand/90 text-white">
            <Check className="me-2 size-4" />
            {lang === "ar" ? "حفظ الإعدادات" : "Save SMTP"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
