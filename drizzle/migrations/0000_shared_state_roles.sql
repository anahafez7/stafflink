create type public.app_role as enum ('admin', 'hr_manager', 'manager', 'employee');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role public.app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users read own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role public.app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

create or replace function public.is_staff(_user_id uuid)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role in ('admin','hr_manager','manager')) $$;

create table public.shared_state (
  key text primary key,
  value jsonb not null,
  updated_by uuid,
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.shared_state to authenticated;
grant all on public.shared_state to service_role;
alter table public.shared_state enable row level security;

create policy "Signed-in users read shared state" on public.shared_state for select to authenticated using (true);

create policy "Write allowed shared state" on public.shared_state for insert to authenticated
with check (
  key = 'stafflink.leave-requests'
  or key = 'stafflink.punches.' || lower(coalesce(auth.jwt() ->> 'email', ''))
  or public.is_staff(auth.uid())
);
create policy "Update allowed shared state" on public.shared_state for update to authenticated
using (
  key = 'stafflink.leave-requests'
  or key = 'stafflink.punches.' || lower(coalesce(auth.jwt() ->> 'email', ''))
  or public.is_staff(auth.uid())
)
with check (
  key = 'stafflink.leave-requests'
  or key = 'stafflink.punches.' || lower(coalesce(auth.jwt() ->> 'email', ''))
  or public.is_staff(auth.uid())
);

alter table public.shared_state replica identity full;
alter publication supabase_realtime add table public.shared_state;