import { useState } from "react";
import { LogIn, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { demoAccounts, roleLabels, useAuth } from "@/lib/auth";

export function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("admin@stafflink.io");
  const [password, setPassword] = useState("stafflink");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = signIn(email, password);
    if (!result.ok) setError(result.error ?? "Sign in failed.");
  };

  return (
    <div className="grid min-h-dvh w-full lg:grid-cols-2">
      <div className="gradient-header hidden flex-col justify-between p-10 text-brand-foreground lg:flex">
        <div className="rounded-2xl bg-brand-foreground/95 p-5">
          <img src="/logo.png" alt="StaffLink logo" className="w-full h-auto max-h-48 object-contain" />
        </div>
        <div className="max-w-md space-y-4">
          <h2 className="text-3xl font-semibold leading-tight">
            One workspace for Staff, payroll and performance.
          </h2>
          <p className="text-sm text-brand-foreground/75">
            Role-based access keeps every team focused on the modules they own — from the HR
            directory to payroll runs, geofenced attendance and executive analytics.
          </p>
        </div>
        <p className="text-xs text-brand-foreground/60">Designed by Hafez Rahim</p>
      </div>

      <div className="flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm space-y-6">
          <div className="space-y-3">
            <img
              src="/logo.png"
              alt="StaffLink logo"
              className="h-20 w-auto object-contain object-left sm:h-24"
            />
            <h1 className="text-2xl font-semibold tracking-tight">Sign in to StaffLink</h1>
            <p className="text-sm text-muted-foreground">
              Use a demo account below to explore role-based access.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="login-email">Work email</Label>
              <Input
                id="login-email"
                type="email"
                autoComplete="username"
                value={email}
                maxLength={120}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                maxLength={72}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" className="w-full">
              <LogIn className="size-4" />
              <span>Sign in</span>
            </Button>
          </form>

          <div className="surface-card space-y-2 p-4">
            <p className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <ShieldCheck className="size-3.5" /> Demo accounts · password “stafflink”
            </p>
            <div className="grid gap-1.5">
              {demoAccounts.map((a) => (
                <button
                  key={a.email}
                  type="button"
                  onClick={() => {
                    setEmail(a.email);
                    setPassword(a.password);
                    setError("");
                  }}
                  className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-left text-xs transition-colors hover:bg-accent"
                >
                  <span className="font-medium">{a.email}</span>
                  <span className="text-muted-foreground">{roleLabels[a.role]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}