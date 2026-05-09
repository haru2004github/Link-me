-- Link click tracking table
create table if not exists public.link_clicks (
  id uuid primary key default gen_random_uuid(),
  link_id uuid not null references public.social_links(id) on delete cascade,
  profile_id uuid not null references public.profiles(id) on delete cascade,
  clicked_at timestamp with time zone default now()
);

alter table public.link_clicks enable row level security;

-- Anyone can insert (public profile visitors)
create policy "link_clicks_insert_public" on public.link_clicks
  for insert with check (true);

-- Only the profile owner can read their analytics
create policy "link_clicks_select_own" on public.link_clicks
  for select using (auth.uid() = profile_id);

-- Profile visit tracking table
create table if not exists public.profile_visits (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  visited_at timestamp with time zone default now()
);

alter table public.profile_visits enable row level security;

create policy "profile_visits_insert_public" on public.profile_visits
  for insert with check (true);

create policy "profile_visits_select_own" on public.profile_visits
  for select using (auth.uid() = profile_id);
