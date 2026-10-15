import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ModuleKey =
  | "dashboard"
  | "hr"
  | "attendance"
  | "payroll"
  | "recruitment"
  | "performance"
  | "documents"
  | "self-service"
  | "analytics"
  | "settings"
  | "users"
  | "locations"
  | "tasks"
  | "onboarding"
  | "expenses"
  | "assets"
  | "disciplinary"
  | "training"
  | "engagement";

export type Role = "admin" | "hr_manager" | "manager" | "employee";

export const roleLabels: Record<Role, string> = {
  admin: "System Administrator",
  hr_manager: "HR Manager",
  manager: "Department Manager",
  employee: "Employee",
};

const allModules: ModuleKey[] = [
  "dashboard",
  "hr",
  "attendance",
  "payroll",
  "recruitment",
  "performance",
  "documents",
  "self-service",
  "analytics",
  "settings",
  "users",
  "locations",
  "tasks",
  "onboarding",
  "expenses",
  "assets",
  "disciplinary",
  "training",
  "engagement",
];

export const rolePermissions: Record<Role, ModuleKey[]> = {
  admin: allModules,
  hr_manager: [
    "dashboard",
    "hr",
    "attendance",
    "payroll",
    "recruitment",
    "performance",
    "documents",
    "onboarding",
    "expenses",
    "assets",
    "disciplinary",
    "training",
    "engagement",
    "analytics",
    "tasks",
    "self-service",
    "settings",
  ],
  manager: [
    "dashboard",
    "hr",
    "attendance",
    "tasks",
    "performance",
    "documents",
    "self-service",
    "onboarding",
    "expenses",
    "assets",
    "disciplinary",
    "training",
    "engagement",
    "analytics",
  ],
  employee: [
    "dashboard",
    "self-service",
    "documents",
    "tasks",
    "expenses",
    "assets",
    "training",
    "engagement",
  ],
};

export type SessionUser = {
  name: string;
  email: string;
  role: Role;
  initials: string;
  title: string;
};

type DemoAccount = SessionUser & { password: string };

export const demoAccounts: DemoAccount[] = [
  {
    name: "Hafez Rahim",
    email: "admin@stafflink.io",
    password: "stafflink",
    role: "admin",
    initials: "HR",
    title: "System Administrator",
  },
  {
    name: "Nadia Farouk",
    email: "hr@stafflink.io",
    password: "stafflink",
    role: "hr_manager",
    initials: "NF",
    title: "HR Director",
  },
  {
    name: "Omar Saleh",
    email: "manager@stafflink.io",
    password: "stafflink",
    role: "manager",
    initials: "OS",
    title: "Operations Manager",
  },
  {
    name: "Lina Habib",
    email: "employee@stafflink.io",
    password: "stafflink",
    role: "employee",
    initials: "LH",
    title: "Software Engineer",
  },
];

export const pathToModule = (pathname: string): ModuleKey => {
  const segment = pathname.split("/").filter(Boolean)[0];
  if (!segment) return "dashboard";
  if (segment === "profile" || segment === "leaves") return "self-service";
  if (segment === "employees") return "hr";
  if (segment === "configuration") return "settings";
  return (allModules.includes(segment as ModuleKey) ? segment : "dashboard") as ModuleKey;
};

export const moduleHome = (role: Role) => {
  const first = rolePermissions[role][0];
  return first === "dashboard" ? "/" : `/${first}`;
};

type AuthValue = {
  user: SessionUser | null;
  ready: boolean;
  signIn: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  signOut: () => void;
  can: (module: ModuleKey) => boolean;
};

const AuthContext = createContext<AuthValue | null>(null);

const toSession = (email?: string | null): SessionUser | null => {
  const match = demoAccounts.find((a) => a.email.toLowerCase() === (email ?? "").toLowerCase());
  if (!match) return null;
  const { password: _pw, ...session } = match;
  return session;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void import("@/integrations/supabase/client").then(({ supabase }) => {
      if (cancelled) return;
      supabase.auth.getSession().then(({ data }) => {
        setUser(toSession(data.session?.user.email));
        setReady(true);
      });
      const { data } = supabase.auth.onAuthStateChange((_e, session) => setUser(toSession(session?.user.email)));
      unsub = () => data.subscription.unsubscribe();
    });
    let unsub = () => {};
    return () => {
      cancelled = true;
      unsub();
    };
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const { supabase } = await import("@/integrations/supabase/client");
    const clean = email.trim().toLowerCase();
    const backendPw = `${password}#StaffLink-Cloud`;
    let { error } = await supabase.auth.signInWithPassword({ email: clean, password: backendPw });
    if (error && demoAccounts.some((a) => a.email === clean && a.password === password)) {
      const { ensureDemoAccount } = await import("@/lib/demo-accounts.functions");
      const res = await ensureDemoAccount({ data: { email: clean, password } });
      if (res.ok) ({ error } = await supabase.auth.signInWithPassword({ email: clean, password: backendPw }));
    }
    if (error) return { ok: false, error: "Invalid email or password." };
    return { ok: true };
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    void import("@/integrations/supabase/client").then(({ supabase }) => supabase.auth.signOut());
  }, []);

  const value = useMemo<AuthValue>(
    () => ({
      user,
      ready,
      signIn,
      signOut,
      can: (module: ModuleKey) => (user ? rolePermissions[user.role].includes(module) : false),
    }),
    [user, ready, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}