create extension if not exists "uuid-ossp";

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.conversations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  mode text not null default 'communication',
  title text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.learning_plans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  goal text not null,
  plan_data jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.resources (
  id uuid primary key default uuid_generate_v4(),
  learning_plan_id uuid not null references public.learning_plans (id) on delete cascade,
  title text not null,
  url text not null,
  source text,
  snippet text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create table if not exists public.study_sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subject text not null,
  goal text not null,
  duration_minutes integer not null,
  started_at timestamptz default now(),
  ended_at timestamptz,
  status text not null default 'active' check (status in ('active', 'completed', 'abandoned')),
  focus_score integer,
  created_at timestamptz default now()
);

create table if not exists public.study_events (
  id uuid primary key default uuid_generate_v4(),
  session_id uuid not null references public.study_sessions (id) on delete cascade,
  event_type text not null,
  confidence numeric,
  occurred_at timestamptz default now(),
  metadata jsonb default '{}'::jsonb
);

alter table public.profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;
alter table public.learning_plans enable row level security;
alter table public.resources enable row level security;
alter table public.study_sessions enable row level security;
alter table public.study_events enable row level security;

drop policy if exists "profiles are viewable by owner" on public.profiles;
drop policy if exists "profiles are updatable by owner" on public.profiles;
drop policy if exists "profiles are insertable by owner" on public.profiles;
drop policy if exists "conversations are viewable by owner" on public.conversations;
drop policy if exists "conversations can be inserted by owner" on public.conversations;
drop policy if exists "conversations can be updated by owner" on public.conversations;
drop policy if exists "messages are viewable by owner" on public.messages;
drop policy if exists "messages can be inserted by owner" on public.messages;
drop policy if exists "learning plans are viewable by owner" on public.learning_plans;
drop policy if exists "learning plans can be inserted by owner" on public.learning_plans;
drop policy if exists "learning plans can be updated by owner" on public.learning_plans;
drop policy if exists "resources are viewable by owner through learning plan" on public.resources;
drop policy if exists "study sessions are viewable by owner" on public.study_sessions;
drop policy if exists "study sessions can be inserted by owner" on public.study_sessions;
drop policy if exists "study sessions can be updated by owner" on public.study_sessions;
drop policy if exists "study events are viewable by owner via session" on public.study_events;
drop policy if exists "study events can be inserted by owner" on public.study_events;

create policy "profiles are viewable by owner"
on public.profiles for select using (auth.uid() = id);
create policy "profiles are updatable by owner"
on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
create policy "profiles are insertable by owner"
on public.profiles for insert with check (auth.uid() = id);

create policy "conversations are viewable by owner"
on public.conversations for select using (auth.uid() = user_id);
create policy "conversations can be inserted by owner"
on public.conversations for insert with check (auth.uid() = user_id);
create policy "conversations can be updated by owner"
on public.conversations for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "messages are viewable by owner"
on public.messages for select using (auth.uid() = user_id);
create policy "messages can be inserted by owner"
on public.messages for insert with check (auth.uid() = user_id);

create policy "learning plans are viewable by owner"
on public.learning_plans for select using (auth.uid() = user_id);
create policy "learning plans can be inserted by owner"
on public.learning_plans for insert with check (auth.uid() = user_id);
create policy "learning plans can be updated by owner"
on public.learning_plans for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "resources are viewable by owner through learning plan"
on public.resources for select using (
  exists (
    select 1 from public.learning_plans lp
    where lp.id = resources.learning_plan_id and lp.user_id = auth.uid()
  )
);

create policy "study sessions are viewable by owner"
on public.study_sessions for select using (auth.uid() = user_id);
create policy "study sessions can be inserted by owner"
on public.study_sessions for insert with check (auth.uid() = user_id);
create policy "study sessions can be updated by owner"
on public.study_sessions for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "study events are viewable by owner via session"
on public.study_events for select using (
  exists (
    select 1 from public.study_sessions ss
    where ss.id = study_events.session_id and ss.user_id = auth.uid()
  )
);
create policy "study events can be inserted by owner"
on public.study_events for insert with check (
  exists (
    select 1 from public.study_sessions ss
    where ss.id = study_events.session_id and ss.user_id = auth.uid()
  )
);

drop trigger if exists update_profiles_updated_at on public.profiles;
create trigger update_profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists update_conversations_updated_at on public.conversations;
create trigger update_conversations_updated_at before update on public.conversations
for each row execute function public.set_updated_at();

drop trigger if exists update_learning_plans_updated_at on public.learning_plans;
create trigger update_learning_plans_updated_at before update on public.learning_plans
for each row execute function public.set_updated_at();
