import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/page-header";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { Mail, MapPin, Phone, Lock, Save, Edit3, Camera, Eye, EyeOff, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — StaffLink" },
      {
        property: "og:description",
        content: "Manage your personal information.",
      },
    ],
  }),
  component: ProfilePage,
});

function PasswordChangeForm() {
  const [show, setShow] = useState(false);
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    const pass = Array.from(crypto.getRandomValues(new Uint32Array(16)))
      .map((x) => chars[x % chars.length])
      .join("");
    setNewPass(pass);
    setConfirm(pass);
    setShow(true);
  };

  return (
    <form onSubmit={(e) => { e.preventDefault(); toast.success("Password updated successfully"); document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Escape'})); }} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="current">Current password</Label>
        <div className="relative">
          <Input id="current" type={show ? "text" : "password"} value={current} onChange={e => setCurrent(e.target.value)} required />
          <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 size-7 text-muted-foreground" onClick={() => setShow(!show)}>
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="new">New password</Label>
          <Button type="button" variant="link" size="sm" className="h-auto p-0 text-xs font-normal" onClick={generatePassword}>
            <Wand2 className="mr-1 size-3" />
            Generate
          </Button>
        </div>
        <div className="relative">
          <Input id="new" type={show ? "text" : "password"} value={newPass} onChange={e => setNewPass(e.target.value)} required />
          <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 size-7 text-muted-foreground" onClick={() => setShow(!show)}>
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm">Confirm password</Label>
        <div className="relative">
          <Input id="confirm" type={show ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)} required />
          <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 size-7 text-muted-foreground" onClick={() => setShow(!show)}>
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </Button>
        </div>
      </div>
      <DialogFooter className="pt-4">
        <Button type="submit">Save changes</Button>
      </DialogFooter>
    </form>
  );
}

function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="space-y-5">
      <PageHeader section="Workspace" title="My Profile" description="Manage your personal and employment information" />

      <section className="surface-card p-5">
        <h2 className="text-sm font-semibold">Personal & Employment Info</h2>
        <div className="mt-5 flex min-w-0 items-center gap-4">
          <span className="grid size-16 shrink-0 place-items-center rounded-2xl bg-brand/10 text-xl font-semibold text-brand">
            {user?.initials ?? "—"}
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-medium">{user?.name ?? "Not signed in"}</p>
            <p className="truncate text-sm text-muted-foreground">
              {user?.title} · {user?.email}
            </p>
          </div>
        </div>
        <dl className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="rounded-xl border border-border p-4">
            <dt className="text-xs text-muted-foreground">Employee ID</dt>
            <dd className="mt-1 font-medium">EMP-0142</dd>
          </div>
          <div className="rounded-xl border border-border p-4">
            <dt className="text-xs text-muted-foreground">National ID</dt>
            <dd className="mt-1 font-medium flex items-center justify-between">
              29001011234567
              <span className="text-xs text-warning">Expires in 45 days</span>
            </dd>
          </div>
          <div className="rounded-xl border border-border p-4">
            <dt className="text-xs text-muted-foreground">Department</dt>
            <dd className="mt-1 font-medium">Technology</dd>
          </div>
          <div className="rounded-xl border border-border p-4">
            <dt className="text-xs text-muted-foreground">Position</dt>
            <dd className="mt-1 font-medium">{user?.title ?? "Software Engineer"}</dd>
          </div>
          <div className="rounded-xl border border-border p-4">
            <dt className="text-xs text-muted-foreground">Contract Type</dt>
            <dd className="mt-1 font-medium">Full-time</dd>
          </div>
          <div className="rounded-xl border border-border p-4">
            <dt className="text-xs text-muted-foreground">Contract End Date</dt>
            <dd className="mt-1 font-medium flex items-center justify-between">
              31-12-2027
              <span className="text-xs text-muted-foreground">Expires in 506 days</span>
            </dd>
          </div>
        </dl>
      </section>

      <section className="surface-card p-5">
        <h2 className="text-sm font-semibold">Security</h2>
        <div className="mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-border p-4">
          <div>
            <p className="text-sm font-medium">Password</p>
            <p className="text-xs text-muted-foreground mt-0.5">Ensure your account is using a long, random password to stay secure.</p>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="w-full sm:w-auto shrink-0 border-transparent bg-primary/10 text-primary hover:bg-primary/20 hover:text-primary shadow-none">
                <Lock className="mr-2 size-4" />
                Change password
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Change password</DialogTitle>
                <DialogDescription>
                  Update your password here. We recommend using a strong, random password.
                </DialogDescription>
              </DialogHeader>
              <PasswordChangeForm />
            </DialogContent>
          </Dialog>
        </div>
      </section>
    </div>
  );
}
