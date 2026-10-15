import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { demoAccounts } from "@/lib/auth";

/** Creates (once) the real backend account for one of the built-in demo logins. */
export const ensureDemoAccount = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => z.object({ email: z.string().email(), password: z.string().min(1) }).parse(d))
  .handler(async ({ data }) => {
    const match = demoAccounts.find(
      (a) => a.email.toLowerCase() === data.email.trim().toLowerCase() && a.password === data.password,
    );
    if (!match) return { ok: false as const };
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const created = await supabaseAdmin.auth.admin.createUser({
      email: match.email,
      password: match.password,
      email_confirm: true,
      user_metadata: { name: match.name },
    });
    let userId = created.data.user?.id;
    if (!userId) {
      const { data: list } = await supabaseAdmin.auth.admin.listUsers({ perPage: 200 });
      userId = list.users.find((u) => u.email?.toLowerCase() === match.email)?.id;
    }
    if (!userId) return { ok: false as const };
    await supabaseAdmin.from("user_roles").upsert({ user_id: userId, role: match.role }, { onConflict: "user_id,role" });
    return { ok: true as const };
  });
