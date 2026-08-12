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
  | "locations";

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
];

export const rolePermissions: Record<Role, ModuleKey[]> = {
  admin: allModules.filter(m => m !== "self-service"),
  hr_manager: [
    "dashboard",
    "hr",
    "attendance",
    "payroll",
    "recruitment",
    "performance",
    "documents",
    "analytics",
    "locations",
  ],
  manager: ["dashboard", "attendance", "performance", "analytics"],
  employee: ["self-service", "documents"],
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
  return (allModules.includes(segment as ModuleKey) ? segment : "dashboard") as ModuleKey;
};

export const moduleHome = (role: Role) => {
  const first = rolePermissions[role][0];
  return first === "dashboard" ? "/" : `/${first}`;
};

type AuthValue = {
  user: SessionUser | null;
  ready: boolean;
  signIn: (email: string, password: string) => { ok: boolean; error?: string };
  signOut: () => void;
  can: (module: ModuleKey) => boolean;
};

const AuthContext = createContext<AuthValue | null>(null);
const STORAGE_KEY = "stafflink.session";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) setUser(JSON.parse(raw) as SessionUser);
    } catch {
      /* ignore corrupted session */
    }
    setReady(true);
  }, []);

  const signIn = useCallback((email: string, password: string) => {
    const match = demoAccounts.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password,
    );
    if (!match) return { ok: false, error: "Invalid email or password." };
    const { password: _pw, ...session } = match;
    setUser(session);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return { ok: true };
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
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