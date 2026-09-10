-- ELIF OS cloud state
-- Run this ONCE in Supabase Dashboard -> SQL Editor.
create table if not exists public.elif_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.elif_state enable row level security;

-- Replace policies safely if this script is run again.
drop policy if exists "Users can read own ELIF OS state" on public.elif_state;
drop policy if exists "Users can insert own ELIF OS state" on public.elif_state;
drop policy if exists "Users can update own ELIF OS state" on public.elif_state;

create policy "Users can read own ELIF OS state"
  on public.elif_state for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Users can insert own ELIF OS state"
  on public.elif_state for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "Users can update own ELIF OS state"
  on public.elif_state for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on public.elif_state to authenticated;

-- Keep updated_at correct on direct updates.
create or replace function public.elif_state_set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_elif_state_updated_at on public.elif_state;
create trigger trg_elif_state_updated_at
before update on public.elif_state
for each row execute function public.elif_state_set_updated_at();
