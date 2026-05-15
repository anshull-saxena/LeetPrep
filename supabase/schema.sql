-- Run this in your Supabase SQL editor

-- Enable Row Level Security
alter default privileges in schema public grant all on tables to postgres, anon, authenticated, service_role;

-- Create user_progress table
create table if not exists public.user_progress (
  id uuid default gen_random_uuid() primary key,
  user_id text not null unique,
  completed_questions text[] default '{}',
  saved_code jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.user_progress enable row level security;

-- Policies: users can only access their own data
create policy "Users can view own progress" on public.user_progress
  for select using (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "Users can insert own progress" on public.user_progress
  for insert with check (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

create policy "Users can update own progress" on public.user_progress
  for update using (user_id = current_setting('request.jwt.claims', true)::json->>'sub');

-- Index for faster lookups
create index if not exists idx_user_progress_user_id on public.user_progress(user_id);

-- Function to auto-upsert on insert conflict
create or replace function upsert_user_progress(p_user_id text, p_questions text[], p_saved_code jsonb default '{}')
returns void as $$
begin
  insert into public.user_progress (user_id, completed_questions, saved_code, updated_at)
  values (p_user_id, p_questions, p_saved_code, now())
  on conflict (user_id)
  do update set
    completed_questions = p_questions,
    saved_code = case
      when p_saved_code = '{}'::jsonb then public.user_progress.saved_code
      else p_saved_code
    end,
    updated_at = now();
end;
$$ language plpgsql;
